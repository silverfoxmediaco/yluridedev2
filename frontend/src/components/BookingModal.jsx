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
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
} from '@mui/material';
import {
  Close,
  CalendarMonth,
  AccessTime,
  Person,
  DriveEta,
  ContactPhone,
  CloudUpload,
} from '@mui/icons-material';
import '../styles/BookingModal.css';

const BookingModal = ({ open, onClose, van }) => {
  // Date & Time
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('09:00');
  const [duration, setDuration] = useState('day');
  const [customHours, setCustomHours] = useState(4);
  const [customDays, setCustomDays] = useState(1);
  const [includeDestinationFee, setIncludeDestinationFee] = useState(false);
  const [pricing, setPricing] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Customer Info
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [contactPreference, setContactPreference] = useState('text');

  // Driver & Pickup Logic
  const [needsDriver, setNeedsDriver] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');
  const [sameDropoff, setSameDropoff] = useState('yes');

  // Driver's License (only if driving themselves)
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseState, setLicenseState] = useState('');
  const [licenseExpiration, setLicenseExpiration] = useState('');
  const [licenseImage, setLicenseImage] = useState(null);
  const [licenseImageName, setLicenseImageName] = useState('');
  const [uploadingLicense, setUploadingLicense] = useState(false);

  // Our pickup location
  const PICKUP_LOCATION = '123 Luxury Lane, Dallas, TX 75201'; // Update with actual address

  // US States for license
  const US_STATES = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC'
  ];

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
      // Reset customer info
      setFullName('');
      setEmail('');
      setPhone('');
      setContactPreference('text');
      // Reset driver/pickup
      setNeedsDriver('');
      setPickupAddress('');
      setDropoffAddress('');
      setSameDropoff('yes');
      // Reset license
      setLicenseNumber('');
      setLicenseState('');
      setLicenseExpiration('');
      setLicenseImage(null);
      setLicenseImageName('');
      setUploadingLicense(false);
      setIsSubmitting(false);
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

  const validateForm = () => {
    if (!pickupDate) {
      setError('Please select a pickup date');
      return false;
    }
    if (!fullName.trim()) {
      setError('Please enter your full name');
      return false;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!phone.trim() || phone.length < 10) {
      setError('Please enter a valid phone number');
      return false;
    }
    if (!needsDriver) {
      setError('Please select if you need a driver');
      return false;
    }
    if (needsDriver === 'yes' && !pickupAddress.trim()) {
      setError('Please enter your pickup address');
      return false;
    }
    if (needsDriver === 'no') {
      if (!licenseNumber.trim()) {
        setError('Please enter your driver\'s license number');
        return false;
      }
      if (!licenseState) {
        setError('Please select the state your license was issued');
        return false;
      }
      if (!licenseExpiration) {
        setError('Please enter your license expiration date');
        return false;
      }
    }
    return true;
  };

  const handleProceedToPayment = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError('');

    // Collect all booking data
    const bookingData = {
      van,
      pricing,
      pickupDate,
      pickupTime,
      duration,
      // Customer info
      customer: {
        fullName,
        email,
        phone,
        contactPreference,
      },
      // Driver/Pickup info
      needsDriver: needsDriver === 'yes',
      pickupAddress: needsDriver === 'yes' ? pickupAddress : PICKUP_LOCATION,
      dropoffAddress: needsDriver === 'yes' && sameDropoff === 'no' ? dropoffAddress : null,
      // License info (only if driving themselves)
      driversLicense: needsDriver === 'no' ? {
        licenseNumber,
        licenseState,
        licenseExpiration,
        licenseImageUrl: licenseImage,
      } : null,
    };

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiUrl}/api/payments/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (data.success && data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error(data.message || 'Failed to create checkout session');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message || 'Failed to proceed to payment. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleLicenseUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Please upload a JPG, PNG, or PDF file.');
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError('File too large. Maximum size is 10MB.');
      return;
    }

    setUploadingLicense(true);
    setLicenseImageName(file.name);
    setError('');

    try {
      const formData = new FormData();
      formData.append('licenseImage', file);

      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiUrl}/api/upload/license`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setLicenseImage(data.data.url);
        console.log('License uploaded successfully:', data.data.url);
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (err) {
      console.error('License upload error:', err);
      setError('Failed to upload license. Please try again.');
      setLicenseImageName('');
      setLicenseImage(null);
    } finally {
      setUploadingLicense(false);
    }
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

  const formatPhoneNumber = (value) => {
    const phoneNumber = value.replace(/\D/g, '');
    if (phoneNumber.length <= 3) return phoneNumber;
    if (phoneNumber.length <= 6) return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Get minimum expiration date (today - license must be valid)
  const getMinExpirationDate = () => {
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

        {/* Customer Information */}
        <Box className="booking-modal-section">
          <Typography variant="h6" className="booking-modal-section-title">
            <Person /> Your Information
          </Typography>

          <TextField
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            fullWidth
            required
            className="booking-modal-input"
            sx={{ mb: 2 }}
          />

          <TextField
            type="email"
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            className="booking-modal-input"
            sx={{ mb: 2 }}
          />

          <TextField
            label="Phone Number"
            value={phone}
            onChange={handlePhoneChange}
            fullWidth
            required
            placeholder="(555) 123-4567"
            className="booking-modal-input"
            sx={{ mb: 2 }}
          />

          <FormControl component="fieldset">
            <FormLabel component="legend" sx={{ fontSize: '0.875rem', color: '#666' }}>
              Contact Preference
            </FormLabel>
            <RadioGroup
              row
              value={contactPreference}
              onChange={(e) => setContactPreference(e.target.value)}
            >
              <FormControlLabel value="text" control={<Radio size="small" />} label="Text" />
              <FormControlLabel value="call" control={<Radio size="small" />} label="Phone Call" />
              <FormControlLabel value="either" control={<Radio size="small" />} label="Either" />
            </RadioGroup>
          </FormControl>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Driver & Pickup Section */}
        <Box className="booking-modal-section">
          <Typography variant="h6" className="booking-modal-section-title">
            <DriveEta /> Driver & Pickup
          </Typography>

          <FormControl component="fieldset" sx={{ mb: 2 }}>
            <FormLabel component="legend" sx={{ fontSize: '0.875rem', color: '#666' }}>
              Do you need a driver?
            </FormLabel>
            <RadioGroup
              row
              value={needsDriver}
              onChange={(e) => setNeedsDriver(e.target.value)}
            >
              <FormControlLabel value="yes" control={<Radio size="small" />} label="Yes, I need a driver" />
              <FormControlLabel value="no" control={<Radio size="small" />} label="No, I'll drive myself" />
            </RadioGroup>
          </FormControl>

          {/* If needs driver - show pickup address */}
          {needsDriver === 'yes' && (
            <>
              <TextField
                label="Pickup Address"
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                fullWidth
                required
                multiline
                rows={2}
                placeholder="Enter the address where you'd like to be picked up"
                className="booking-modal-input"
                sx={{ mb: 2 }}
              />

              <FormControl component="fieldset" sx={{ mb: 2 }}>
                <FormLabel component="legend" sx={{ fontSize: '0.875rem', color: '#666' }}>
                  Drop-off at same location?
                </FormLabel>
                <RadioGroup
                  row
                  value={sameDropoff}
                  onChange={(e) => setSameDropoff(e.target.value)}
                >
                  <FormControlLabel value="yes" control={<Radio size="small" />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio size="small" />} label="No, different location" />
                </RadioGroup>
              </FormControl>

              {sameDropoff === 'no' && (
                <TextField
                  label="Drop-off Address"
                  value={dropoffAddress}
                  onChange={(e) => setDropoffAddress(e.target.value)}
                  fullWidth
                  required
                  multiline
                  rows={2}
                  placeholder="Enter the drop-off address"
                  className="booking-modal-input"
                  sx={{ mb: 2 }}
                />
              )}
            </>
          )}

          {/* If driving themselves - show pickup location and collect license */}
          {needsDriver === 'no' && (
            <>
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Van Pickup Location:
                </Typography>
                <Typography variant="body2">
                  {PICKUP_LOCATION}
                </Typography>
              </Alert>

              <Typography variant="subtitle2" sx={{ mb: 1, color: '#002244', fontWeight: 600 }}>
                Driver's License Information
              </Typography>

              <TextField
                label="License Number"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value.toUpperCase())}
                fullWidth
                required
                className="booking-modal-input"
                sx={{ mb: 2 }}
              />

              <Box className="booking-modal-datetime" sx={{ mb: 2 }}>
                <FormControl fullWidth className="booking-modal-input">
                  <InputLabel>State Issued</InputLabel>
                  <Select
                    value={licenseState}
                    onChange={(e) => setLicenseState(e.target.value)}
                    label="State Issued"
                  >
                    {US_STATES.map((state) => (
                      <MenuItem key={state} value={state}>{state}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  type="date"
                  label="Expiration Date"
                  value={licenseExpiration}
                  onChange={(e) => setLicenseExpiration(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: getMinExpirationDate() }}
                  fullWidth
                  required
                  className="booking-modal-input"
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1, color: '#666' }}>
                  Upload Driver's License Photo
                </Typography>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUpload />}
                  fullWidth
                  disabled={uploadingLicense}
                  sx={{
                    borderColor: '#002244',
                    color: '#002244',
                    '&:hover': { borderColor: '#FB4F14', color: '#FB4F14' },
                    '&.Mui-disabled': { borderColor: '#ccc', color: '#999' }
                  }}
                >
                  {uploadingLicense ? 'Uploading...' : (licenseImageName || 'Choose File')}
                  <input
                    type="file"
                    hidden
                    accept="image/*,.pdf"
                    onChange={handleLicenseUpload}
                  />
                </Button>
                {licenseImage && !uploadingLicense && (
                  <Typography variant="caption" sx={{ color: 'green', mt: 1, display: 'block' }}>
                    License uploaded successfully
                  </Typography>
                )}
              </Box>
            </>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

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
          disabled={!pricing || isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookingModal;
