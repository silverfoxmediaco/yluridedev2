const express = require('express');
const router = express.Router();

// @route   POST /api/payments/create-payment-intent
// @desc    Create Stripe payment intent
// @access  Private
router.post('/create-payment-intent', (req, res) => {
  res.json({ message: 'Create payment intent' });
});

// @route   POST /api/payments/confirm
// @desc    Confirm payment
// @access  Private
router.post('/confirm', (req, res) => {
  res.json({ message: 'Confirm payment' });
});

// @route   GET /api/payments/history
// @desc    Get payment history
// @access  Private
router.get('/history', (req, res) => {
  res.json({ message: 'Get payment history' });
});

module.exports = router;