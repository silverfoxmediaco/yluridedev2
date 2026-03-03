// frontend/src/pages/admin/PendingListings.jsx
import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Paper, Button, Chip, CircularProgress
} from '@mui/material';
import { Visibility, ArrowBack } from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import '../../styles/PendingListings.css';

const statusConfig = {
  draft: { label: 'Draft', color: '#888', bg: '#f0f0f0' },
  pending_review: { label: 'Pending Review', color: '#e67e00', bg: '#fff3e0' },
  approved: { label: 'Approved', color: '#2e7d32', bg: '#e8f5e9' },
  rejected: { label: 'Rejected', color: '#c62828', bg: '#ffebee' },
  suspended: { label: 'Suspended', color: '#666', bg: '#eeeeee' },
};

const PendingListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending_review');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const statusParam = searchParams.get('status');
    if (statusParam) setFilter(statusParam);
  }, [searchParams]);

  useEffect(() => {
    fetchListings();
  }, [filter]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const query = filter === 'all' ? '' : `?status=${filter}`;
      const { data } = await api.get(`/admin/listings${query}`);
      setListings(data);
    } catch (error) {
      toast.error('Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  const filterTabs = [
    { key: 'pending_review', label: 'Pending Review' },
    { key: 'approved', label: 'Approved' },
    { key: 'rejected', label: 'Rejected' },
    { key: 'all', label: 'All' },
  ];

  return (
    <div className="pending-listings-page">
      <Container maxWidth="lg" className="pending-listings-container">
        <Box className="pending-listings-header">
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/admin')}
            className="pending-listings-back-btn"
          >
            Admin Dashboard
          </Button>
          <Typography variant="h3" className="pending-listings-title">
            Marketplace Listings
          </Typography>
        </Box>

        {/* Filter Tabs */}
        <Box className="pending-listings-filters">
          {filterTabs.map(tab => (
            <Button
              key={tab.key}
              variant={filter === tab.key ? 'contained' : 'text'}
              onClick={() => setFilter(tab.key)}
              className={`pending-listings-filter-btn ${filter === tab.key ? 'pending-listings-filter-active' : ''}`}
              size="small"
            >
              {tab.label}
            </Button>
          ))}
        </Box>

        {loading ? (
          <Box className="pending-listings-loading">
            <CircularProgress sx={{ color: '#002244' }} />
          </Box>
        ) : listings.length === 0 ? (
          <Paper className="pending-listings-empty">
            <Typography className="pending-listings-empty-text">
              No {filter === 'all' ? '' : filter.replace('_', ' ')} listings found.
            </Typography>
          </Paper>
        ) : (
          <Box className="pending-listings-grid">
            {listings.map(van => {
              const status = statusConfig[van.approvalStatus] || statusConfig.draft;
              const owner = van.owner;

              return (
                <Paper key={van._id} className="pending-listing-card">
                  <Box className="pending-listing-image-container">
                    {van.thumbnailImage ? (
                      <img src={van.thumbnailImage} alt={van.name} className="pending-listing-image" />
                    ) : (
                      <Box className="pending-listing-no-image">No Image</Box>
                    )}
                    <Chip
                      label={status.label}
                      className="pending-listing-status-chip"
                      sx={{ backgroundColor: status.bg, color: status.color }}
                    />
                  </Box>

                  <Box className="pending-listing-info">
                    <Typography className="pending-listing-name">{van.name}</Typography>
                    <Typography className="pending-listing-details">
                      {van.year} {van.type} &middot; {van.seating} passengers &middot; ${van.pricing?.dailyRate}/day
                    </Typography>

                    {owner && (
                      <Box className="pending-listing-owner">
                        <Typography className="pending-listing-owner-name">
                          Owner: {owner.firstName} {owner.lastName}
                        </Typography>
                        <Typography className="pending-listing-owner-business">
                          {owner.ownerProfile?.businessName || 'No business name'}
                        </Typography>
                        {owner.ownerProfile?.isVerified && (
                          <Chip label="Verified" size="small" sx={{ backgroundColor: '#e8f5e9', color: '#2e7d32', fontWeight: 600, fontSize: '0.7rem' }} />
                        )}
                      </Box>
                    )}

                    <Typography className="pending-listing-date">
                      Updated: {new Date(van.updatedAt).toLocaleDateString()}
                    </Typography>
                  </Box>

                  <Box className="pending-listing-actions">
                    <Button
                      variant="contained"
                      startIcon={<Visibility />}
                      onClick={() => navigate(`/admin/listings/${van._id}`)}
                      className="pending-listing-review-btn"
                      size="small"
                    >
                      Review
                    </Button>
                  </Box>
                </Paper>
              );
            })}
          </Box>
        )}
      </Container>
    </div>
  );
};

export default PendingListings;
