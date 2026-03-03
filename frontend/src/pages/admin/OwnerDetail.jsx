// frontend/src/pages/admin/OwnerDetail.jsx
import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Paper, Button, Chip, CircularProgress,
  Switch, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import {
  ArrowBack, VerifiedUser, Email, Phone, Business, CalendarMonth,
  Login as LoginIcon, Description, CheckCircle, Cancel, HourglassEmpty,
  DirectionsCar, Visibility, Image as ImageIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import '../../styles/OwnerDetail.css';

const docTypes = [
  { key: 'governmentId', label: 'Government ID', description: 'Driver\'s license or passport' },
  { key: 'vanRegistration', label: 'Van Registration', description: 'Vehicle registration document' },
  { key: 'safetyInspection', label: 'Safety Inspection', description: 'Current safety inspection certificate' },
  { key: 'proofOfInsurance', label: 'Proof of Insurance', description: 'Commercial vehicle insurance' },
];

const statusConfig = {
  draft: { label: 'Draft', color: '#888', bg: '#f0f0f0' },
  pending_review: { label: 'Pending', color: '#e67e00', bg: '#fff3e0' },
  approved: { label: 'Approved', color: '#2e7d32', bg: '#e8f5e9' },
  rejected: { label: 'Rejected', color: '#c62828', bg: '#ffebee' },
  suspended: { label: 'Suspended', color: '#666', bg: '#eeeeee' },
};

const docStatusConfig = {
  pending: { label: 'Pending', color: '#e67e00', bg: '#fff3e0', icon: <HourglassEmpty /> },
  approved: { label: 'Approved', color: '#2e7d32', bg: '#e8f5e9', icon: <CheckCircle /> },
  rejected: { label: 'Rejected', color: '#c62828', bg: '#ffebee', icon: <Cancel /> },
};

const OwnerDetail = () => {
  const { id } = useParams();
  const [owner, setOwner] = useState(null);
  const [vans, setVans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [docActionLoading, setDocActionLoading] = useState({});
  const [confirmDialog, setConfirmDialog] = useState({ open: false, action: null });
  const navigate = useNavigate();

  useEffect(() => {
    fetchOwnerDetail();
  }, [id]);

  const fetchOwnerDetail = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/admin/owners/${id}`);
      setOwner(data.owner);
      setVans(data.vans);
    } catch (error) {
      toast.error('Failed to load owner details');
      navigate('/admin/owners');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyToggle = async () => {
    const newVerified = !owner.ownerProfile?.isVerified;
    setConfirmDialog({
      open: true,
      action: () => performVerifyToggle(newVerified),
      title: newVerified ? 'Verify Owner' : 'Remove Verification',
      message: newVerified
        ? `Verify ${owner.firstName} ${owner.lastName} as a trusted van owner?`
        : `Remove verification from ${owner.firstName} ${owner.lastName}?`,
    });
  };

  const performVerifyToggle = async (isVerified) => {
    setVerifyLoading(true);
    setConfirmDialog({ open: false });
    try {
      await api.put(`/admin/users/${id}/verify-owner`, { isVerified });
      setOwner(prev => ({
        ...prev,
        ownerProfile: { ...prev.ownerProfile, isVerified }
      }));
      toast.success(isVerified ? 'Owner verified' : 'Verification removed');
    } catch (error) {
      toast.error('Failed to update verification');
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleDocAction = async (docType, status) => {
    setDocActionLoading(prev => ({ ...prev, [docType]: true }));
    try {
      await api.put(`/admin/users/${id}/verify-owner`, {
        documents: { [docType]: status }
      });
      setOwner(prev => ({
        ...prev,
        ownerProfile: {
          ...prev.ownerProfile,
          documents: {
            ...prev.ownerProfile?.documents,
            [docType]: {
              ...prev.ownerProfile?.documents?.[docType],
              status
            }
          }
        }
      }));
      toast.success(`Document ${status}`);
    } catch (error) {
      toast.error('Failed to update document status');
    } finally {
      setDocActionLoading(prev => ({ ...prev, [docType]: false }));
    }
  };

  const getDocsCompleted = () => {
    if (!owner?.ownerProfile?.documents) return 0;
    const docs = owner.ownerProfile.documents;
    return docTypes.filter(dt => docs[dt.key]?.url).length;
  };

  const getDocsApproved = () => {
    if (!owner?.ownerProfile?.documents) return 0;
    const docs = owner.ownerProfile.documents;
    return docTypes.filter(dt => docs[dt.key]?.status === 'approved').length;
  };

  if (loading) {
    return (
      <Box className="owner-detail-loading">
        <CircularProgress sx={{ color: '#002244' }} />
      </Box>
    );
  }

  if (!owner) return null;

  const docs = owner.ownerProfile?.documents || {};

  return (
    <div className="owner-detail-page">
      <Container maxWidth="lg" className="owner-detail-container">
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/admin/owners')}
          className="owner-detail-back-btn"
        >
          All Owners
        </Button>

        <Box className="owner-detail-layout">
          {/* Main Content */}
          <Box className="owner-detail-main">
            {/* Profile Section */}
            <Paper className="owner-detail-profile-card">
              <Box className="owner-detail-profile-top">
                <Box className="owner-detail-avatar">
                  {owner.firstName?.[0]}{owner.lastName?.[0]}
                </Box>
                <Box className="owner-detail-profile-info">
                  <Box className="owner-detail-name-row">
                    <Typography className="owner-detail-name">
                      {owner.firstName} {owner.lastName}
                    </Typography>
                    {owner.ownerProfile?.isVerified && (
                      <Chip
                        icon={<VerifiedUser sx={{ fontSize: 14 }} />}
                        label="Verified"
                        size="small"
                        className="owner-detail-verified-chip"
                      />
                    )}
                  </Box>
                  <Typography className="owner-detail-business">
                    {owner.ownerProfile?.businessName || 'No business name'}
                  </Typography>
                </Box>
              </Box>

              <Box className="owner-detail-profile-grid">
                <Box className="owner-detail-profile-item">
                  <Email sx={{ fontSize: 18, color: '#888' }} />
                  <Box>
                    <Typography className="owner-detail-profile-label">Email</Typography>
                    <Typography className="owner-detail-profile-value">{owner.email}</Typography>
                  </Box>
                </Box>
                <Box className="owner-detail-profile-item">
                  <Phone sx={{ fontSize: 18, color: '#888' }} />
                  <Box>
                    <Typography className="owner-detail-profile-label">Phone</Typography>
                    <Typography className="owner-detail-profile-value">{owner.phone || 'Not provided'}</Typography>
                  </Box>
                </Box>
                <Box className="owner-detail-profile-item">
                  <Business sx={{ fontSize: 18, color: '#888' }} />
                  <Box>
                    <Typography className="owner-detail-profile-label">Business</Typography>
                    <Typography className="owner-detail-profile-value">
                      {owner.ownerProfile?.businessName || 'Not provided'}
                    </Typography>
                  </Box>
                </Box>
                <Box className="owner-detail-profile-item">
                  <CalendarMonth sx={{ fontSize: 18, color: '#888' }} />
                  <Box>
                    <Typography className="owner-detail-profile-label">Joined</Typography>
                    <Typography className="owner-detail-profile-value">
                      {new Date(owner.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
                <Box className="owner-detail-profile-item">
                  <LoginIcon sx={{ fontSize: 18, color: '#888' }} />
                  <Box>
                    <Typography className="owner-detail-profile-label">Last Login</Typography>
                    <Typography className="owner-detail-profile-value">
                      {owner.lastLogin
                        ? new Date(owner.lastLogin).toLocaleDateString()
                        : 'Never'
                      }
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>

            {/* Documents Section */}
            <Typography variant="h5" className="owner-detail-section-title">
              <Description sx={{ fontSize: 24, mr: 1 }} />
              Documents ({getDocsCompleted()}/4 uploaded)
            </Typography>
            <Box className="owner-detail-docs-grid">
              {docTypes.map(docType => {
                const doc = docs[docType.key];
                const hasDoc = !!doc?.url;
                const docStatus = doc?.status || 'pending';
                const statusCfg = docStatusConfig[docStatus] || docStatusConfig.pending;

                return (
                  <Paper key={docType.key} className="owner-detail-doc-card">
                    <Box className="owner-detail-doc-preview">
                      {hasDoc ? (
                        doc.url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                          <img src={doc.url} alt={docType.label} className="owner-detail-doc-thumb" />
                        ) : (
                          <Box className="owner-detail-doc-file-icon">
                            <Description sx={{ fontSize: 40, color: '#002244' }} />
                            <Typography className="owner-detail-doc-file-label">PDF</Typography>
                          </Box>
                        )
                      ) : (
                        <Box className="owner-detail-doc-empty">
                          <ImageIcon sx={{ fontSize: 32, color: '#ccc' }} />
                          <Typography className="owner-detail-doc-empty-text">Not uploaded</Typography>
                        </Box>
                      )}
                    </Box>

                    <Box className="owner-detail-doc-info">
                      <Typography className="owner-detail-doc-title">{docType.label}</Typography>
                      <Typography className="owner-detail-doc-desc">{docType.description}</Typography>

                      {hasDoc && (
                        <>
                          <Chip
                            icon={statusCfg.icon}
                            label={statusCfg.label}
                            size="small"
                            sx={{
                              backgroundColor: statusCfg.bg,
                              color: statusCfg.color,
                              fontWeight: 600,
                              fontSize: '0.7rem',
                              mt: 1,
                              '& .MuiChip-icon': { color: statusCfg.color }
                            }}
                          />
                          {doc.uploadedAt && (
                            <Typography className="owner-detail-doc-date">
                              Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                            </Typography>
                          )}
                        </>
                      )}
                    </Box>

                    {hasDoc && (
                      <Box className="owner-detail-doc-actions">
                        {docStatus !== 'approved' && (
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => handleDocAction(docType.key, 'approved')}
                            disabled={docActionLoading[docType.key]}
                            className="owner-detail-doc-approve-btn"
                          >
                            Approve
                          </Button>
                        )}
                        {docStatus !== 'rejected' && (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleDocAction(docType.key, 'rejected')}
                            disabled={docActionLoading[docType.key]}
                            className="owner-detail-doc-reject-btn"
                          >
                            Reject
                          </Button>
                        )}
                      </Box>
                    )}
                  </Paper>
                );
              })}
            </Box>

            {/* Vans Section */}
            <Typography variant="h5" className="owner-detail-section-title">
              <DirectionsCar sx={{ fontSize: 24, mr: 1 }} />
              Vans ({vans.length})
            </Typography>
            {vans.length === 0 ? (
              <Paper className="owner-detail-vans-empty">
                <Typography className="owner-detail-vans-empty-text">
                  This owner has no van listings yet.
                </Typography>
              </Paper>
            ) : (
              <Box className="owner-detail-vans-grid">
                {vans.map(van => {
                  const status = statusConfig[van.approvalStatus] || statusConfig.draft;
                  return (
                    <Paper key={van._id} className="owner-detail-van-card">
                      <Box className="owner-detail-van-image-container">
                        {van.thumbnailImage ? (
                          <img src={van.thumbnailImage} alt={van.name} className="owner-detail-van-image" />
                        ) : (
                          <Box className="owner-detail-van-no-image">
                            <DirectionsCar sx={{ fontSize: 32, color: '#ccc' }} />
                          </Box>
                        )}
                        <Chip
                          label={status.label}
                          size="small"
                          className="owner-detail-van-status-chip"
                          sx={{ backgroundColor: status.bg, color: status.color }}
                        />
                      </Box>
                      <Box className="owner-detail-van-info">
                        <Typography className="owner-detail-van-name">{van.name}</Typography>
                        <Typography className="owner-detail-van-details">
                          {van.year} &middot; {van.seating} passengers
                        </Typography>
                        <Typography className="owner-detail-van-price">
                          ${van.pricing?.dailyRate}/day
                        </Typography>
                        {van.images && (
                          <Typography className="owner-detail-van-images-count">
                            <ImageIcon sx={{ fontSize: 14, mr: 0.5 }} />
                            {van.images.length + (van.thumbnailImage ? 1 : 0)} photos
                          </Typography>
                        )}
                      </Box>
                      <Box className="owner-detail-van-actions">
                        <Button
                          size="small"
                          startIcon={<Visibility />}
                          onClick={() => navigate(`/admin/listings/${van._id}`)}
                          className="owner-detail-van-review-btn"
                        >
                          Review
                        </Button>
                      </Box>
                    </Paper>
                  );
                })}
              </Box>
            )}
          </Box>

          {/* Sidebar */}
          <Box className="owner-detail-sidebar">
            <Paper className="owner-detail-sidebar-card">
              <Typography className="owner-detail-sidebar-title">Quick Actions</Typography>

              <Box className="owner-detail-verify-row">
                <Typography className="owner-detail-verify-label">
                  {owner.ownerProfile?.isVerified ? 'Verified Owner' : 'Not Verified'}
                </Typography>
                <Switch
                  checked={owner.ownerProfile?.isVerified || false}
                  onChange={handleVerifyToggle}
                  disabled={verifyLoading}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#2e7d32' },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#2e7d32' },
                  }}
                />
              </Box>

              <Box className="owner-detail-sidebar-stats">
                <Box className="owner-detail-sidebar-stat">
                  <Typography className="owner-detail-sidebar-stat-number">{getDocsCompleted()}/4</Typography>
                  <Typography className="owner-detail-sidebar-stat-label">Docs Uploaded</Typography>
                </Box>
                <Box className="owner-detail-sidebar-stat">
                  <Typography className="owner-detail-sidebar-stat-number">{getDocsApproved()}/4</Typography>
                  <Typography className="owner-detail-sidebar-stat-label">Docs Approved</Typography>
                </Box>
                <Box className="owner-detail-sidebar-stat">
                  <Typography className="owner-detail-sidebar-stat-number">{vans.length}</Typography>
                  <Typography className="owner-detail-sidebar-stat-label">Total Vans</Typography>
                </Box>
                <Box className="owner-detail-sidebar-stat">
                  <Typography className="owner-detail-sidebar-stat-number">
                    {vans.filter(v => v.approvalStatus === 'approved').length}
                  </Typography>
                  <Typography className="owner-detail-sidebar-stat-label">Approved</Typography>
                </Box>
              </Box>

              <Box className="owner-detail-sidebar-account">
                <Typography className="owner-detail-sidebar-subtitle">Account Status</Typography>
                <Chip
                  label={owner.isActive ? 'Active' : 'Inactive'}
                  size="small"
                  className={owner.isActive ? 'owners-list-status-active' : 'owners-list-status-inactive'}
                />
              </Box>
            </Paper>
          </Box>
        </Box>
      </Container>

      {/* Confirm Dialog */}
      <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ open: false })}>
        <DialogTitle sx={{ color: '#002244', fontWeight: 600 }}>
          {confirmDialog.title}
        </DialogTitle>
        <DialogContent>
          <Typography>{confirmDialog.message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false })} sx={{ color: '#666' }}>
            Cancel
          </Button>
          <Button
            onClick={confirmDialog.action}
            variant="contained"
            sx={{ backgroundColor: '#002244', '&:hover': { backgroundColor: '#003366' } }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default OwnerDetail;
