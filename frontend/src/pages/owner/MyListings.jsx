// frontend/src/pages/owner/MyListings.jsx
import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Paper, Button, Chip, CircularProgress,
  IconButton, Menu, MenuItem
} from '@mui/material';
import {
  Add, MoreVert, Edit, Visibility, Delete, Send
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import '../../styles/MyListings.css';

const statusConfig = {
  draft: { label: 'Draft', color: '#888', bg: '#f0f0f0' },
  pending_review: { label: 'Pending Review', color: '#e67e00', bg: '#fff3e0' },
  approved: { label: 'Approved', color: '#2e7d32', bg: '#e8f5e9' },
  rejected: { label: 'Rejected', color: '#c62828', bg: '#ffebee' },
  suspended: { label: 'Suspended', color: '#666', bg: '#eeeeee' },
};

const MyListings = () => {
  const [vans, setVans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedVan, setSelectedVan] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVans();
  }, []);

  const fetchVans = async () => {
    try {
      const { data } = await api.get('/owner/vans');
      setVans(data);
    } catch (error) {
      toast.error('Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event, van) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
    setSelectedVan(van);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedVan(null);
  };

  const handleSubmitForReview = async (vanId) => {
    handleMenuClose();
    try {
      await api.put(`/owner/vans/${vanId}/submit`);
      toast.success('Listing submitted for review!');
      fetchVans();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit');
    }
  };

  const handleDeactivate = async (vanId) => {
    handleMenuClose();
    try {
      await api.delete(`/owner/vans/${vanId}`);
      toast.success('Listing deactivated');
      fetchVans();
    } catch (error) {
      toast.error('Failed to deactivate listing');
    }
  };

  const filteredVans = filter === 'all' ? vans : vans.filter(v => v.approvalStatus === filter);

  const filterTabs = [
    { key: 'all', label: 'All' },
    { key: 'draft', label: 'Drafts' },
    { key: 'pending_review', label: 'Pending' },
    { key: 'approved', label: 'Approved' },
    { key: 'rejected', label: 'Rejected' },
  ];

  if (loading) {
    return (
      <Box className="my-listings-loading">
        <CircularProgress sx={{ color: '#002244' }} />
      </Box>
    );
  }

  return (
    <div className="my-listings-page">
      <Container maxWidth="lg" className="my-listings-container">
        <Box className="my-listings-header">
          <Typography variant="h3" className="my-listings-title">
            My Listings
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/owner/listings/new')}
            className="my-listings-add-btn"
          >
            New Listing
          </Button>
        </Box>

        {/* Filter Tabs */}
        <Box className="my-listings-filters">
          {filterTabs.map(tab => (
            <Button
              key={tab.key}
              variant={filter === tab.key ? 'contained' : 'text'}
              onClick={() => setFilter(tab.key)}
              className={`my-listings-filter-btn ${filter === tab.key ? 'my-listings-filter-active' : ''}`}
              size="small"
            >
              {tab.label}
              {tab.key !== 'all' && (
                <span className="my-listings-filter-count">
                  {vans.filter(v => v.approvalStatus === tab.key).length}
                </span>
              )}
            </Button>
          ))}
        </Box>

        {/* Listings Grid */}
        {filteredVans.length === 0 ? (
          <Paper className="my-listings-empty">
            <Typography className="my-listings-empty-text">
              {filter === 'all' ? 'No listings yet. Create your first van listing!' : `No ${filter.replace('_', ' ')} listings.`}
            </Typography>
            {filter === 'all' && (
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => navigate('/owner/listings/new')}
                className="my-listings-add-btn"
              >
                Create Listing
              </Button>
            )}
          </Paper>
        ) : (
          <Box className="my-listings-grid">
            {filteredVans.map(van => {
              const status = statusConfig[van.approvalStatus] || statusConfig.draft;
              return (
                <Paper key={van._id} className="my-listing-card">
                  {/* Image */}
                  <Box className="my-listing-image-container">
                    {van.thumbnailImage ? (
                      <img src={van.thumbnailImage} alt={van.name} className="my-listing-image" />
                    ) : (
                      <Box className="my-listing-no-image">No Image</Box>
                    )}
                    <Chip
                      label={status.label}
                      className="my-listing-status-chip"
                      sx={{ backgroundColor: status.bg, color: status.color }}
                    />
                  </Box>

                  {/* Info */}
                  <Box className="my-listing-info">
                    <Typography className="my-listing-name">{van.name}</Typography>
                    <Typography className="my-listing-details">
                      {van.year} {van.type} &middot; {van.seating} passengers
                    </Typography>
                    <Typography className="my-listing-price">
                      ${van.pricing?.dailyRate}/day
                    </Typography>

                    {van.adminNotes && van.approvalStatus === 'rejected' && (
                      <Box className="my-listing-admin-notes">
                        <Typography className="my-listing-notes-label">Admin Notes:</Typography>
                        <Typography className="my-listing-notes-text">{van.adminNotes}</Typography>
                      </Box>
                    )}
                  </Box>

                  {/* Actions */}
                  <IconButton
                    className="my-listing-menu-btn"
                    onClick={(e) => handleMenuOpen(e, van)}
                  >
                    <MoreVert />
                  </IconButton>
                </Paper>
              );
            })}
          </Box>
        )}

        {/* Actions Menu */}
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => { navigate(`/owner/listings/${selectedVan?._id}/edit`); handleMenuClose(); }}>
            <Edit sx={{ mr: 1, fontSize: 20 }} /> Edit
          </MenuItem>
          {selectedVan?.approvalStatus === 'approved' && (
            <MenuItem onClick={() => { navigate(`/van/${selectedVan?._id}`); handleMenuClose(); }}>
              <Visibility sx={{ mr: 1, fontSize: 20 }} /> View Live
            </MenuItem>
          )}
          {['draft', 'rejected'].includes(selectedVan?.approvalStatus) && (
            <MenuItem onClick={() => handleSubmitForReview(selectedVan?._id)}>
              <Send sx={{ mr: 1, fontSize: 20 }} /> Submit for Review
            </MenuItem>
          )}
          {selectedVan?.approvalStatus !== 'suspended' && (
            <MenuItem onClick={() => handleDeactivate(selectedVan?._id)} sx={{ color: '#c62828' }}>
              <Delete sx={{ mr: 1, fontSize: 20 }} /> Deactivate
            </MenuItem>
          )}
        </Menu>
      </Container>
    </div>
  );
};

export default MyListings;
