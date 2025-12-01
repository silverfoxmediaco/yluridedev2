const express = require('express');
const router = express.Router();
const Van = require('../models/Van');

// @route   GET /api/vans
// @desc    Get all active vans
// @access  Public
router.get('/', async (req, res) => {
  try {
    const vans = await Van.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(vans);
  } catch (error) {
    console.error('Error fetching vans:', error);
    res.status(500).json({ message: 'Server error fetching vans' });
  }
});

// @route   GET /api/vans/:id
// @desc    Get single van by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const van = await Van.findById(req.params.id);
    if (!van) {
      return res.status(404).json({ message: 'Van not found' });
    }
    res.json(van);
  } catch (error) {
    console.error('Error fetching van:', error);
    res.status(500).json({ message: 'Server error fetching van' });
  }
});

// @route   GET /api/vans/:id/availability
// @desc    Check van availability for specific dates
// @access  Public
router.get('/:id/availability', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }

    const van = await Van.findById(req.params.id);
    if (!van) {
      return res.status(404).json({ message: 'Van not found' });
    }

    const isAvailable = van.isAvailableForDates(startDate, endDate);
    const pricing = van.calculatePrice(startDate, endDate);

    res.json({
      vanId: van._id,
      isAvailable,
      pricing,
      bookedDates: van.bookedDates,
    });
  } catch (error) {
    console.error('Error checking availability:', error);
    res.status(500).json({ message: 'Server error checking availability' });
  }
});

// @route   GET /api/vans/:id/price
// @desc    Calculate price for rental duration
// @access  Public
router.get('/:id/price', async (req, res) => {
  try {
    const { startDate, endDate, includeDestinationFee } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }

    const van = await Van.findById(req.params.id);
    if (!van) {
      return res.status(404).json({ message: 'Van not found' });
    }

    const pricing = van.calculatePrice(startDate, endDate, includeDestinationFee === 'true');

    res.json(pricing);
  } catch (error) {
    console.error('Error calculating price:', error);
    res.status(500).json({ message: 'Server error calculating price' });
  }
});

// @route   POST /api/vans
// @desc    Add new van
// @access  Private/Admin
router.post('/', async (req, res) => {
  try {
    const {
      name,
      type,
      year,
      seating,
      description,
      features,
      thumbnailImage,
      images,
      pricing,
    } = req.body;

    const van = new Van({
      name,
      type,
      year,
      seating,
      description,
      features,
      thumbnailImage,
      images,
      pricing,
    });

    await van.save();
    res.status(201).json(van);
  } catch (error) {
    console.error('Error creating van:', error);
    res.status(500).json({ message: 'Server error creating van' });
  }
});

// @route   PUT /api/vans/:id
// @desc    Update van
// @access  Private/Admin
router.put('/:id', async (req, res) => {
  try {
    const van = await Van.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!van) {
      return res.status(404).json({ message: 'Van not found' });
    }

    res.json(van);
  } catch (error) {
    console.error('Error updating van:', error);
    res.status(500).json({ message: 'Server error updating van' });
  }
});

// @route   DELETE /api/vans/:id
// @desc    Delete van (soft delete by setting isActive to false)
// @access  Private/Admin
router.delete('/:id', async (req, res) => {
  try {
    const van = await Van.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!van) {
      return res.status(404).json({ message: 'Van not found' });
    }

    res.json({ message: 'Van deleted successfully' });
  } catch (error) {
    console.error('Error deleting van:', error);
    res.status(500).json({ message: 'Server error deleting van' });
  }
});

// @route   POST /api/vans/seed
// @desc    Seed sample vans for testing
// @access  Private/Admin
router.post('/seed', async (req, res) => {
  try {
    const sampleVans = [
      {
        name: 'Mercedes Sprinter Luxury',
        type: 'Sprinter',
        year: 2024,
        seating: 14,
        description: 'Our flagship luxury Sprinter van with premium amenities.',
        features: ['Leather Seats', 'WiFi', 'TV Screens', 'USB Charging', 'Climate Control', 'Tinted Windows'],
        thumbnailImage: '/images/vans/sprinter-luxury-thumb.jpg',
        images: ['/images/vans/sprinter-luxury-1.jpg', '/images/vans/sprinter-luxury-2.jpg'],
        pricing: {
          hourlyRate: 75,
          dailyRate: 450,
          weeklyRate: 2500,
          deposit: 500,
          insuranceFee: 75,
          destinationFee: 50,
          minimumHours: 4,
        },
        availability: true,
        isActive: true,
      },
      {
        name: 'Executive Sprinter',
        type: 'Sprinter',
        year: 2023,
        seating: 12,
        description: 'Executive class Sprinter perfect for corporate events.',
        features: ['Executive Seating', 'Conference Setup', 'WiFi', 'Privacy Partition'],
        thumbnailImage: '/images/vans/executive-sprinter-thumb.jpg',
        images: ['/images/vans/executive-sprinter-1.jpg'],
        pricing: {
          hourlyRate: 65,
          dailyRate: 400,
          weeklyRate: 2200,
          deposit: 500,
          insuranceFee: 75,
          destinationFee: 50,
          minimumHours: 4,
        },
        availability: true,
        isActive: true,
      },
      {
        name: 'Party Sprinter',
        type: 'Sprinter',
        year: 2024,
        seating: 10,
        description: 'Party-ready Sprinter with premium sound system and lighting.',
        features: ['Sound System', 'LED Lighting', 'Cooler', 'USB Charging'],
        thumbnailImage: '/images/vans/party-sprinter-thumb.jpg',
        images: [],
        pricing: {
          hourlyRate: 85,
          dailyRate: 500,
          weeklyRate: 2800,
          deposit: 750,
          insuranceFee: 100,
          destinationFee: 50,
          minimumHours: 4,
        },
        availability: true,
        isActive: true,
      },
    ];

    await Van.deleteMany({}); // Clear existing vans
    const vans = await Van.insertMany(sampleVans);
    res.status(201).json({ message: 'Sample vans seeded successfully', vans });
  } catch (error) {
    console.error('Error seeding vans:', error);
    res.status(500).json({ message: 'Server error seeding vans' });
  }
});

module.exports = router;
