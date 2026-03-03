// frontend/src/pages/owner/OwnerDocuments.jsx
import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Paper, Button, Chip, CircularProgress
} from '@mui/material';
import {
  CloudUpload, CheckCircle, HourglassEmpty, Cancel, Description
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import '../../styles/OwnerDocuments.css';

const documentTypes = [
  {
    key: 'governmentId',
    label: 'Government ID',
    description: 'Valid driver\'s license or passport',
    icon: <Description />
  },
  {
    key: 'vanRegistration',
    label: 'Vehicle Registration',
    description: 'Current registration for your van(s)',
    icon: <Description />
  },
  {
    key: 'safetyInspection',
    label: 'Safety Inspection',
    description: 'Recent vehicle safety inspection certificate',
    icon: <Description />
  },
  {
    key: 'proofOfInsurance',
    label: 'Proof of Insurance',
    description: 'Commercial vehicle insurance documentation',
    icon: <Description />
  }
];

const statusIcons = {
  pending: <HourglassEmpty sx={{ color: '#e67e00', fontSize: 20 }} />,
  approved: <CheckCircle sx={{ color: '#2e7d32', fontSize: 20 }} />,
  rejected: <Cancel sx={{ color: '#c62828', fontSize: 20 }} />,
};

const statusLabels = {
  pending: { label: 'Pending Review', color: '#e67e00', bg: '#fff3e0' },
  approved: { label: 'Approved', color: '#2e7d32', bg: '#e8f5e9' },
  rejected: { label: 'Rejected', color: '#c62828', bg: '#ffebee' },
};

const OwnerDocuments = () => {
  const { user, updateUser } = useAuth();
  const [documents, setDocuments] = useState({});
  const [uploading, setUploading] = useState(null); // docType key being uploaded
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/auth/me');
      setDocuments(data.ownerProfile?.documents || {});
      updateUser(data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (docType, file) => {
    if (!file) return;

    setUploading(docType);
    const formData = new FormData();
    formData.append('document', file);
    formData.append('docType', docType);

    try {
      // Upload file to S3
      const { data: uploadData } = await api.post('/upload/owner-document', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Save reference to user profile
      await api.post('/owner/documents', {
        docType,
        url: uploadData.data.url,
        key: uploadData.data.key
      });

      toast.success('Document uploaded successfully');
      fetchProfile();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload document');
    } finally {
      setUploading(null);
    }
  };

  const allDocsUploaded = documentTypes.every(dt => documents[dt.key]?.url);
  const allDocsApproved = documentTypes.every(dt => documents[dt.key]?.status === 'approved');

  if (loading) {
    return (
      <Box className="owner-docs-loading">
        <CircularProgress sx={{ color: '#002244' }} />
      </Box>
    );
  }

  return (
    <div className="owner-docs-page">
      <Container maxWidth="md" className="owner-docs-container">
        <Typography variant="h3" className="owner-docs-title">
          Owner Documents
        </Typography>
        <Typography className="owner-docs-subtitle">
          Upload the required documents to get your account verified and start listing vans.
        </Typography>

        {/* Progress */}
        <Paper className="owner-docs-progress">
          <Box className="owner-docs-progress-bar">
            <Box
              className="owner-docs-progress-fill"
              sx={{ width: `${(documentTypes.filter(dt => documents[dt.key]?.url).length / documentTypes.length) * 100}%` }}
            />
          </Box>
          <Typography className="owner-docs-progress-text">
            {documentTypes.filter(dt => documents[dt.key]?.url).length} of {documentTypes.length} documents uploaded
          </Typography>
          {allDocsApproved && (
            <Chip label="Verified" icon={<CheckCircle />} className="owner-docs-verified-chip" />
          )}
        </Paper>

        {/* Document Cards */}
        <Box className="owner-docs-grid">
          {documentTypes.map(docType => {
            const doc = documents[docType.key];
            const hasDoc = Boolean(doc?.url);
            const status = doc?.status;

            return (
              <Paper key={docType.key} className={`owner-docs-card ${hasDoc ? 'owner-docs-card-uploaded' : ''}`}>
                <Box className="owner-docs-card-header">
                  <Box className="owner-docs-card-icon">{docType.icon}</Box>
                  <Box className="owner-docs-card-title-container">
                    <Typography className="owner-docs-card-title">{docType.label}</Typography>
                    <Typography className="owner-docs-card-desc">{docType.description}</Typography>
                  </Box>
                  {hasDoc && status && (
                    <Box className="owner-docs-card-status">
                      {statusIcons[status]}
                      <Chip
                        label={statusLabels[status]?.label}
                        size="small"
                        sx={{ backgroundColor: statusLabels[status]?.bg, color: statusLabels[status]?.color, fontWeight: 600 }}
                      />
                    </Box>
                  )}
                </Box>

                {hasDoc && (
                  <Box className="owner-docs-card-file">
                    <Typography className="owner-docs-card-file-text">
                      Uploaded {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : ''}
                    </Typography>
                    <a href={doc.url} target="_blank" rel="noopener noreferrer" className="owner-docs-card-view-link">
                      View Document
                    </a>
                  </Box>
                )}

                <Button
                  variant={hasDoc ? 'text' : 'outlined'}
                  component="label"
                  startIcon={uploading === docType.key ? <CircularProgress size={18} /> : <CloudUpload />}
                  disabled={uploading === docType.key}
                  className={hasDoc ? 'owner-docs-reupload-btn' : 'owner-docs-upload-btn'}
                >
                  {uploading === docType.key ? 'Uploading...' : hasDoc ? 'Replace Document' : 'Upload Document'}
                  <input
                    type="file"
                    hidden
                    accept="image/*,application/pdf"
                    onChange={(e) => {
                      handleUpload(docType.key, e.target.files[0]);
                      e.target.value = '';
                    }}
                  />
                </Button>
              </Paper>
            );
          })}
        </Box>

        {allDocsUploaded && !allDocsApproved && (
          <Paper className="owner-docs-pending-notice">
            <HourglassEmpty sx={{ color: '#e67e00', fontSize: 28 }} />
            <Typography className="owner-docs-pending-text">
              All documents uploaded. Our team will review them shortly.
            </Typography>
          </Paper>
        )}
      </Container>
    </div>
  );
};

export default OwnerDocuments;
