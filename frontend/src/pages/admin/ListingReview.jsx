// frontend/src/pages/admin/ListingReview.jsx
import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Paper, Button, TextField, Chip,
  CircularProgress, Divider, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import {
  ArrowBack, CheckCircle, Cancel, Block, Person, Email, Phone,
  LocationOn, DirectionsCar, AttachMoney
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import '../../styles/ListingReview.css';

const statusConfig = {
  draft: { label: 'Draft', color: '#888', bg: '#f0f0f0' },
  pending_review: { label: 'Pending Review', color: '#e67e00', bg: '#fff3e0' },
  approved: { label: 'Approved', color: '#2e7d32', bg: '#e8f5e9' },
  rejected: { label: 'Rejected', color: '#c62828', bg: '#ffebee' },
  suspended: { label: 'Suspended', color: '#666', bg: '#eeeeee' },
};

const ListingReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [van, setVan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [notes, setNotes] = useState('');
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      const { data } = await api.get(`/admin/listings/${id}`);
      setVan(data);
      setNotes(data.adminNotes || '');
    } catch (error) {
      toast.error('Failed to load listing');
      navigate('/admin/listings');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      await api.put(`/admin/listings/${id}/approve`, { notes });
      toast.success('Listing approved! Owner has been notified.');
      navigate('/admin/listings?status=pending_review');
    } catch (error) {
      toast.error('Failed to approve listing');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!notes.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    setActionLoading(true);
    try {
      await api.put(`/admin/listings/${id}/reject`, { notes });
      toast.success('Listing rejected. Owner has been notified.');
      setRejectDialogOpen(false);
      navigate('/admin/listings?status=pending_review');
    } catch (error) {
      toast.error('Failed to reject listing');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSuspend = async () => {
    setActionLoading(true);
    try {
      await api.put(`/admin/listings/${id}/suspend`, { notes });
      toast.success('Listing suspended');
      navigate('/admin/listings');
    } catch (error) {
      toast.error('Failed to suspend listing');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <Box className="listing-review-loading">
        <CircularProgress sx={{ color: '#002244' }} />
      </Box>
    );
  }

  if (!van) return null;

  const status = statusConfig[van.approvalStatus] || statusConfig.draft;
  const owner = van.owner;
  const allImages = [van.thumbnailImage, ...(van.images || [])].filter(Boolean);

  return (
    <div className="listing-review-page">
      <Container maxWidth="lg" className="listing-review-container">
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/admin/listings?status=pending_review')}
          className="listing-review-back-btn"
        >
          Back to Listings
        </Button>

        {/* Header */}
        <Box className="listing-review-header">
          <Box>
            <Typography variant="h3" className="listing-review-title">{van.name}</Typography>
            <Typography className="listing-review-subtitle">
              {van.year} {van.type} &middot; {van.seating} passengers
            </Typography>
          </Box>
          <Chip
            label={status.label}
            sx={{ backgroundColor: status.bg, color: status.color, fontWeight: 600, fontSize: '0.85rem' }}
          />
        </Box>

        <Box className="listing-review-layout">
          {/* Main Content */}
          <Box className="listing-review-main">
            {/* Images */}
            <Paper className="listing-review-section">
              <Typography variant="h6" className="listing-review-section-title">
                Photos ({allImages.length})
              </Typography>
              {allImages.length > 0 ? (
                <>
                  <Box className="listing-review-main-image">
                    <img
                      src={selectedImage || allImages[0]}
                      alt={van.name}
                      className="listing-review-hero-image"
                    />
                  </Box>
                  <Box className="listing-review-thumb-grid">
                    {allImages.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={`${van.name} ${i + 1}`}
                        className={`listing-review-thumb ${(selectedImage || allImages[0]) === img ? 'listing-review-thumb-active' : ''}`}
                        onClick={() => setSelectedImage(img)}
                      />
                    ))}
                  </Box>
                </>
              ) : (
                <Typography className="listing-review-no-photos">No photos uploaded</Typography>
              )}
            </Paper>

            {/* Description */}
            <Paper className="listing-review-section">
              <Typography variant="h6" className="listing-review-section-title">Description</Typography>
              <Typography className="listing-review-description">{van.description}</Typography>
            </Paper>

            {/* Features */}
            {van.features && van.features.length > 0 && (
              <Paper className="listing-review-section">
                <Typography variant="h6" className="listing-review-section-title">Features</Typography>
                <Box className="listing-review-features">
                  {van.features.map((f, i) => (
                    <Chip key={i} label={f} size="small" className="listing-review-feature-chip" />
                  ))}
                </Box>
              </Paper>
            )}

            {/* Pricing */}
            <Paper className="listing-review-section">
              <Typography variant="h6" className="listing-review-section-title">
                <AttachMoney sx={{ fontSize: 20, verticalAlign: 'middle' }} /> Pricing
              </Typography>
              <Box className="listing-review-pricing-grid">
                <Box className="listing-review-pricing-item">
                  <Typography className="listing-review-pricing-label">Hourly</Typography>
                  <Typography className="listing-review-pricing-value">${van.pricing?.hourlyRate}</Typography>
                </Box>
                <Box className="listing-review-pricing-item">
                  <Typography className="listing-review-pricing-label">Daily</Typography>
                  <Typography className="listing-review-pricing-value">${van.pricing?.dailyRate}</Typography>
                </Box>
                {van.pricing?.weeklyRate && (
                  <Box className="listing-review-pricing-item">
                    <Typography className="listing-review-pricing-label">Weekly</Typography>
                    <Typography className="listing-review-pricing-value">${van.pricing.weeklyRate}</Typography>
                  </Box>
                )}
                <Box className="listing-review-pricing-item">
                  <Typography className="listing-review-pricing-label">Deposit</Typography>
                  <Typography className="listing-review-pricing-value">${van.pricing?.deposit}</Typography>
                </Box>
                <Box className="listing-review-pricing-item">
                  <Typography className="listing-review-pricing-label">Insurance</Typography>
                  <Typography className="listing-review-pricing-value">${van.pricing?.insuranceFee}</Typography>
                </Box>
                <Box className="listing-review-pricing-item">
                  <Typography className="listing-review-pricing-label">Min Hours</Typography>
                  <Typography className="listing-review-pricing-value">{van.pricing?.minimumHours}</Typography>
                </Box>
              </Box>
            </Paper>

            {/* Location */}
            {van.location && (van.location.city || van.location.address) && (
              <Paper className="listing-review-section">
                <Typography variant="h6" className="listing-review-section-title">
                  <LocationOn sx={{ fontSize: 20, verticalAlign: 'middle' }} /> Location
                </Typography>
                {van.location.address && <Typography>{van.location.address}</Typography>}
                <Typography>{van.location.city}, {van.location.state} {van.location.zip}</Typography>
                <Typography className="listing-review-detail-item">
                  Service Radius: {van.location.serviceRadius} miles
                </Typography>
              </Paper>
            )}

            {/* Vehicle Details */}
            <Paper className="listing-review-section">
              <Typography variant="h6" className="listing-review-section-title">
                <DirectionsCar sx={{ fontSize: 20, verticalAlign: 'middle' }} /> Vehicle Details
              </Typography>
              {van.vin && <Typography className="listing-review-detail-item"><strong>VIN:</strong> {van.vin}</Typography>}
              {van.mileage && <Typography className="listing-review-detail-item"><strong>Mileage:</strong> {van.mileage.toLocaleString()}</Typography>}
              <Typography className="listing-review-detail-item"><strong>Driver Availability:</strong> {van.driverAvailability?.replace('_', ' ')}</Typography>
              <Typography className="listing-review-detail-item"><strong>Cancellation:</strong> {van.cancellationPolicy}</Typography>
            </Paper>
          </Box>

          {/* Sidebar */}
          <Box className="listing-review-sidebar">
            {/* Owner Info */}
            {owner && (
              <Paper className="listing-review-sidebar-card">
                <Typography variant="h6" className="listing-review-section-title">Owner</Typography>
                <Box className="listing-review-owner-info">
                  <Box className="listing-review-owner-row">
                    <Person sx={{ fontSize: 18, color: '#888' }} />
                    <Typography>{owner.firstName} {owner.lastName}</Typography>
                  </Box>
                  <Box className="listing-review-owner-row">
                    <Email sx={{ fontSize: 18, color: '#888' }} />
                    <Typography>{owner.email}</Typography>
                  </Box>
                  {owner.phone && (
                    <Box className="listing-review-owner-row">
                      <Phone sx={{ fontSize: 18, color: '#888' }} />
                      <Typography>{owner.phone}</Typography>
                    </Box>
                  )}
                  {owner.ownerProfile?.businessName && (
                    <Typography className="listing-review-owner-business">
                      {owner.ownerProfile.businessName}
                    </Typography>
                  )}
                  <Chip
                    label={owner.ownerProfile?.isVerified ? 'Verified Owner' : 'Unverified'}
                    size="small"
                    sx={{
                      backgroundColor: owner.ownerProfile?.isVerified ? '#e8f5e9' : '#fff3e0',
                      color: owner.ownerProfile?.isVerified ? '#2e7d32' : '#e67e00',
                      fontWeight: 600,
                      mt: 1
                    }}
                  />
                </Box>
              </Paper>
            )}

            {/* Admin Notes */}
            <Paper className="listing-review-sidebar-card">
              <Typography variant="h6" className="listing-review-section-title">Admin Notes</Typography>
              <TextField
                multiline
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes (required for rejection)..."
                fullWidth
                className="listing-review-notes-input"
              />
            </Paper>

            {/* Actions */}
            <Paper className="listing-review-sidebar-card">
              <Typography variant="h6" className="listing-review-section-title">Actions</Typography>
              <Box className="listing-review-action-buttons">
                {van.approvalStatus === 'pending_review' && (
                  <>
                    <Button
                      variant="contained"
                      startIcon={<CheckCircle />}
                      onClick={handleApprove}
                      disabled={actionLoading}
                      className="listing-review-approve-btn"
                      fullWidth
                    >
                      {actionLoading ? 'Processing...' : 'Approve Listing'}
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Cancel />}
                      onClick={() => setRejectDialogOpen(true)}
                      disabled={actionLoading}
                      className="listing-review-reject-btn"
                      fullWidth
                    >
                      Reject Listing
                    </Button>
                  </>
                )}
                {van.approvalStatus === 'approved' && (
                  <Button
                    variant="outlined"
                    startIcon={<Block />}
                    onClick={handleSuspend}
                    disabled={actionLoading}
                    className="listing-review-suspend-btn"
                    fullWidth
                  >
                    Suspend Listing
                  </Button>
                )}
                {van.approvalStatus === 'rejected' && (
                  <Button
                    variant="contained"
                    startIcon={<CheckCircle />}
                    onClick={handleApprove}
                    disabled={actionLoading}
                    className="listing-review-approve-btn"
                    fullWidth
                  >
                    Approve Listing
                  </Button>
                )}
              </Box>
            </Paper>
          </Box>
        </Box>

        {/* Reject Confirmation Dialog */}
        <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ color: '#002244', fontWeight: 600 }}>Reject Listing</DialogTitle>
          <DialogContent>
            <Typography sx={{ mb: 2 }}>
              Please provide a reason for rejecting <strong>{van.name}</strong>. The owner will receive this feedback.
            </Typography>
            <TextField
              multiline
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Reason for rejection..."
              fullWidth
              required
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setRejectDialogOpen(false)} sx={{ color: '#666', textTransform: 'none' }}>
              Cancel
            </Button>
            <Button
              onClick={handleReject}
              variant="contained"
              disabled={actionLoading || !notes.trim()}
              sx={{ backgroundColor: '#c62828', textTransform: 'none', fontWeight: 600, '&:hover': { backgroundColor: '#b71c1c' } }}
            >
              {actionLoading ? 'Rejecting...' : 'Confirm Rejection'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
};

export default ListingReview;
