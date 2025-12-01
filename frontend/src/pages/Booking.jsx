// frontend/src/pages/Booking.jsx
import React, { useState, useEffect } from 'react';
import { Container, Typography, Box } from '@mui/material';
import axios from 'axios';
import VanGrid from '../components/VanGrid';
import BookingModal from '../components/BookingModal';
import '../styles/Booking.css';

// Import van images
import sprintervan1 from '../assets/vans/sprintervan1.png';
import sprintervanhotel1 from '../assets/vans/sprintervanhotel1.png';
import mbExecutiveSprinter from '../assets/vans/MB-Executive-Sprinter-Van.jpg';
import mercedesvan2 from '../assets/vans/mercedesvan2.webp';
import mercedesvanv1 from '../assets/vans/mercedesvanv1.jpg';
import vaninterior1 from '../assets/vans/vaninterior1.png';
import vaninteriorsideview1 from '../assets/vans/vaninteriorsideview1.png';

// Temporary mock data until API is connected
const mockVans = [
  {
    _id: '1',
    name: 'Mercedes Sprinter Luxury',
    type: 'Sprinter',
    year: 2024,
    seating: 14,
    description: 'Our flagship luxury Sprinter van with premium amenities.',
    features: ['Leather Seats', 'WiFi', 'TV Screens', 'USB Charging', 'Climate Control', 'Tinted Windows'],
    thumbnailImage: sprintervan1,
    images: [vaninterior1, vaninteriorsideview1, sprintervanhotel1],
    pricing: {
      hourlyRate: 75,
      dailyRate: 450,
      weeklyRate: 2500,
      deposit: 500,
      insuranceFee: 75,
      destinationFee: 50,
      minimumHours: 4,
    },
    availability: true,
  },
  {
    _id: '2',
    name: 'Executive Sprinter',
    type: 'Sprinter',
    year: 2023,
    seating: 12,
    description: 'Executive class Sprinter perfect for corporate events.',
    features: ['Executive Seating', 'Conference Setup', 'WiFi', 'Privacy Partition'],
    thumbnailImage: mbExecutiveSprinter,
    images: [mercedesvanv1, mercedesvan2],
    pricing: {
      hourlyRate: 65,
      dailyRate: 400,
      weeklyRate: 2200,
      deposit: 500,
      insuranceFee: 75,
      destinationFee: 50,
      minimumHours: 4,
    },
    availability: true,
  },
  {
    _id: '3',
    name: 'Party Sprinter',
    type: 'Sprinter',
    year: 2024,
    seating: 10,
    description: 'Party-ready Sprinter with premium sound system and lighting.',
    features: ['Sound System', 'LED Lighting', 'Cooler', 'USB Charging'],
    thumbnailImage: sprintervanhotel1,
    images: [vaninterior1, sprintervan1],
    pricing: {
      hourlyRate: 85,
      dailyRate: 500,
      weeklyRate: 2800,
      deposit: 750,
      insuranceFee: 100,
      destinationFee: 50,
      minimumHours: 4,
    },
    availability: true,
  },
];

const Booking = () => {
  const [vans, setVans] = useState([]);
  const [loading, setLoading] = useState(true);
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
      setVans(response.data);
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
