// frontend/src/components/VanCard.jsx
import React, { useState, useRef, useEffect } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
} from '@mui/material';
import {
  People,
  CalendarMonth,
  DirectionsCar,
  ChevronLeft,
  ChevronRight,
  VerifiedUser,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import '../styles/VanCard.css';

const VanCard = ({ van, onBookNow }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const thumbnailsRef = useRef(null);
  const navigate = useNavigate();

  // Combine thumbnail with additional images for carousel
  const allImages = [van.thumbnailImage, ...(van.images || [])];

  // Scroll active thumbnail into view
  useEffect(() => {
    if (thumbnailsRef.current) {
      const activeThumb = thumbnailsRef.current.children[currentImageIndex];
      if (activeThumb) {
        activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [currentImageIndex]);

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? allImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === allImages.length - 1 ? 0 : prev + 1
    );
  };

  const handleDotClick = (index, e) => {
    e.stopPropagation();
    setCurrentImageIndex(index);
  };

  return (
    <Card className="van-card">
      {/* Image Carousel */}
      <Box className="van-card-image-container" onClick={() => navigate(`/van/${van._id}`)} style={{ cursor: 'pointer' }}>
        <CardMedia
          component="img"
          image={allImages[currentImageIndex]}
          alt={van.name}
          className="van-card-image"
        />

        {/* Navigation Arrows */}
        {allImages.length > 1 && (
          <>
            <IconButton
              className="van-card-nav-button van-card-nav-prev"
              onClick={handlePrevImage}
            >
              <ChevronLeft />
            </IconButton>
            <IconButton
              className="van-card-nav-button van-card-nav-next"
              onClick={handleNextImage}
            >
              <ChevronRight />
            </IconButton>
          </>
        )}

        {/* Dot Indicators */}
        {allImages.length > 1 && (
          <Box className="van-card-dots">
            {allImages.map((_, index) => (
              <span
                key={index}
                className={`van-card-dot ${index === currentImageIndex ? 'active' : ''}`}
                onClick={(e) => handleDotClick(index, e)}
              />
            ))}
          </Box>
        )}

        {/* Availability Badge */}
        <Chip
          label={van.availability ? "Available" : "Booked"}
          className={`van-card-availability ${van.availability ? 'available' : 'booked'}`}
        />

        {/* Verification Badges — marketplace vans only */}
        {van.owner && (
          <Box className="van-card-verification-badges">
            {van.owner?.ownerProfile?.documents?.safetyInspection?.status === 'approved' && (
              <Box className="van-card-verified-badge">
                <VerifiedUser className="van-card-verified-badge-icon" />
                <span>Safety Inspected</span>
              </Box>
            )}
            {van.owner?.ownerProfile?.documents?.vanRegistration?.status === 'approved' && (
              <Box className="van-card-verified-badge">
                <VerifiedUser className="van-card-verified-badge-icon" />
                <span>Registered</span>
              </Box>
            )}
          </Box>
        )}
      </Box>

      {/* Thumbnail Strip */}
      {allImages.length > 1 && (
        <Box className="van-card-thumbnails" ref={thumbnailsRef}>
          {allImages.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`${van.name} ${index + 1}`}
              className={`van-card-thumbnail ${index === currentImageIndex ? 'active' : ''}`}
              onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(index); }}
            />
          ))}
        </Box>
      )}

      <CardContent className="van-card-content">
        {/* Van Name & Type */}
        <Typography
          variant="h5"
          className="van-card-title van-card-title-link"
          onClick={() => navigate(`/van/${van._id}`)}
        >
          {van.name}
        </Typography>
        <Typography variant="body2" className="van-card-type">
          {van.type}
        </Typography>

        {/* Van Details */}
        <Box className="van-card-details">
          <Box className="van-card-detail-item">
            <People className="van-card-detail-icon" />
            <Typography variant="body2">{van.seating} Passengers</Typography>
          </Box>
          <Box className="van-card-detail-item">
            <CalendarMonth className="van-card-detail-icon" />
            <Typography variant="body2">{van.year}</Typography>
          </Box>
          <Box className="van-card-detail-item">
            <DirectionsCar className="van-card-detail-icon" />
            <Typography variant="body2">{van.type}</Typography>
          </Box>
        </Box>

        {/* Features */}
        {van.features && van.features.length > 0 && (
          <Box className="van-card-features">
            {van.features.slice(0, 3).map((feature, index) => (
              <Chip
                key={index}
                label={feature}
                size="small"
                className="van-card-feature-chip"
              />
            ))}
            {van.features.length > 3 && (
              <Chip
                label={`+${van.features.length - 3} more`}
                size="small"
                className="van-card-feature-chip van-card-feature-more"
              />
            )}
          </Box>
        )}

        {/* View Details Link */}
        <Box
          className="van-card-details-link"
          onClick={() => navigate(`/van/${van._id}`)}
        >
          View Details →
        </Box>

        {/* Pricing */}
        <Box className="van-card-pricing">
          <Box className="van-card-price-main">
            <Typography variant="h4" className="van-card-price">
              ${van.pricing?.dailyRate}
            </Typography>
            <Typography variant="body2" className="van-card-price-label">
              /day
            </Typography>
          </Box>
          <Typography variant="body2" className="van-card-hourly">
            ${van.pricing?.hourlyRate}/hr (min {van.pricing?.minimumHours || 4} hrs)
          </Typography>
        </Box>

        {/* Book Now Button */}
        <Button
          variant="contained"
          fullWidth
          className="van-card-book-button"
          onClick={() => onBookNow(van)}
          disabled={!van.availability}
        >
          {van.availability ? 'Book Now' : 'Not Available'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default VanCard;
