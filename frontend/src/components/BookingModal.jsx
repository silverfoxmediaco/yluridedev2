// frontend/src/components/BookingModal.jsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  IconButton,
  Alert,
} from '@mui/material';
import { Close, CalendarMonth, AccessTime } from '@mui/icons-material';
import '../styles/BookingModal.css';

const BookingModal = ({ open, onClose, van }) => {
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('09:00');
  const [duration, setDuration] = useState('day');
  const [customHours, setCustomHours] = useState(4);
  const [customDays, setCustomDays] = useState(1);
  const [includeDestinationFee, setIncludeDestinationFee] = useState(false);
  const [pricing, setPricing] = useState(null);
  const [error, setError] = useState('');

  // Reset form when modal opens with new van
  useEffect(() => {
    if (open) {
      setPickupDate('');
      setPickupTime('09:00');
      setDuration('day');
      setCustomHours(4);
      setCustomDays(1);
      setPricing(null);
      setError('');
    }
  }, [open, van]);

  // Calculate pricing when inputs change
  useEffect(() => {
    if (van && pickupDate) {
      calculatePricing();
    }
  }, [pickupDate, pickupTime, duration, customHours, customDays, includeDestinationFee]);

  const calculatePricing = () => {
    if (!van || !pickupDate) return;

    const startDateTime = new Date(`${pickupDate}T${pickupTime}`);
    let endDateTime;

    switch (duration) {
      case 'hours':
        endDateTime = new Date(startDateTime.getTime() + customHours * 60 * 60 * 1000);
        break;
      case 'day':
        endDateTime = new Date(startDateTime.getTime() + 24 * 60 * 60 * 1000);
        break;
      case 'days':
        endDateTime = new Date(startDateTime.getTime() + customDays * 24 * 60 * 60 * 1000);
        break;
      case 'week':
        endDateTime = new Date(startDateTime.getTime() + 7 * 24 * 60 * 60 * 1000);
        break;
      default:
        endDateTime = new Date(startDateTime.getTime() + 24 * 60 * 60 * 1000);
    }

    // Calculate rental fee
    const hours = Math.ceil((endDateTime - startDateTime) / (1000 * 60 * 60));
    const days = Math.ceil(hours / 24);

    let rentalFee = 0;
    const { hourlyRate, dailyRate, weeklyRate, minimumHours = 4 } = van.pricing;

    if (days >= 7 && weeklyRate) {
      const weeks = Math.floor(days / 7);
      const remainingDays = days % 7;
      rentalFee = (weeks * weeklyRate) + (remainingDays * dailyRate);
    } else if (hours >= 24) {
      rentalFee = days * dailyRate;
    } else {
      rentalFee = Math.max(hours, minimumHours) * hourlyRate;
    }

    const destinationFee = includeDestinationFee ? (van.pricing.destinationFee || 0) : 0;
    const insuranceFee = van.pricing.insuranceFee || 75;
    const deposit = van.pricing.deposit || 500;

    const subtotal = rentalFee + destinationFee + insuranceFee;
    const total = subtotal + deposit;

    setPricing({
      rentalFee,
      insuranceFee,
      destinationFee,
      deposit,
      subtotal,
      total,
      hours,
      days,
      startDateTime,
      endDateTime,
    });
  };

  const handleProceedToPayment = () => {
    if (!pickupDate) {
      setError('Please select a pickup date');
      return;
    }

    // TODO: Integrate with Stripe
    console.log('Proceeding to payment with:', {
      van,
      pricing,
      pickupDate,
      pickupTime,
      duration,
    });

    alert('Payment integration coming soon! Booking details have been logged.');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDateTime = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  if (!van) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      className="booking-modal"
    >
      <DialogTitle className="booking-modal-title">
        <Box className="booking-modal-header">
          <Box>
            <Typography variant="h5" className="booking-modal-van-name">
              {van.name}
            </Typography>
            <Typography variant="body2" className="booking-modal-van-type">
              {van.year} {van.type} • {van.seating} Passengers
            </Typography>
          </Box>
          <IconButton onClick={onClose} className="booking-modal-close">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent className="booking-modal-content">
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Date & Time Selection */}
        <Box className="booking-modal-section">
          <Typography variant="h6" className="booking-modal-section-title">
            <CalendarMonth /> Select Date & Time
          </Typography>

          <Box className="booking-modal-datetime">
            <TextField
              type="date"
              label="Pickup Date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: getMinDate() }}
              fullWidth
              className="booking-modal-input"
            />
            <TextField
              type="time"
              label="Pickup Time"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
              className="booking-modal-input"
            />
          </Box>
        </Box>

        {/* Duration Selection */}
        <Box className="booking-modal-section">
          <Typography variant="h6" className="booking-modal-section-title">
            <AccessTime /> Rental Duration
          </Typography>

          <FormControl fullWidth className="booking-modal-input">
            <InputLabel>Duration</InputLabel>
            <Select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              label="Duration"
            >
              <MenuItem value="hours">Hourly (min {van.pricing?.minimumHours || 4} hours)</MenuItem>
              <MenuItem value="day">1 Day (24 hours)</MenuItem>
              <MenuItem value="days">Multiple Days</MenuItem>
              <MenuItem value="week">1 Week</MenuItem>
            </Select>
          </FormControl>

          {duration === 'hours' && (
            <TextField
              type="number"
              label="Number of Hours"
              value={customHours}
              onChange={(e) => setCustomHours(Math.max(van.pricing?.minimumHours || 4, parseInt(e.target.value) || 4))}
              inputProps={{ min: van.pricing?.minimumHours || 4 }}
              fullWidth
              className="booking-modal-input"
              sx={{ mt: 2 }}
            />
          )}

          {duration === 'days' && (
            <TextField
              type="number"
              label="Number of Days"
              value={customDays}
              onChange={(e) => setCustomDays(Math.max(1, parseInt(e.target.value) || 1))}
              inputProps={{ min: 1 }}
              fullWidth
              className="booking-modal-input"
              sx={{ mt: 2 }}
            />
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Pricing Breakdown */}
        {pricing && (
          <Box className="booking-modal-pricing">
            <Typography variant="h6" className="booking-modal-section-title">
              Price Breakdown
            </Typography>

            <Box className="booking-modal-price-summary">
              <Typography variant="body2" className="booking-modal-dates">
                {formatDateTime(pricing.startDateTime)} → {formatDateTime(pricing.endDateTime)}
              </Typography>
              <Typography variant="body2" className="booking-modal-duration">
                ({pricing.hours} hours / {pricing.days} day{pricing.days > 1 ? 's' : ''})
              </Typography>
            </Box>

            <Box className="booking-modal-price-row">
              <Typography>Rental Fee</Typography>
              <Typography>{formatCurrency(pricing.rentalFee)}</Typography>
            </Box>

            <Box className="booking-modal-price-row">
              <Typography>Mandatory Insurance</Typography>
              <Typography>{formatCurrency(pricing.insuranceFee)}</Typography>
            </Box>

            {pricing.destinationFee > 0 && (
              <Box className="booking-modal-price-row">
                <Typography>Destination Fee</Typography>
                <Typography>{formatCurrency(pricing.destinationFee)}</Typography>
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            <Box className="booking-modal-price-row">
              <Typography>Subtotal</Typography>
              <Typography>{formatCurrency(pricing.subtotal)}</Typography>
            </Box>

            <Box className="booking-modal-price-row booking-modal-deposit">
              <Typography>Security Deposit (Refundable)</Typography>
              <Typography>{formatCurrency(pricing.deposit)}</Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box className="booking-modal-price-row booking-modal-total">
              <Typography variant="h6">Total Due Today</Typography>
              <Typography variant="h6">{formatCurrency(pricing.total)}</Typography>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions className="booking-modal-actions">
        <Button onClick={onClose} className="booking-modal-cancel">
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleProceedToPayment}
          className="booking-modal-submit"
          disabled={!pricing}
        >
          Proceed to Payment
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookingModal;
