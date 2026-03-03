// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const Van = require('../models/Van');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const { sendListingApprovedEmail, sendListingRejectedEmail } = require('../utils/emailService');

// All admin routes require auth + admin role
router.use(protect, authorize('admin'));

// @route   GET /api/admin/stats
// @desc    Platform overview stats
// @access  Admin
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const customers = await User.countDocuments({ role: 'customer' });
    const owners = await User.countDocuments({ role: 'owner' });
    const verifiedOwners = await User.countDocuments({ role: 'owner', 'ownerProfile.isVerified': true });

    const totalVans = await Van.countDocuments();
    const fleetVans = await Van.countDocuments({ listingType: 'fleet' });
    const marketplaceVans = await Van.countDocuments({ listingType: 'marketplace' });
    const pendingReview = await Van.countDocuments({ approvalStatus: 'pending_review' });
    const approvedVans = await Van.countDocuments({ approvalStatus: 'approved' });

    res.json({
      users: { total: totalUsers, customers, owners, verifiedOwners },
      vans: { total: totalVans, fleet: fleetVans, marketplace: marketplaceVans, pendingReview, approved: approvedVans }
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/listings
// @desc    Get all marketplace listings (with optional status filter)
// @access  Admin
router.get('/listings', async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { listingType: 'marketplace' };
    if (status) filter.approvalStatus = status;

    const vans = await Van.find(filter)
      .populate('owner', 'firstName lastName email phone ownerProfile.businessName ownerProfile.isVerified')
      .sort({ updatedAt: -1 });

    res.json(vans);
  } catch (error) {
    console.error('Admin listings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/listings/:id
// @desc    Get single listing detail for review
// @access  Admin
router.get('/listings/:id', async (req, res) => {
  try {
    const van = await Van.findById(req.params.id)
      .populate('owner', 'firstName lastName email phone ownerProfile');

    if (!van) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    res.json(van);
  } catch (error) {
    console.error('Admin listing detail error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/listings/:id/approve
// @desc    Approve a listing
// @access  Admin
router.put('/listings/:id/approve', async (req, res) => {
  try {
    const van = await Van.findById(req.params.id).populate('owner', 'firstName lastName email');

    if (!van) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    van.approvalStatus = 'approved';
    van.isActive = true;
    van.reviewedBy = req.user._id;
    van.reviewedAt = new Date();
    van.adminNotes = req.body.notes || '';
    await van.save();

    // Send approval email to owner
    if (van.owner && van.owner.email) {
      sendListingApprovedEmail({
        ownerEmail: van.owner.email,
        ownerName: van.owner.firstName,
        vanName: van.name
      });
    }

    res.json({ message: 'Listing approved', van });
  } catch (error) {
    console.error('Approve listing error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/listings/:id/reject
// @desc    Reject a listing
// @access  Admin
router.put('/listings/:id/reject', async (req, res) => {
  try {
    const van = await Van.findById(req.params.id).populate('owner', 'firstName lastName email');

    if (!van) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    van.approvalStatus = 'rejected';
    van.isActive = false;
    van.reviewedBy = req.user._id;
    van.reviewedAt = new Date();
    van.adminNotes = req.body.notes || '';
    await van.save();

    // Send rejection email to owner
    if (van.owner && van.owner.email) {
      sendListingRejectedEmail({
        ownerEmail: van.owner.email,
        ownerName: van.owner.firstName,
        vanName: van.name,
        reason: req.body.notes
      });
    }

    res.json({ message: 'Listing rejected', van });
  } catch (error) {
    console.error('Reject listing error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/listings/:id/suspend
// @desc    Suspend an approved listing
// @access  Admin
router.put('/listings/:id/suspend', async (req, res) => {
  try {
    const van = await Van.findById(req.params.id);

    if (!van) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    van.approvalStatus = 'suspended';
    van.isActive = false;
    van.reviewedBy = req.user._id;
    van.reviewedAt = new Date();
    van.adminNotes = req.body.notes || '';
    await van.save();

    res.json({ message: 'Listing suspended', van });
  } catch (error) {
    console.error('Suspend listing error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users (with optional role filter)
// @access  Admin
router.get('/users', async (req, res) => {
  try {
    const { role } = req.query;
    const filter = {};
    if (role) filter.role = role;

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/users/:id
// @desc    Update user (role, isActive)
// @access  Admin
router.put('/users/:id', async (req, res) => {
  try {
    const { role, isActive } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent admin from deactivating themselves
    if (req.params.id === req.user._id.toString() && isActive === false) {
      return res.status(400).json({ message: 'Cannot deactivate your own account' });
    }

    if (role) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;

    await user.save();

    res.json({ message: 'User updated', user });
  } catch (error) {
    console.error('Admin update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/users/:id/verify-owner
// @desc    Verify an owner's documents
// @access  Admin
router.put('/users/:id/verify-owner', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'owner') {
      return res.status(400).json({ message: 'User is not an owner' });
    }

    if (!user.ownerProfile) {
      user.ownerProfile = {};
    }

    // Update individual document statuses if provided
    if (req.body.documents) {
      for (const [docType, status] of Object.entries(req.body.documents)) {
        if (user.ownerProfile.documents && user.ownerProfile.documents[docType]) {
          user.ownerProfile.documents[docType].status = status;
        }
      }
    }

    // Set overall verification status
    if (req.body.isVerified !== undefined) {
      user.ownerProfile.isVerified = req.body.isVerified;
    }

    await user.save();

    res.json({ message: 'Owner verification updated', user });
  } catch (error) {
    console.error('Verify owner error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
