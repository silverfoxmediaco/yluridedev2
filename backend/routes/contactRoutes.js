// backend/routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { sendContactEmail } = require('../utils/emailService');

// Rate limiter: 5 requests per 15 minutes per IP
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// @route   POST /api/contact
// @desc    Handle contact form submission
// @access  Public
router.post('/', contactLimiter, async (req, res) => {
  try {
    // Honeypot check — bots fill hidden "website" field, humans don't
    if (req.body.website) {
      return res.json({ success: true, message: 'Your message has been sent successfully' });
    }

    const { name, email, phone, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields',
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    // Send email to bookings
    await sendContactEmail({
      name,
      email,
      phone: phone || 'Not provided',
      subject,
      message,
    });

    res.json({
      success: true,
      message: 'Your message has been sent successfully',
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again later.',
    });
  }
});

module.exports = router;
