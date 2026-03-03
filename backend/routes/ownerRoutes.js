// backend/routes/ownerRoutes.js
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Van = require('../models/Van');
const User = require('../models/User');
const { protect, authorize, requireEmailVerified } = require('../middleware/auth');

// All owner routes require auth + owner/admin role
router.use(protect, authorize('owner', 'admin'));

// @route   GET /api/owner/dashboard
// @desc    Get owner dashboard stats
// @access  Owner/Admin
router.get('/dashboard', async (req, res) => {
  try {
    const ownerId = req.user._id;

    const vans = await Van.find({ owner: ownerId });

    const stats = {
      totalListings: vans.length,
      approved: vans.filter(v => v.approvalStatus === 'approved').length,
      pendingReview: vans.filter(v => v.approvalStatus === 'pending_review').length,
      drafts: vans.filter(v => v.approvalStatus === 'draft').length,
      rejected: vans.filter(v => v.approvalStatus === 'rejected').length,
      activeListings: vans.filter(v => v.approvalStatus === 'approved' && v.isActive).length,
    };

    res.json({ stats, vans });
  } catch (error) {
    console.error('Owner dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/owner/vans
// @desc    Get all vans owned by current user
// @access  Owner/Admin
router.get('/vans', async (req, res) => {
  try {
    const vans = await Van.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json(vans);
  } catch (error) {
    console.error('Get owner vans error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/owner/vans
// @desc    Create a new van listing (draft)
// @access  Owner/Admin (email verified)
router.post('/vans', requireEmailVerified, [
  body('name').trim().notEmpty().withMessage('Van name is required'),
  body('type').isIn(['Sprinter', 'Transit', 'Metris', 'Other']).withMessage('Invalid van type'),
  body('year').isInt({ min: 2000, max: 2030 }).withMessage('Valid year is required'),
  body('seating').isInt({ min: 1, max: 50 }).withMessage('Valid seating capacity is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('pricing.dailyRate').isFloat({ min: 1 }).withMessage('Daily rate is required'),
  body('pricing.hourlyRate').isFloat({ min: 1 }).withMessage('Hourly rate is required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  try {
    const vanData = {
      ...req.body,
      owner: req.user._id,
      listingType: 'marketplace',
      approvalStatus: 'draft',
      isActive: false
    };

    const van = await Van.create(vanData);
    res.status(201).json(van);
  } catch (error) {
    console.error('Create van listing error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/owner/vans/:id
// @desc    Update a van listing
// @access  Owner/Admin (email verified)
router.put('/vans/:id', requireEmailVerified, async (req, res) => {
  try {
    const van = await Van.findById(req.params.id);

    if (!van) {
      return res.status(404).json({ message: 'Van not found' });
    }

    // Only owner of this van or admin can update
    if (van.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this listing' });
    }

    // Don't allow updating certain fields
    const { owner, listingType, approvalStatus, reviewedBy, reviewedAt, adminNotes, ...updateData } = req.body;

    // If van was rejected, allow re-editing (reset to draft)
    if (van.approvalStatus === 'rejected') {
      updateData.approvalStatus = 'draft';
    }

    const updatedVan = await Van.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    res.json(updatedVan);
  } catch (error) {
    console.error('Update van listing error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/owner/vans/:id/submit
// @desc    Submit listing for review
// @access  Owner/Admin (email verified)
router.put('/vans/:id/submit', requireEmailVerified, async (req, res) => {
  try {
    const van = await Van.findById(req.params.id);

    if (!van) {
      return res.status(404).json({ message: 'Van not found' });
    }

    if (van.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (!['draft', 'rejected'].includes(van.approvalStatus)) {
      return res.status(400).json({ message: 'Only draft or rejected listings can be submitted for review' });
    }

    // Basic validation before submission
    if (!van.images || van.images.length === 0) {
      return res.status(400).json({ message: 'At least one image is required before submitting' });
    }

    if (!van.thumbnailImage) {
      return res.status(400).json({ message: 'A thumbnail image is required before submitting' });
    }

    van.approvalStatus = 'pending_review';
    await van.save();

    res.json({ message: 'Listing submitted for review', van });
  } catch (error) {
    console.error('Submit for review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/owner/vans/:id
// @desc    Soft delete a van listing
// @access  Owner/Admin
router.delete('/vans/:id', async (req, res) => {
  try {
    const van = await Van.findById(req.params.id);

    if (!van) {
      return res.status(404).json({ message: 'Van not found' });
    }

    if (van.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    van.isActive = false;
    van.approvalStatus = 'suspended';
    await van.save();

    res.json({ message: 'Listing deactivated' });
  } catch (error) {
    console.error('Delete van listing error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/owner/documents
// @desc    Save uploaded document reference to user profile
// @access  Owner/Admin (email verified)
router.post('/documents', requireEmailVerified, async (req, res) => {
  try {
    const { docType, url, key } = req.body;

    const validDocTypes = ['governmentId', 'vanRegistration', 'safetyInspection', 'proofOfInsurance'];
    if (!validDocTypes.includes(docType)) {
      return res.status(400).json({ message: 'Invalid document type' });
    }

    const user = await User.findById(req.user._id);
    if (!user || user.role !== 'owner') {
      return res.status(400).json({ message: 'Only owners can upload documents' });
    }

    if (!user.ownerProfile) {
      user.ownerProfile = { documents: {} };
    }
    if (!user.ownerProfile.documents) {
      user.ownerProfile.documents = {};
    }

    user.ownerProfile.documents[docType] = {
      url,
      key,
      uploadedAt: new Date(),
      status: 'pending'
    };

    await user.save();

    res.json({
      message: 'Document saved',
      document: user.ownerProfile.documents[docType]
    });
  } catch (error) {
    console.error('Save document error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
