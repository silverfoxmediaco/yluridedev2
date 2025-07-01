const express = require('express');
const router = express.Router();

// @route   GET /api/vans
// @desc    Get all vans
// @access  Public
router.get('/', (req, res) => {
  res.json({ message: 'Get all vans' });
});

// @route   GET /api/vans/:id
// @desc    Get single van
// @access  Public
router.get('/:id', (req, res) => {
  res.json({ message: `Get van ${req.params.id}` });
});

// @route   POST /api/vans
// @desc    Add new van
// @access  Private/Admin
router.post('/', (req, res) => {
  res.json({ message: 'Add new van' });
});

// @route   PUT /api/vans/:id
// @desc    Update van
// @access  Private/Admin
router.put('/:id', (req, res) => {
  res.json({ message: `Update van ${req.params.id}` });
});

// @route   DELETE /api/vans/:id
// @desc    Delete van
// @access  Private/Admin
router.delete('/:id', (req, res) => {
  res.json({ message: `Delete van ${req.params.id}` });
});

module.exports = router;