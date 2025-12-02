// frontend/src/pages/BookingSuccess.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  CircularProgress,
  Button,
  Divider,
} from '@mui/material';
import {
  CheckCircle,
  CalendarMonth,
  Person,
  DirectionsCar,
  Email,
} from '@mui/icons-material';
import '../styles/BookingSuccess.css';

const BookingSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [error, setError] = useState('');

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      fetchSessionDetails();
    } else {
      setError('No session ID found');
      setLoading(false);
    }
  }, [sessionId]);

  const fetchSessionDetails = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiUrl}/api/payments/session/${sessionId}`);
      const data = await response.json();

      if (data.success) {
        setSession(data.session);
      } else {
        setError(data.message || 'Failed to load booking details');
      }
    } catch (err) {
      console.error('Error fetching session:', err);
      setError('Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Box className="booking-success-loading">
        <CircularProgress size={60} sx={{ color: '#002244' }} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading your booking details...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" className="booking-success-container">
        <Paper className="booking-success-paper booking-success-error">
          <Typography variant="h5" color="error" gutterBottom>
            Something went wrong
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            {error}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/booking')}
            sx={{ backgroundColor: '#002244' }}
          >
            Return to Booking
          </Button>
        </Paper>
      </Container>
    );
  }

  const { metadata } = session || {};

  return (
    <Box className="booking-success-page">
      <Container maxWidth="md" className="booking-success-container">
        <Paper className="booking-success-paper">
          {/* Success Header */}
          <Box className="booking-success-header">
            <CheckCircle className="booking-success-icon" />
            <Typography variant="h4" className="booking-success-title">
              Booking Confirmed!
            </Typography>
            <Typography variant="body1" className="booking-success-subtitle">
              Thank you for choosing NTX Luxury Van Rentals
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Booking Details */}
          {metadata && (
            <Box className="booking-success-details">
              {/* Van Info */}
              <Box className="booking-success-section">
                <Box className="booking-success-section-header">
                  <DirectionsCar className="booking-success-section-icon" />
                  <Typography variant="h6">Vehicle</Typography>
                </Box>
                <Typography variant="body1" className="booking-success-van-name">
                  {metadata.vanName}
                </Typography>
              </Box>

              {/* Date & Time */}
              <Box className="booking-success-section">
                <Box className="booking-success-section-header">
                  <CalendarMonth className="booking-success-section-icon" />
                  <Typography variant="h6">Pickup Date & Time</Typography>
                </Box>
                <Typography variant="body1">
                  {formatDate(metadata.pickupDate)} at {metadata.pickupTime}
                </Typography>
                {metadata.pickupAddress && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Location: {metadata.pickupAddress}
                  </Typography>
                )}
              </Box>

              {/* Customer Info */}
              <Box className="booking-success-section">
                <Box className="booking-success-section-header">
                  <Person className="booking-success-section-icon" />
                  <Typography variant="h6">Customer</Typography>
                </Box>
                <Typography variant="body1">{metadata.customerName}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {metadata.customerEmail}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {metadata.customerPhone}
                </Typography>
              </Box>

              {/* Payment Summary */}
              <Box className="booking-success-section">
                <Box className="booking-success-section-header">
                  <Typography variant="h6">Payment Summary</Typography>
                </Box>
                <Box className="booking-success-payment-row">
                  <Typography>Rental Fee</Typography>
                  <Typography>{formatCurrency(parseFloat(metadata.rentalFee))}</Typography>
                </Box>
                <Box className="booking-success-payment-row">
                  <Typography>Insurance</Typography>
                  <Typography>{formatCurrency(parseFloat(metadata.insuranceFee))}</Typography>
                </Box>
                <Box className="booking-success-payment-row">
                  <Typography>Security Deposit (Refundable)</Typography>
                  <Typography>{formatCurrency(parseFloat(metadata.deposit))}</Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box className="booking-success-payment-row booking-success-total">
                  <Typography variant="h6">Total Paid</Typography>
                  <Typography variant="h6">{formatCurrency(session.amountTotal)}</Typography>
                </Box>
              </Box>
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          {/* Confirmation Email Notice */}
          <Box className="booking-success-email-notice">
            <Email sx={{ mr: 1, color: '#002244' }} />
            <Typography variant="body2">
              A confirmation email has been sent to <strong>{session?.customerEmail || metadata?.customerEmail}</strong>
            </Typography>
          </Box>

          {/* Action Buttons */}
          <Box className="booking-success-actions">
            <Button
              variant="outlined"
              onClick={() => navigate('/')}
              className="booking-success-btn-secondary"
            >
              Return Home
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate('/booking')}
              className="booking-success-btn-primary"
            >
              Book Another Van
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default BookingSuccess;
