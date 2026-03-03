// frontend/src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Paper, Button, Grid, CircularProgress, Chip
} from '@mui/material';
import {
  People, DirectionsCar, Pending, CheckCircle, Store, VerifiedUser
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import '../../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/admin/stats');
      setStats(data);
    } catch (error) {
      console.error('Failed to load admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box className="admin-dash-loading">
        <CircularProgress sx={{ color: '#002244' }} />
      </Box>
    );
  }

  return (
    <div className="admin-dash-page">
      <Container maxWidth="lg" className="admin-dash-container">
        <Box className="admin-dash-header">
          <Typography variant="h3" className="admin-dash-title">
            Admin Dashboard
          </Typography>
          <Chip label="Administrator" className="admin-dash-badge" />
        </Box>

        {/* Pending Review Alert */}
        {stats?.vans?.pendingReview > 0 && (
          <Paper className="admin-dash-alert">
            <Pending sx={{ color: '#FB4F14', fontSize: 28 }} />
            <Box sx={{ flex: 1 }}>
              <Typography className="admin-dash-alert-title">
                {stats.vans.pendingReview} listing{stats.vans.pendingReview > 1 ? 's' : ''} pending review
              </Typography>
              <Typography className="admin-dash-alert-text">
                Van owners are waiting for approval to go live.
              </Typography>
            </Box>
            <Button
              variant="contained"
              onClick={() => navigate('/admin/listings?status=pending_review')}
              className="admin-dash-alert-btn"
            >
              Review Now
            </Button>
          </Paper>
        )}

        {/* User Stats */}
        <Typography variant="h5" className="admin-dash-section-title">Users</Typography>
        <Grid container spacing={3} className="admin-dash-stats-grid">
          <Grid size={{ xs: 6, sm: 3 }}>
            <Paper className="admin-dash-stat-card">
              <People className="admin-dash-stat-icon admin-dash-icon-navy" />
              <Typography className="admin-dash-stat-number">{stats?.users?.total || 0}</Typography>
              <Typography className="admin-dash-stat-label">Total Users</Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Paper className="admin-dash-stat-card">
              <People className="admin-dash-stat-icon admin-dash-icon-green" />
              <Typography className="admin-dash-stat-number">{stats?.users?.customers || 0}</Typography>
              <Typography className="admin-dash-stat-label">Customers</Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Paper className="admin-dash-stat-card">
              <Store className="admin-dash-stat-icon admin-dash-icon-orange" />
              <Typography className="admin-dash-stat-number">{stats?.users?.owners || 0}</Typography>
              <Typography className="admin-dash-stat-label">Van Owners</Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Paper className="admin-dash-stat-card">
              <VerifiedUser className="admin-dash-stat-icon admin-dash-icon-green" />
              <Typography className="admin-dash-stat-number">{stats?.users?.verifiedOwners || 0}</Typography>
              <Typography className="admin-dash-stat-label">Verified Owners</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Van Stats */}
        <Typography variant="h5" className="admin-dash-section-title">Listings</Typography>
        <Grid container spacing={3} className="admin-dash-stats-grid">
          <Grid size={{ xs: 6, sm: 3 }}>
            <Paper className="admin-dash-stat-card">
              <DirectionsCar className="admin-dash-stat-icon admin-dash-icon-navy" />
              <Typography className="admin-dash-stat-number">{stats?.vans?.total || 0}</Typography>
              <Typography className="admin-dash-stat-label">Total Vans</Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Paper className="admin-dash-stat-card">
              <DirectionsCar className="admin-dash-stat-icon admin-dash-icon-navy" />
              <Typography className="admin-dash-stat-number">{stats?.vans?.fleet || 0}</Typography>
              <Typography className="admin-dash-stat-label">Fleet Vans</Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Paper className="admin-dash-stat-card">
              <Store className="admin-dash-stat-icon admin-dash-icon-orange" />
              <Typography className="admin-dash-stat-number">{stats?.vans?.marketplace || 0}</Typography>
              <Typography className="admin-dash-stat-label">Marketplace</Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Paper className="admin-dash-stat-card">
              <CheckCircle className="admin-dash-stat-icon admin-dash-icon-green" />
              <Typography className="admin-dash-stat-number">{stats?.vans?.approved || 0}</Typography>
              <Typography className="admin-dash-stat-label">Approved</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Typography variant="h5" className="admin-dash-section-title">Quick Actions</Typography>
        <Box className="admin-dash-actions">
          <Button
            variant="contained"
            startIcon={<Pending />}
            onClick={() => navigate('/admin/listings?status=pending_review')}
            className="admin-dash-action-primary"
          >
            Pending Listings ({stats?.vans?.pendingReview || 0})
          </Button>
          <Button
            variant="outlined"
            startIcon={<DirectionsCar />}
            onClick={() => navigate('/admin/listings')}
            className="admin-dash-action-secondary"
          >
            All Listings
          </Button>
          <Button
            variant="outlined"
            startIcon={<People />}
            onClick={() => navigate('/admin/users')}
            className="admin-dash-action-secondary"
          >
            Manage Users
          </Button>
        </Box>
      </Container>
    </div>
  );
};

export default AdminDashboard;
