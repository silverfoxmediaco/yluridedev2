// frontend/src/pages/VerifyEmailSent.jsx
import React, { useState } from 'react';
import { Typography, Button, CircularProgress } from '@mui/material';
import { MarkEmailRead } from '@mui/icons-material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import '../styles/VerifyEmail.css';

const VerifyEmailSent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [resending, setResending] = useState(false);

  const email = location.state?.email || user?.email || '';

  // If already verified, redirect to dashboard
  if (user?.isEmailVerified) {
    navigate('/dashboard', { replace: true });
    return null;
  }

  const handleResend = async () => {
    setResending(true);
    try {
      await api.post('/auth/resend-verification');
      toast.success('Verification email sent!');
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to resend email. Please try again.';
      toast.error(msg);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="verify-email-page">
      <div className="verify-email-card">
        <MarkEmailRead className="verify-email-icon" />
        <Typography variant="h4" className="verify-email-title">
          Check Your Email
        </Typography>
        <Typography className="verify-email-subtitle">
          We sent a verification link to
        </Typography>
        {email && (
          <Typography className="verify-email-address">
            {email}
          </Typography>
        )}
        <Typography className="verify-email-subtitle">
          Click the link in the email to verify your account and access your owner dashboard.
        </Typography>

        <Button
          onClick={handleResend}
          disabled={resending}
          className="verify-email-resend-btn"
        >
          {resending ? (
            <CircularProgress size={22} sx={{ color: '#fff' }} />
          ) : (
            'Resend Email'
          )}
        </Button>

        <br />
        <Link to="/dashboard" className="verify-email-dashboard-link">
          Go to Dashboard
        </Link>

        <Typography className="verify-email-sent-note">
          Didn't receive the email? Check your spam folder or click resend above.
          The verification link expires in 24 hours.
        </Typography>
      </div>
    </div>
  );
};

export default VerifyEmailSent;
