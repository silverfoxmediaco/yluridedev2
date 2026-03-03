// frontend/src/pages/Register.jsx
import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, CircularProgress, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import '../styles/Register.css';

const Register = () => {
  const [searchParams] = useSearchParams();
  const [accountType, setAccountType] = useState(
    searchParams.get('role') === 'owner' ? 'owner' : 'customer'
  );
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    businessName: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const { register, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  if (user) {
    navigate('/dashboard', { replace: true });
    return null;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
    let formatted = digits;
    if (digits.length > 6) {
      formatted = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    } else if (digits.length > 3) {
      formatted = `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    } else if (digits.length > 0) {
      formatted = `(${digits}`;
    }
    setFormData({ ...formData, phone: formatted });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: accountType
      };

      if (accountType === 'owner') {
        payload.businessName = formData.businessName;
      }

      await register(payload);
      toast.success('Account created successfully!');
      if (accountType === 'owner') {
        navigate('/verify-email-sent', { replace: true, state: { email: formData.email } });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="register-page">
      <Container maxWidth="sm" className="register-container">
        <Box className="register-card">
          <Typography variant="h3" className="register-title">
            Create Account
          </Typography>
          <Typography className="register-subtitle">
            Join NTX Luxury Van Rentals
          </Typography>

          {/* Account Type Toggle */}
          <Box className="register-type-toggle">
            <ToggleButtonGroup
              value={accountType}
              exclusive
              onChange={(e, val) => val && setAccountType(val)}
              className="register-toggle-group"
            >
              <ToggleButton value="customer" className="register-toggle-btn">
                Customer
              </ToggleButton>
              <ToggleButton value="owner" className="register-toggle-btn">
                Van Owner
              </ToggleButton>
            </ToggleButtonGroup>
            <Typography className="register-type-hint">
              {accountType === 'customer'
                ? 'Book luxury vans for your trips'
                : 'List your vans and earn rental income'}
            </Typography>
          </Box>

          <form onSubmit={handleSubmit} className="register-form">
            <Box className="register-name-row">
              <TextField
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                fullWidth
                autoComplete="given-name"
                className="register-input"
              />
              <TextField
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                fullWidth
                autoComplete="family-name"
                className="register-input"
              />
            </Box>

            <TextField
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              fullWidth
              autoComplete="email"
              className="register-input"
            />

            <TextField
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handlePhoneChange}
              fullWidth
              autoComplete="tel"
              placeholder="(555) 555-5555"
              className="register-input"
            />

            {accountType === 'owner' && (
              <TextField
                label="Business Name"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                required
                fullWidth
                placeholder="Your van rental business name"
                className="register-input"
              />
            )}

            <TextField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              fullWidth
              autoComplete="new-password"
              helperText="At least 6 characters"
              className="register-input"
            />

            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              fullWidth
              autoComplete="new-password"
              className="register-input"
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={submitting}
              className="register-submit-btn"
            >
              {submitting ? (
                <CircularProgress size={24} sx={{ color: '#fff' }} />
              ) : (
                accountType === 'owner' ? 'Create Owner Account' : 'Create Account'
              )}
            </Button>
          </form>

          <Box className="register-footer">
            <Typography>
              Already have an account?{' '}
              <Link to="/login" className="register-link">Sign in</Link>
            </Typography>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default Register;
