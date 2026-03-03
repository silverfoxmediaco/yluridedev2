// frontend/src/pages/VanDetail.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Container, Typography, Box, Button, CircularProgress } from '@mui/material';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Close,
  CheckCircle,
  Share,
  People,
  CalendarMonth,
  DirectionsCar,
  NavigateNext,
} from '@mui/icons-material';
import axios from 'axios';
import mockVans from '../data/vanData';
import BookingModal from '../components/BookingModal';
import '../styles/VanDetail.css';

const VanDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [van, setVan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [shareTooltip, setShareTooltip] = useState(false);

  // Load van data
  useEffect(() => {
    const loadVan = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/vans/${id}`);
        if (response.data) {
          setVan(response.data);
        } else {
          throw new Error('No data');
        }
      } catch {
        // Fall back to mock data
        const found = mockVans.find(v => v._id === id);
        if (found) {
          setVan(found);
        } else {
          setNotFound(true);
        }
      } finally {
        setLoading(false);
      }
    };
    loadVan();
  }, [id]);

  // Set page title
  useEffect(() => {
    if (van) {
      document.title = `${van.name} | NTX Luxury Van Rentals`;
    }
    return () => {
      document.title = 'NTX Luxury Van Rentals';
    };
  }, [van]);

  // All images combined
  const allImages = van ? [van.thumbnailImage, ...(van.images || [])] : [];

  // Image navigation
  const goToPrev = useCallback(() => {
    setCurrentImageIndex(prev => (prev === 0 ? allImages.length - 1 : prev - 1));
  }, [allImages.length]);

  const goToNext = useCallback(() => {
    setCurrentImageIndex(prev => (prev === allImages.length - 1 ? 0 : prev + 1));
  }, [allImages.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxOpen, goToPrev, goToNext]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [lightboxOpen]);

  // Share handler
  const handleShare = async () => {
    const url = window.location.href;
    const title = `${van.name} | NTX Luxury Van Rentals`;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // User cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(url);
      setShareTooltip(true);
      setTimeout(() => setShareTooltip(false), 2000);
    }
  };

  // Loading state
  if (loading) {
    return (
      <Box className="van-detail-loading">
        <CircularProgress size={48} sx={{ color: '#002244' }} />
        <Typography variant="body1" sx={{ mt: 2, color: '#666' }}>Loading van details...</Typography>
      </Box>
    );
  }

  // Not found state
  if (notFound || !van) {
    return (
      <Box className="van-detail-not-found">
        <Typography variant="h4" className="van-detail-not-found-title">Van Not Found</Typography>
        <Typography variant="body1" className="van-detail-not-found-text">
          The van you're looking for doesn't exist or may have been removed.
        </Typography>
        <Button
          variant="contained"
          className="van-detail-back-button"
          onClick={() => navigate('/booking')}
        >
          Browse Our Fleet
        </Button>
      </Box>
    );
  }

  return (
    <Box className="van-detail-page">
      {/* Breadcrumbs */}
      <Box className="van-detail-breadcrumbs-bar">
        <Container maxWidth="lg">
          <Box className="van-detail-breadcrumbs">
            <Link to="/" className="van-detail-breadcrumb-link">Home</Link>
            <NavigateNext className="van-detail-breadcrumb-sep" />
            <Link to="/booking" className="van-detail-breadcrumb-link">Fleet</Link>
            <NavigateNext className="van-detail-breadcrumb-sep" />
            <Typography className="van-detail-breadcrumb-current">{van.name}</Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" className="van-detail-container">
        {/* Gallery Section */}
        <Box className="van-detail-gallery">
          {/* Main Image */}
          <Box className="van-detail-main-image-wrap" onClick={() => setLightboxOpen(true)}>
            <img
              src={allImages[currentImageIndex]}
              alt={`${van.name} - Image ${currentImageIndex + 1}`}
              className="van-detail-main-image"
            />
            {/* Arrow nav */}
            {allImages.length > 1 && (
              <>
                <button
                  className="van-detail-gallery-arrow van-detail-gallery-arrow-prev"
                  onClick={(e) => { e.stopPropagation(); goToPrev(); }}
                  aria-label="Previous image"
                >
                  <ChevronLeft />
                </button>
                <button
                  className="van-detail-gallery-arrow van-detail-gallery-arrow-next"
                  onClick={(e) => { e.stopPropagation(); goToNext(); }}
                  aria-label="Next image"
                >
                  <ChevronRight />
                </button>
              </>
            )}
            {/* Image counter */}
            <Box className="van-detail-image-counter">
              {currentImageIndex + 1} / {allImages.length}
            </Box>
          </Box>

          {/* Desktop Thumbnail Grid */}
          <Box className="van-detail-thumb-grid">
            {allImages.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`${van.name} thumbnail ${i + 1}`}
                className={`van-detail-thumb ${i === currentImageIndex ? 'van-detail-thumb-active' : ''}`}
                onClick={() => setCurrentImageIndex(i)}
                loading="lazy"
              />
            ))}
          </Box>

          {/* Mobile Thumbnail Strip */}
          <Box className="van-detail-thumb-strip">
            {allImages.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`${van.name} thumbnail ${i + 1}`}
                className={`van-detail-thumb-strip-item ${i === currentImageIndex ? 'van-detail-thumb-strip-active' : ''}`}
                onClick={() => setCurrentImageIndex(i)}
                loading="lazy"
              />
            ))}
          </Box>
        </Box>

        {/* Info Section */}
        <Box className="van-detail-info-section">
          {/* Left: Details */}
          <Box className="van-detail-details">
            {/* Van Header */}
            <Box className="van-detail-header">
              <Box>
                <Typography variant="h3" className="van-detail-name">{van.name}</Typography>
                <Box className="van-detail-meta">
                  <Box className="van-detail-meta-item">
                    <CalendarMonth className="van-detail-meta-icon" />
                    <Typography variant="body2">{van.year} {van.type}</Typography>
                  </Box>
                  <Box className="van-detail-meta-item">
                    <People className="van-detail-meta-icon" />
                    <Typography variant="body2">{van.seating} Passengers</Typography>
                  </Box>
                  <Box className="van-detail-meta-item">
                    <DirectionsCar className="van-detail-meta-icon" />
                    <Typography variant="body2">Mercedes Sprinter</Typography>
                  </Box>
                </Box>
              </Box>
              <Box className="van-detail-share-wrap">
                <button className="van-detail-share-btn" onClick={handleShare} aria-label="Share this van">
                  <Share />
                </button>
                {shareTooltip && (
                  <Typography className="van-detail-share-tooltip">Link copied!</Typography>
                )}
              </Box>
            </Box>

            {/* Description */}
            <Box className="van-detail-description-section">
              <Typography variant="h5" className="van-detail-section-title">About This Van</Typography>
              <Typography variant="body1" className="van-detail-description-text">{van.description}</Typography>
            </Box>

            {/* Features */}
            {van.features && van.features.length > 0 && (
              <Box className="van-detail-features-section">
                <Typography variant="h5" className="van-detail-section-title">Features & Amenities</Typography>
                <Box className="van-detail-features-grid">
                  {van.features.map((feature, i) => (
                    <Box key={i} className="van-detail-feature-item">
                      <CheckCircle className="van-detail-feature-icon" />
                      <Typography variant="body2">{feature}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Box>

          {/* Right: Pricing Card */}
          <Box className="van-detail-pricing-card">
            <Box className="van-detail-pricing-card-inner">
              <Typography variant="h5" className="van-detail-pricing-title">Pricing</Typography>

              <Box className="van-detail-price-row van-detail-price-row-main">
                <Typography className="van-detail-price-label">Daily Rate</Typography>
                <Typography className="van-detail-price-value van-detail-price-daily">
                  ${van.pricing?.dailyRate}<span className="van-detail-price-unit">/day</span>
                </Typography>
              </Box>

              <Box className="van-detail-price-row">
                <Typography className="van-detail-price-label">Hourly Rate</Typography>
                <Typography className="van-detail-price-value">
                  ${van.pricing?.hourlyRate}/hr
                </Typography>
              </Box>
              <Typography className="van-detail-price-note">
                {van.pricing?.minimumHours || 4} hour minimum
              </Typography>

              <Box className="van-detail-price-row">
                <Typography className="van-detail-price-label">Weekly Rate</Typography>
                <Typography className="van-detail-price-value">
                  ${van.pricing?.weeklyRate?.toLocaleString()}/wk
                </Typography>
              </Box>

              <Box className="van-detail-price-divider" />

              <Box className="van-detail-price-row">
                <Typography className="van-detail-price-label">Security Deposit</Typography>
                <Typography className="van-detail-price-value">${van.pricing?.deposit}</Typography>
              </Box>

              <Box className="van-detail-price-row">
                <Typography className="van-detail-price-label">Insurance Fee</Typography>
                <Typography className="van-detail-price-value">${van.pricing?.insuranceFee}</Typography>
              </Box>

              <Box className="van-detail-price-row">
                <Typography className="van-detail-price-label">Destination Fee</Typography>
                <Typography className="van-detail-price-value">${van.pricing?.destinationFee}</Typography>
              </Box>

              <Button
                variant="contained"
                fullWidth
                className="van-detail-book-button"
                onClick={() => setBookingModalOpen(true)}
                disabled={!van.availability}
              >
                {van.availability ? 'Book This Van' : 'Not Available'}
              </Button>

              <Link to="/contact" className="van-detail-contact-link">
                Questions? Contact Us
              </Link>
            </Box>
          </Box>
        </Box>
      </Container>

      {/* Mobile Sticky CTA */}
      <Box className="van-detail-mobile-cta">
        <Box className="van-detail-mobile-cta-price">
          <Typography className="van-detail-mobile-cta-amount">${van.pricing?.dailyRate}</Typography>
          <Typography className="van-detail-mobile-cta-unit">/day</Typography>
        </Box>
        <Button
          variant="contained"
          className="van-detail-mobile-cta-button"
          onClick={() => setBookingModalOpen(true)}
          disabled={!van.availability}
        >
          Book This Van
        </Button>
      </Box>

      {/* Lightbox */}
      {lightboxOpen && (
        <Box className="van-detail-lightbox" onClick={() => setLightboxOpen(false)}>
          <button
            className="van-detail-lightbox-close"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close lightbox"
          >
            <Close />
          </button>

          <img
            src={allImages[currentImageIndex]}
            alt={`${van.name} - Image ${currentImageIndex + 1}`}
            className="van-detail-lightbox-image"
            onClick={(e) => e.stopPropagation()}
          />

          {allImages.length > 1 && (
            <>
              <button
                className="van-detail-lightbox-arrow van-detail-lightbox-arrow-prev"
                onClick={(e) => { e.stopPropagation(); goToPrev(); }}
                aria-label="Previous image"
              >
                <ChevronLeft />
              </button>
              <button
                className="van-detail-lightbox-arrow van-detail-lightbox-arrow-next"
                onClick={(e) => { e.stopPropagation(); goToNext(); }}
                aria-label="Next image"
              >
                <ChevronRight />
              </button>
            </>
          )}

          <Box className="van-detail-lightbox-counter">
            {currentImageIndex + 1} / {allImages.length}
          </Box>
        </Box>
      )}

      {/* Booking Modal */}
      <BookingModal
        open={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        van={van}
      />
    </Box>
  );
};

export default VanDetail;
