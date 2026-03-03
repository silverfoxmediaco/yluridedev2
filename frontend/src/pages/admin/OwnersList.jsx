// frontend/src/pages/admin/OwnersList.jsx
import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Paper, Button, Chip, CircularProgress
} from '@mui/material';
import {
  ArrowBack, VerifiedUser, Email, DirectionsCar, CalendarMonth, Store
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import '../../styles/OwnersList.css';

const OwnersList = () => {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifiedParam = searchParams.get('verified');
    if (verifiedParam === 'true') setFilter('verified');
    else if (verifiedParam === 'false') setFilter('unverified');
  }, [searchParams]);

  useEffect(() => {
    fetchOwners();
  }, [filter]);

  const fetchOwners = async () => {
    setLoading(true);
    try {
      let query = '';
      if (filter === 'verified') query = '?verified=true';
      else if (filter === 'unverified') query = '?verified=false';

      const { data } = await api.get(`/admin/owners${query}`);
      setOwners(data);
    } catch (error) {
      toast.error('Failed to load owners');
    } finally {
      setLoading(false);
    }
  };

  const filterTabs = [
    { key: 'all', label: 'All Owners' },
    { key: 'verified', label: 'Verified' },
    { key: 'unverified', label: 'Unverified' },
  ];

  return (
    <div className="owners-list-page">
      <Container maxWidth="lg" className="owners-list-container">
        <Box className="owners-list-header">
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/admin')}
            className="owners-list-back-btn"
          >
            Admin Dashboard
          </Button>
          <Typography variant="h3" className="owners-list-title">
            Van Owners
          </Typography>
          <Typography className="owners-list-subtitle">
            {owners.length} owner{owners.length !== 1 ? 's' : ''} found
          </Typography>
        </Box>

        {/* Filter Tabs */}
        <Box className="owners-list-filters">
          {filterTabs.map(tab => (
            <Button
              key={tab.key}
              variant={filter === tab.key ? 'contained' : 'text'}
              onClick={() => setFilter(tab.key)}
              className={`owners-list-filter-btn ${filter === tab.key ? 'owners-list-filter-active' : ''}`}
              size="small"
            >
              {tab.label}
            </Button>
          ))}
        </Box>

        {loading ? (
          <Box className="owners-list-loading">
            <CircularProgress sx={{ color: '#002244' }} />
          </Box>
        ) : owners.length === 0 ? (
          <Paper className="owners-list-empty">
            <Store sx={{ fontSize: 48, color: '#ccc', mb: 1 }} />
            <Typography className="owners-list-empty-text">
              No {filter === 'all' ? '' : filter} owners found.
            </Typography>
          </Paper>
        ) : (
          <Box className="owners-list-grid">
            {owners.map(owner => (
              <Paper
                key={owner._id}
                className="owners-list-card"
                onClick={() => navigate(`/admin/owners/${owner._id}`)}
              >
                <Box className="owners-list-card-top">
                  <Box className="owners-list-card-avatar">
                    {owner.firstName?.[0]}{owner.lastName?.[0]}
                  </Box>
                  <Box className="owners-list-card-info">
                    <Typography className="owners-list-card-name">
                      {owner.firstName} {owner.lastName}
                    </Typography>
                    <Typography className="owners-list-card-business">
                      {owner.ownerProfile?.businessName || 'No business name'}
                    </Typography>
                  </Box>
                  {owner.ownerProfile?.isVerified && (
                    <Chip
                      icon={<VerifiedUser sx={{ fontSize: 14 }} />}
                      label="Verified"
                      size="small"
                      className="owners-list-verified-chip"
                    />
                  )}
                </Box>

                <Box className="owners-list-card-details">
                  <Box className="owners-list-card-detail">
                    <Email sx={{ fontSize: 16, color: '#888' }} />
                    <Typography className="owners-list-card-detail-text">
                      {owner.email}
                    </Typography>
                  </Box>
                  <Box className="owners-list-card-detail">
                    <DirectionsCar sx={{ fontSize: 16, color: '#888' }} />
                    <Typography className="owners-list-card-detail-text">
                      {owner.vanCount} van{owner.vanCount !== 1 ? 's' : ''} listed
                    </Typography>
                  </Box>
                  <Box className="owners-list-card-detail">
                    <CalendarMonth sx={{ fontSize: 16, color: '#888' }} />
                    <Typography className="owners-list-card-detail-text">
                      Joined {new Date(owner.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>

                <Box className="owners-list-card-status">
                  <Chip
                    label={owner.isActive ? 'Active' : 'Inactive'}
                    size="small"
                    className={owner.isActive ? 'owners-list-status-active' : 'owners-list-status-inactive'}
                  />
                </Box>
              </Paper>
            ))}
          </Box>
        )}
      </Container>
    </div>
  );
};

export default OwnersList;
