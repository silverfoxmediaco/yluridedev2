const express = require('express');
const router = express.Router();

// @route   GET /api/bookings
// @desc    Get all bookings
// @access  Private
router.get('/', (req, res) => {
  res.json({ message: 'Get all bookings' });
});

// @route   POST /api/bookings
// @desc    Create new booking
// @access  Private
router.post('/', (req, res) => {
  res.json({ message: 'Create booking' });
});

// @route   GET /api/bookings/:id
// @desc    Get single booking
// @access  Private
router.get('/:id', (req, res) => {
  res.json({ message: `Get booking ${req.params.id}` });
});

// @route   PUT /api/bookings/:id
// @desc    Update booking
// @access  Private
router.put('/:id', (req, res) => {
  res.json({ message: `Update booking ${req.params.id}` });
});

// @route   DELETE /api/bookings/:id
// @desc    Cancel booking
// @access  Private
router.delete('/:id', (req, res) => {
  res.json({ message: `Cancel booking ${req.params.id}` });
});

module.exports = router;