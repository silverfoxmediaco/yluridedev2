// frontend/src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Paper, Button, Chip, Grid, CircularProgress
} from '@mui/material';
import {
  DirectionsCar, Pending, CheckCircle, Edit, Add, Description, MarkEmailRead
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resendingEmail, setResendingEmail] = useState(false);

  useEffect(() => {
    if (user?.role === 'owner') {
      fetchOwnerDashboard();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchOwnerDashboard = async () => {
    try {
      const { data } = await api.get('/owner/dashboard');
      setStats(data.stats);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setResendingEmail(true);
    try {
      await api.post('/auth/resend-verification');
      toast.success('Verification email sent!');
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to resend email.';
      toast.error(msg);
    } finally {
      setResendingEmail(false);
    }
  };

  const emailVerified = user?.isEmailVerified !== false;

  if (loading) {
    return (
      <Box className="dashboard-loading">
        <CircularProgress sx={{ color: '#002244' }} />
      </Box>
    );
  }

  return (
    <div className="dashboard-page">
      <Container maxWidth="lg" className="dashboard-container">
        {/* Welcome Header */}
        <Box className="dashboard-header">
          <Typography variant="h3" className="dashboard-title">
            Welcome, {user?.firstName}
          </Typography>
          <Chip
            label={user?.role === 'owner' ? 'Van Owner' : user?.role === 'admin' ? 'Admin' : 'Customer'}
            className={`dashboard-role-chip dashboard-role-${user?.role}`}
          />
        </Box>

        {/* Owner Dashboard */}
        {user?.role === 'owner' && (
          <>
            {/* Email Verification Banner */}
            {!emailVerified && (
              <Paper className="dashboard-email-verify-banner">
                <Box className="dashboard-verify-content">
                  <MarkEmailRead sx={{ color: '#FB4F14', fontSize: 28 }} />
                  <Box>
                    <Typography className="dashboard-verify-title">
                      Verify Your Email
                    </Typography>
                    <Typography className="dashboard-verify-text">
                      Check your inbox for a verification link to activate your owner account.
                    </Typography>
                  </Box>
                </Box>
                <Button
                  variant="outlined"
                  onClick={handleResendVerification}
                  disabled={resendingEmail}
                  className="dashboard-verify-btn"
                >
                  {resendingEmail ? 'Sending...' : 'Resend Email'}
                </Button>
              </Paper>
            )}

            {/* Document Verification Banner */}
            {emailVerified && !user?.ownerProfile?.isVerified && (
              <Paper className="dashboard-verify-banner">
                <Box className="dashboard-verify-content">
                  <Description sx={{ color: '#FB4F14', fontSize: 28 }} />
                  <Box>
                    <Typography className="dashboard-verify-title">
                      Complete Your Verification
                    </Typography>
                    <Typography className="dashboard-verify-text">
                      Upload your documents to get verified and start listing vans.
                    </Typography>
                  </Box>
                </Box>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/owner/documents')}
                  className="dashboard-verify-btn"
                >
                  Upload Documents
                </Button>
              </Paper>
            )}

            {/* Stats Cards */}
            <Grid container spacing={3} className="dashboard-stats-grid">
              <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                <Paper className="dashboard-stat-card">
                  <DirectionsCar className="dashboard-stat-icon" />
                  <Typography className="dashboard-stat-number">{stats?.totalListings || 0}</Typography>
                  <Typography className="dashboard-stat-label">Total Listings</Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                <Paper className="dashboard-stat-card dashboard-stat-approved">
                  <CheckCircle className="dashboard-stat-icon" />
                  <Typography className="dashboard-stat-number">{stats?.approved || 0}</Typography>
                  <Typography className="dashboard-stat-label">Approved</Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                <Paper className="dashboard-stat-card dashboard-stat-pending">
                  <Pending className="dashboard-stat-icon" />
                  <Typography className="dashboard-stat-number">{stats?.pendingReview || 0}</Typography>
                  <Typography className="dashboard-stat-label">Pending Review</Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 6, sm: 4, md: 2 }}>
                <Paper className="dashboard-stat-card">
                  <Edit className="dashboard-stat-icon" />
                  <Typography className="dashboard-stat-number">{stats?.drafts || 0}</Typography>
                  <Typography className="dashboard-stat-label">Drafts</Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* Quick Actions */}
            <Box className="dashboard-actions">
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => navigate('/owner/listings/new')}
                disabled={!emailVerified}
                className="dashboard-action-btn-primary"
              >
                Create New Listing
              </Button>
              <Button
                variant="outlined"
                startIcon={<DirectionsCar />}
                onClick={() => navigate('/owner/listings')}
                disabled={!emailVerified}
                className="dashboard-action-btn-secondary"
              >
                View My Listings
              </Button>
              <Button
                variant="outlined"
                startIcon={<Description />}
                onClick={() => navigate('/owner/documents')}
                disabled={!emailVerified}
                className="dashboard-action-btn-secondary"
              >
                My Documents
              </Button>
            </Box>
          </>
        )}

        {/* Customer Dashboard */}
        {user?.role === 'customer' && (
          <Box className="dashboard-customer-section">
            <Paper className="dashboard-customer-card">
              <Typography variant="h5" className="dashboard-customer-heading">
                Your Bookings
              </Typography>
              <Typography className="dashboard-customer-text">
                Your booking history will appear here once you make your first reservation.
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/booking')}
                className="dashboard-action-btn-primary"
              >
                Browse Fleet
              </Button>
            </Paper>

            {/* Account Info */}
            <Paper className="dashboard-customer-card">
              <Typography variant="h5" className="dashboard-customer-heading">
                Account Information
              </Typography>
              <Box className="dashboard-account-info">
                <Typography><strong>Name:</strong> {user?.firstName} {user?.lastName}</Typography>
                <Typography><strong>Email:</strong> {user?.email}</Typography>
                {user?.phone && <Typography><strong>Phone:</strong> {user?.phone}</Typography>}
              </Box>
            </Paper>
          </Box>
        )}
      </Container>
    </div>
  );
};

export default Dashboard;
