// frontend/src/pages/Contact.jsx
import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Email,
  Phone,
  LocationOn,
  Send,
} from '@mui/icons-material';
import '../styles/Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatPhoneNumber = (value) => {
    const phoneNumber = value.replace(/\D/g, '');
    if (phoneNumber.length <= 3) return phoneNumber;
    if (phoneNumber.length <= 6) return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData(prev => ({
      ...prev,
      phone: formatted,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiUrl}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus({ type: 'success', message: 'Thank you! Your message has been sent. We\'ll get back to you soon.' });
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
      } else {
        throw new Error(data.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitStatus({ type: 'error', message: 'Failed to send message. Please try again or email us directly.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box className="contact-page">
      {/* Hero Section */}
      <Box className="contact-hero">
        <Container maxWidth="lg">
          <Typography variant="h2" className="contact-hero-title">
            Contact Us
          </Typography>
          <Typography variant="h6" className="contact-hero-subtitle">
            Have questions? We'd love to hear from you.
          </Typography>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" className="contact-container">
        <Box className="contact-content">
          {/* Contact Form */}
          <Paper className="contact-form-paper">
            <Typography variant="h5" className="contact-form-title">
              Send Us a Message
            </Typography>

            {submitStatus && (
              <Alert
                severity={submitStatus.type}
                sx={{ mb: 3 }}
                onClose={() => setSubmitStatus(null)}
              >
                {submitStatus.message}
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="contact-form">
              <TextField
                label="Your Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
                className="contact-input"
              />

              <TextField
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                required
                className="contact-input"
              />

              <TextField
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handlePhoneChange}
                fullWidth
                placeholder="(555) 123-4567"
                className="contact-input"
              />

              <TextField
                label="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                fullWidth
                required
                className="contact-input"
              />

              <TextField
                label="Message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                fullWidth
                required
                multiline
                rows={5}
                className="contact-input"
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isSubmitting}
                className="contact-submit-btn"
                endIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Send />}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </Paper>

          {/* Contact Info */}
          <Box className="contact-info">
            <Paper className="contact-info-paper">
              <Typography variant="h5" className="contact-info-title">
                Get in Touch
              </Typography>

              <Box className="contact-info-item">
                <Email className="contact-info-icon" />
                <Box>
                  <Typography variant="subtitle2" className="contact-info-label">
                    Email
                  </Typography>
                  <Typography variant="body1">
                    <a href="mailto:bookings@ntxluxuryvanrentals.com" className="contact-info-link">
                      bookings@ntxluxuryvanrentals.com
                    </a>
                  </Typography>
                </Box>
              </Box>

              <Box className="contact-info-item">
                <Phone className="contact-info-icon" />
                <Box>
                  <Typography variant="subtitle2" className="contact-info-label">
                    Phone
                  </Typography>
                  <Typography variant="body1">
                    <a href="tel:+15551234567" className="contact-info-link">
                      (555) 123-4567
                    </a>
                  </Typography>
                </Box>
              </Box>

              <Box className="contact-info-item">
                <LocationOn className="contact-info-icon" />
                <Box>
                  <Typography variant="subtitle2" className="contact-info-label">
                    Location
                  </Typography>
                  <Typography variant="body1">
                    Dallas-Fort Worth, Texas
                  </Typography>
                </Box>
              </Box>
            </Paper>

            <Paper className="contact-hours-paper">
              <Typography variant="h6" className="contact-hours-title">
                Business Hours
              </Typography>
              <Box className="contact-hours-list">
                <Box className="contact-hours-row">
                  <Typography>Monday - Friday</Typography>
                  <Typography>8:00 AM - 8:00 PM</Typography>
                </Box>
                <Box className="contact-hours-row">
                  <Typography>Saturday</Typography>
                  <Typography>9:00 AM - 6:00 PM</Typography>
                </Box>
                <Box className="contact-hours-row">
                  <Typography>Sunday</Typography>
                  <Typography>10:00 AM - 4:00 PM</Typography>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Contact;
