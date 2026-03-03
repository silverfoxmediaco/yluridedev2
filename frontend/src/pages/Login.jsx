// frontend/src/pages/Login.jsx
import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, CircularProgress } from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  // Redirect if already logged in
  if (user) {
    navigate(from, { replace: true });
    return null;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await login(formData.email, formData.password);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <Container maxWidth="sm" className="login-container">
        <Box className="login-card">
          <Typography variant="h3" className="login-title">
            Welcome Back
          </Typography>
          <Typography className="login-subtitle">
            Sign in to your NTX Luxury Van Rentals account
          </Typography>

          <form onSubmit={handleSubmit} className="login-form">
            <TextField
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              fullWidth
              autoComplete="email"
              className="login-input"
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              fullWidth
              autoComplete="current-password"
              className="login-input"
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={submitting}
              className="login-submit-btn"
            >
              {submitting ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Sign In'}
            </Button>
          </form>

          <Box className="login-footer">
            <Typography>
              Don't have an account?{' '}
              <Link to="/register" className="login-link">Create one</Link>
            </Typography>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default Login;
