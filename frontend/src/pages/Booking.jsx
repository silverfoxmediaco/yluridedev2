// frontend/src/pages/Booking.jsx
import React, { useState, useEffect } from 'react';
import { Container, Typography, Box } from '@mui/material';
import axios from 'axios';
import VanGrid from '../components/VanGrid';
import BookingModal from '../components/BookingModal';
import mockVans from '../data/vanData';
import '../styles/Booking.css';

const Booking = () => {
  const [vans, setVans] = useState(mockVans);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedVan, setSelectedVan] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  useEffect(() => {
    fetchVans();
  }, []);

  const fetchVans = async () => {
    try {
      setLoading(true);
      // Try to fetch from API
      const response = await axios.get('/api/vans');
      // If API returns empty array, use mock data
      if (response.data && response.data.length > 0) {
        setVans(response.data);
      } else {
        console.log('No vans in database, using mock data');
        setVans(mockVans);
      }
      setError('');
    } catch (err) {
      console.log('API not available, using mock data');
      // Use mock data if API is not available
      setVans(mockVans);
      setError('');
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (van) => {
    setSelectedVan(van);
    setBookingModalOpen(true);
  };

  const handleCloseModal = () => {
    setBookingModalOpen(false);
    setSelectedVan(null);
  };

  return (
    <Box className="booking-page">
      {/* Hero Section */}
      <Box className="booking-hero">
        <Container maxWidth="lg">
          <Typography variant="h2" className="booking-hero-title">
            Book Your Luxury Van
          </Typography>
          <Typography variant="h6" className="booking-hero-subtitle">
            Choose from our premium fleet of Mercedes Sprinter vans
          </Typography>
        </Container>
      </Box>

      {/* Van Grid Section */}
      <Container maxWidth="lg" className="booking-container">
        <Box className="booking-intro">
          <Typography variant="h4" className="booking-section-title">
            Our Fleet
          </Typography>
          <Typography variant="body1" className="booking-section-description">
            Select a van to view availability and book your rental. All vehicles include
            professional chauffeur service and are fully equipped for your comfort.
          </Typography>
        </Box>

        <VanGrid
          vans={vans}
          loading={loading}
          error={error}
          onBookNow={handleBookNow}
        />
      </Container>

      {/* Booking Modal */}
      <BookingModal
        open={bookingModalOpen}
        onClose={handleCloseModal}
        van={selectedVan}
      />
    </Box>
  );
};

export default Booking;
