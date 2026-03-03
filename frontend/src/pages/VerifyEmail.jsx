// frontend/src/pages/VerifyEmail.jsx
import React, { useEffect, useState } from 'react';
import { Typography, Button, CircularProgress } from '@mui/material';
import { CheckCircle, ErrorOutline } from '@mui/icons-material';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import '../styles/VerifyEmail.css';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const [status, setStatus] = useState('verifying'); // verifying | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMsg('No verification token provided.');
      return;
    }

    const verifyEmail = async () => {
      try {
        const { data } = await api.get(`/auth/verify-email/${token}`);

        // Store auth data and update context
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        updateUser(data.user);

        setStatus('success');

        // Auto-redirect to dashboard after 3 seconds
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 3000);
      } catch (error) {
        setStatus('error');
        setErrorMsg(error.response?.data?.message || 'Verification failed. The link may be expired or invalid.');
      }
    };

    verifyEmail();
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="verify-email-page">
      <div className="verify-email-card">
        {status === 'verifying' && (
          <>
            <CircularProgress size={48} sx={{ color: '#002244', mb: 3 }} />
            <Typography variant="h4" className="verify-email-title">
              Verifying Your Email
            </Typography>
            <Typography className="verify-email-subtitle">
              Please wait while we verify your email address...
            </Typography>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="verify-email-icon-success" />
            <Typography variant="h4" className="verify-email-title">
              Email Verified!
            </Typography>
            <Typography className="verify-email-subtitle">
              Your email has been verified successfully. You can now access all owner features.
            </Typography>
            <Typography className="verify-email-redirect-text">
              Redirecting to your dashboard...
            </Typography>
            <Button
              onClick={() => navigate('/dashboard', { replace: true })}
              className="verify-email-action-btn"
            >
              Go to Dashboard Now
            </Button>
          </>
        )}

        {status === 'error' && (
          <>
            <ErrorOutline className="verify-email-icon-error" />
            <Typography variant="h4" className="verify-email-title">
              Verification Failed
            </Typography>
            <Typography className="verify-email-subtitle">
              {errorMsg}
            </Typography>
            <Button
              component={Link}
              to="/register?role=owner"
              className="verify-email-action-btn"
            >
              Register Again
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
