// frontend/src/pages/owner/VanListingForm.jsx
import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Paper, Button, TextField, MenuItem,
  Stepper, Step, StepLabel, CircularProgress, IconButton, Chip
} from '@mui/material';
import {
  ArrowBack, ArrowForward, CloudUpload, Delete, Save, Send
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import '../../styles/VanListingForm.css';

const steps = ['Van Details', 'Photos', 'Pricing', 'Location & Availability', 'Review'];

const VanListingForm = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    type: 'Sprinter',
    year: new Date().getFullYear(),
    seating: 10,
    description: '',
    features: [],
    featureInput: '',
    vin: '',
    mileage: '',
    driverAvailability: 'both',
    cancellationPolicy: 'moderate',
    thumbnailImage: '',
    images: [],
    pricing: {
      hourlyRate: '',
      dailyRate: '',
      weeklyRate: '',
      deposit: 500,
      insuranceFee: 75,
      destinationFee: 0,
      minimumHours: 4,
    },
    location: {
      address: '',
      city: '',
      state: 'TX',
      zip: '',
      serviceRadius: 50,
    },
  });

  useEffect(() => {
    if (isEditing) {
      fetchVan();
    }
  }, [id]);

  const fetchVan = async () => {
    try {
      const { data } = await api.get(`/owner/vans`);
      const van = data.find(v => v._id === id);
      if (!van) {
        toast.error('Listing not found');
        navigate('/owner/listings');
        return;
      }
      setFormData({
        name: van.name || '',
        type: van.type || 'Sprinter',
        year: van.year || new Date().getFullYear(),
        seating: van.seating || 10,
        description: van.description || '',
        features: van.features || [],
        featureInput: '',
        vin: van.vin || '',
        mileage: van.mileage || '',
        driverAvailability: van.driverAvailability || 'both',
        cancellationPolicy: van.cancellationPolicy || 'moderate',
        thumbnailImage: van.thumbnailImage || '',
        images: van.images || [],
        pricing: {
          hourlyRate: van.pricing?.hourlyRate || '',
          dailyRate: van.pricing?.dailyRate || '',
          weeklyRate: van.pricing?.weeklyRate || '',
          deposit: van.pricing?.deposit || 500,
          insuranceFee: van.pricing?.insuranceFee || 75,
          destinationFee: van.pricing?.destinationFee || 0,
          minimumHours: van.pricing?.minimumHours || 4,
        },
        location: {
          address: van.location?.address || '',
          city: van.location?.city || '',
          state: van.location?.state || 'TX',
          zip: van.location?.zip || '',
          serviceRadius: van.location?.serviceRadius || 50,
        },
      });
    } catch (error) {
      toast.error('Failed to load listing');
      navigate('/owner/listings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePricingChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      pricing: { ...prev.pricing, [field]: value }
    }));
  };

  const handleLocationChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      location: { ...prev.location, [field]: value }
    }));
  };

  const handleAddFeature = () => {
    const feature = formData.featureInput.trim();
    if (feature && !formData.features.includes(feature)) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, feature],
        featureInput: ''
      }));
    }
  };

  const handleRemoveFeature = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(f => f !== feature)
    }));
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const maxImages = 25 - formData.images.length - (formData.thumbnailImage ? 0 : 0);
    if (files.length > maxImages) {
      toast.error(`You can upload up to ${maxImages} more images`);
      return;
    }

    setUploading(true);
    const form = new FormData();
    for (let i = 0; i < files.length; i++) {
      form.append('vanImages', files[i]);
    }

    try {
      const { data } = await api.post('/upload/van-images', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const newUrls = data.data.map(f => f.url);

      setFormData(prev => {
        const updated = { ...prev };
        if (!updated.thumbnailImage && newUrls.length > 0) {
          updated.thumbnailImage = newUrls[0];
          updated.images = [...prev.images, ...newUrls.slice(1)];
        } else {
          updated.images = [...prev.images, ...newUrls];
        }
        return updated;
      });

      toast.success(`${newUrls.length} image(s) uploaded`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload images');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleRemoveImage = (url) => {
    setFormData(prev => {
      if (prev.thumbnailImage === url) {
        // Promote first gallery image to thumbnail
        const newThumb = prev.images.length > 0 ? prev.images[0] : '';
        return {
          ...prev,
          thumbnailImage: newThumb,
          images: prev.images.slice(1)
        };
      }
      return {
        ...prev,
        images: prev.images.filter(img => img !== url)
      };
    });
  };

  const handleSetThumbnail = (url) => {
    setFormData(prev => {
      const allImages = [prev.thumbnailImage, ...prev.images].filter(Boolean);
      return {
        ...prev,
        thumbnailImage: url,
        images: allImages.filter(img => img !== url)
      };
    });
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      const payload = buildPayload();
      if (isEditing) {
        await api.put(`/owner/vans/${id}`, payload);
        toast.success('Listing updated');
      } else {
        const { data } = await api.post('/owner/vans', payload);
        toast.success('Draft saved');
        navigate(`/owner/listings/${data._id}/edit`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitForReview = async () => {
    setSaving(true);
    try {
      const payload = buildPayload();
      let vanId = id;

      if (isEditing) {
        await api.put(`/owner/vans/${id}`, payload);
      } else {
        const { data } = await api.post('/owner/vans', payload);
        vanId = data._id;
      }

      await api.put(`/owner/vans/${vanId}/submit`);
      toast.success('Listing submitted for review!');
      navigate('/owner/listings');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit');
    } finally {
      setSaving(false);
    }
  };

  const buildPayload = () => ({
    name: formData.name,
    type: formData.type,
    year: Number(formData.year),
    seating: Number(formData.seating),
    description: formData.description,
    features: formData.features,
    vin: formData.vin,
    mileage: formData.mileage ? Number(formData.mileage) : undefined,
    driverAvailability: formData.driverAvailability,
    cancellationPolicy: formData.cancellationPolicy,
    thumbnailImage: formData.thumbnailImage,
    images: formData.images,
    pricing: {
      hourlyRate: Number(formData.pricing.hourlyRate),
      dailyRate: Number(formData.pricing.dailyRate),
      weeklyRate: formData.pricing.weeklyRate ? Number(formData.pricing.weeklyRate) : undefined,
      deposit: Number(formData.pricing.deposit),
      insuranceFee: Number(formData.pricing.insuranceFee),
      destinationFee: Number(formData.pricing.destinationFee),
      minimumHours: Number(formData.pricing.minimumHours),
    },
    location: formData.location,
  });

  const canProceed = () => {
    switch (activeStep) {
      case 0: return formData.name && formData.type && formData.year && formData.seating && formData.description;
      case 1: return true; // Photos optional for draft
      case 2: return formData.pricing.dailyRate && formData.pricing.hourlyRate;
      case 3: return true;
      case 4: return true;
      default: return true;
    }
  };

  if (loading) {
    return (
      <Box className="van-listing-form-loading">
        <CircularProgress sx={{ color: '#002244' }} />
      </Box>
    );
  }

  return (
    <div className="van-listing-form-page">
      <Container maxWidth="md" className="van-listing-form-container">
        <Typography variant="h3" className="van-listing-form-title">
          {isEditing ? 'Edit Listing' : 'Create New Listing'}
        </Typography>

        <Stepper activeStep={activeStep} alternativeLabel className="van-listing-form-stepper">
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Paper className="van-listing-form-card">
          {/* Step 1: Van Details */}
          {activeStep === 0 && (
            <Box className="van-listing-form-step">
              <Typography variant="h5" className="van-listing-form-step-title">Van Details</Typography>
              <TextField label="Van Name" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} required fullWidth className="van-listing-form-input" />
              <Box className="van-listing-form-row">
                <TextField select label="Type" value={formData.type} onChange={(e) => handleChange('type', e.target.value)} fullWidth className="van-listing-form-input">
                  <MenuItem value="Sprinter">Sprinter</MenuItem>
                  <MenuItem value="Transit">Transit</MenuItem>
                  <MenuItem value="Metris">Metris</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>
                <TextField label="Year" type="number" value={formData.year} onChange={(e) => handleChange('year', e.target.value)} fullWidth className="van-listing-form-input" />
                <TextField label="Seating" type="number" value={formData.seating} onChange={(e) => handleChange('seating', e.target.value)} fullWidth className="van-listing-form-input" />
              </Box>
              <TextField label="Description" multiline rows={4} value={formData.description} onChange={(e) => handleChange('description', e.target.value)} required fullWidth className="van-listing-form-input" />
              <TextField label="VIN (optional)" value={formData.vin} onChange={(e) => handleChange('vin', e.target.value)} fullWidth className="van-listing-form-input" />
              <TextField label="Mileage (optional)" type="number" value={formData.mileage} onChange={(e) => handleChange('mileage', e.target.value)} fullWidth className="van-listing-form-input" />

              {/* Features */}
              <Typography className="van-listing-form-label">Features & Amenities</Typography>
              <Box className="van-listing-form-feature-input">
                <TextField
                  label="Add a feature"
                  value={formData.featureInput}
                  onChange={(e) => handleChange('featureInput', e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddFeature(); } }}
                  fullWidth
                  className="van-listing-form-input"
                />
                <Button variant="outlined" onClick={handleAddFeature} className="van-listing-form-feature-add-btn">Add</Button>
              </Box>
              <Box className="van-listing-form-features-list">
                {formData.features.map((f, i) => (
                  <Chip key={i} label={f} onDelete={() => handleRemoveFeature(f)} className="van-listing-form-feature-chip" />
                ))}
              </Box>
            </Box>
          )}

          {/* Step 2: Photos */}
          {activeStep === 1 && (
            <Box className="van-listing-form-step">
              <Typography variant="h5" className="van-listing-form-step-title">Photos</Typography>
              <Typography className="van-listing-form-hint">Upload up to 25 photos. The first image becomes the thumbnail.</Typography>

              <Button
                variant="outlined"
                component="label"
                startIcon={uploading ? <CircularProgress size={20} /> : <CloudUpload />}
                disabled={uploading}
                className="van-listing-form-upload-btn"
              >
                {uploading ? 'Uploading...' : 'Upload Photos'}
                <input type="file" hidden multiple accept="image/*" onChange={handleImageUpload} />
              </Button>

              {/* Image Grid */}
              <Box className="van-listing-form-image-grid">
                {formData.thumbnailImage && (
                  <Box className="van-listing-form-image-item van-listing-form-image-thumb">
                    <img src={formData.thumbnailImage} alt="Thumbnail" />
                    <Chip label="Thumbnail" size="small" className="van-listing-form-thumb-badge" />
                    <IconButton className="van-listing-form-image-remove" onClick={() => handleRemoveImage(formData.thumbnailImage)} size="small">
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                )}
                {formData.images.map((url, i) => (
                  <Box key={i} className="van-listing-form-image-item" onClick={() => handleSetThumbnail(url)}>
                    <img src={url} alt={`Van image ${i + 1}`} />
                    <IconButton
                      className="van-listing-form-image-remove"
                      onClick={(e) => { e.stopPropagation(); handleRemoveImage(url); }}
                      size="small"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
              {formData.images.length > 0 && (
                <Typography className="van-listing-form-hint" sx={{ mt: 1 }}>Click any image to set it as thumbnail.</Typography>
              )}
            </Box>
          )}

          {/* Step 3: Pricing */}
          {activeStep === 2 && (
            <Box className="van-listing-form-step">
              <Typography variant="h5" className="van-listing-form-step-title">Pricing</Typography>
              <Box className="van-listing-form-row">
                <TextField label="Hourly Rate ($)" type="number" value={formData.pricing.hourlyRate} onChange={(e) => handlePricingChange('hourlyRate', e.target.value)} required fullWidth className="van-listing-form-input" />
                <TextField label="Daily Rate ($)" type="number" value={formData.pricing.dailyRate} onChange={(e) => handlePricingChange('dailyRate', e.target.value)} required fullWidth className="van-listing-form-input" />
                <TextField label="Weekly Rate ($)" type="number" value={formData.pricing.weeklyRate} onChange={(e) => handlePricingChange('weeklyRate', e.target.value)} fullWidth className="van-listing-form-input" helperText="Optional" />
              </Box>
              <Box className="van-listing-form-row">
                <TextField label="Security Deposit ($)" type="number" value={formData.pricing.deposit} onChange={(e) => handlePricingChange('deposit', e.target.value)} fullWidth className="van-listing-form-input" />
                <TextField label="Insurance Fee ($)" type="number" value={formData.pricing.insuranceFee} onChange={(e) => handlePricingChange('insuranceFee', e.target.value)} fullWidth className="van-listing-form-input" />
                <TextField label="Destination Fee ($)" type="number" value={formData.pricing.destinationFee} onChange={(e) => handlePricingChange('destinationFee', e.target.value)} fullWidth className="van-listing-form-input" />
              </Box>
              <TextField label="Minimum Hours" type="number" value={formData.pricing.minimumHours} onChange={(e) => handlePricingChange('minimumHours', e.target.value)} className="van-listing-form-input" sx={{ maxWidth: 200 }} />

              <Box className="van-listing-form-pricing-preview">
                <Typography className="van-listing-form-label">Platform Fees (for your reference)</Typography>
                <Typography className="van-listing-form-hint">NTX charges a $20 booking fee to the customer + 20% of the rental amount. You receive 80% of the rental amount.</Typography>
              </Box>
            </Box>
          )}

          {/* Step 4: Location & Availability */}
          {activeStep === 3 && (
            <Box className="van-listing-form-step">
              <Typography variant="h5" className="van-listing-form-step-title">Location & Availability</Typography>
              <TextField label="Street Address" value={formData.location.address} onChange={(e) => handleLocationChange('address', e.target.value)} fullWidth className="van-listing-form-input" />
              <Box className="van-listing-form-row">
                <TextField label="City" value={formData.location.city} onChange={(e) => handleLocationChange('city', e.target.value)} fullWidth className="van-listing-form-input" />
                <TextField label="State" value={formData.location.state} onChange={(e) => handleLocationChange('state', e.target.value)} fullWidth className="van-listing-form-input" sx={{ maxWidth: 100 }} />
                <TextField label="ZIP Code" value={formData.location.zip} onChange={(e) => handleLocationChange('zip', e.target.value)} fullWidth className="van-listing-form-input" sx={{ maxWidth: 140 }} />
              </Box>
              <TextField label="Service Radius (miles)" type="number" value={formData.location.serviceRadius} onChange={(e) => handleLocationChange('serviceRadius', e.target.value)} className="van-listing-form-input" sx={{ maxWidth: 200 }} />

              <TextField select label="Driver Availability" value={formData.driverAvailability} onChange={(e) => handleChange('driverAvailability', e.target.value)} fullWidth className="van-listing-form-input">
                <MenuItem value="both">Owner Drives or Renter Drives</MenuItem>
                <MenuItem value="owner_drives">Owner Drives Only</MenuItem>
                <MenuItem value="renter_drives">Renter Drives Only</MenuItem>
              </TextField>

              <TextField select label="Cancellation Policy" value={formData.cancellationPolicy} onChange={(e) => handleChange('cancellationPolicy', e.target.value)} fullWidth className="van-listing-form-input">
                <MenuItem value="flexible">Flexible — Full refund up to 24 hours before</MenuItem>
                <MenuItem value="moderate">Moderate — Full refund up to 5 days before</MenuItem>
                <MenuItem value="strict">Strict — 50% refund up to 7 days before</MenuItem>
              </TextField>
            </Box>
          )}

          {/* Step 5: Review */}
          {activeStep === 4 && (
            <Box className="van-listing-form-step">
              <Typography variant="h5" className="van-listing-form-step-title">Review Your Listing</Typography>

              <Box className="van-listing-form-review-section">
                <Typography className="van-listing-form-review-label">Van</Typography>
                <Typography className="van-listing-form-review-value">{formData.name} — {formData.year} {formData.type}, {formData.seating} passengers</Typography>
              </Box>

              <Box className="van-listing-form-review-section">
                <Typography className="van-listing-form-review-label">Description</Typography>
                <Typography className="van-listing-form-review-value">{formData.description || 'Not provided'}</Typography>
              </Box>

              <Box className="van-listing-form-review-section">
                <Typography className="van-listing-form-review-label">Features</Typography>
                <Box className="van-listing-form-features-list">
                  {formData.features.length > 0 ? formData.features.map((f, i) => (
                    <Chip key={i} label={f} size="small" />
                  )) : <Typography className="van-listing-form-review-value">None added</Typography>}
                </Box>
              </Box>

              <Box className="van-listing-form-review-section">
                <Typography className="van-listing-form-review-label">Photos</Typography>
                <Typography className="van-listing-form-review-value">
                  {(formData.thumbnailImage ? 1 : 0) + formData.images.length} image(s) uploaded
                </Typography>
              </Box>

              <Box className="van-listing-form-review-section">
                <Typography className="van-listing-form-review-label">Pricing</Typography>
                <Typography className="van-listing-form-review-value">
                  ${formData.pricing.hourlyRate}/hr &middot; ${formData.pricing.dailyRate}/day
                  {formData.pricing.weeklyRate ? ` · $${formData.pricing.weeklyRate}/week` : ''}
                  &middot; ${formData.pricing.deposit} deposit &middot; ${formData.pricing.insuranceFee} insurance
                </Typography>
              </Box>

              <Box className="van-listing-form-review-section">
                <Typography className="van-listing-form-review-label">Location</Typography>
                <Typography className="van-listing-form-review-value">
                  {formData.location.city ? `${formData.location.city}, ${formData.location.state}` : 'Not provided'}
                  {formData.location.serviceRadius ? ` (${formData.location.serviceRadius} mile radius)` : ''}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Navigation */}
          <Box className="van-listing-form-nav">
            <Button
              variant="text"
              startIcon={<ArrowBack />}
              onClick={() => setActiveStep(prev => prev - 1)}
              disabled={activeStep === 0}
              className="van-listing-form-nav-btn"
            >
              Back
            </Button>

            <Box className="van-listing-form-nav-right">
              <Button
                variant="outlined"
                startIcon={<Save />}
                onClick={handleSaveDraft}
                disabled={saving}
                className="van-listing-form-save-btn"
              >
                {saving ? 'Saving...' : 'Save Draft'}
              </Button>

              {activeStep < steps.length - 1 ? (
                <Button
                  variant="contained"
                  endIcon={<ArrowForward />}
                  onClick={() => setActiveStep(prev => prev + 1)}
                  disabled={!canProceed()}
                  className="van-listing-form-next-btn"
                >
                  Next
                </Button>
              ) : (
                <Button
                  variant="contained"
                  startIcon={<Send />}
                  onClick={handleSubmitForReview}
                  disabled={saving}
                  className="van-listing-form-submit-btn"
                >
                  {saving ? 'Submitting...' : 'Submit for Review'}
                </Button>
              )}
            </Box>
          </Box>
        </Paper>
      </Container>
    </div>
  );
};

export default VanListingForm;
