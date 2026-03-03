// frontend/src/pages/Booking.jsx
import React, { useState, useEffect } from 'react';
import { Container, Typography, Box } from '@mui/material';
import axios from 'axios';
import VanGrid from '../components/VanGrid';
import BookingModal from '../components/BookingModal';
import '../styles/Booking.css';

// S3 image base URL for Kirk Johnson van photos
const kirkImg = (n) => `https://ntxvanrentals.s3.us-east-2.amazonaws.com/kirkjohnsonX4%20/Capture${n}.JPG`;

// Real fleet data
const mockVans = [
  {
    _id: '1',
    name: 'American Coach Patriot',
    type: 'Sprinter',
    year: 2019,
    seating: 6,
    description: '2019 Mercedes Benz Sprinter 3500 — RV-style luxury coach with full living amenities including kitchen, bathroom, and entertainment system.',
    features: [
      'Overhead Cabinets', 'HD LED TV', 'Rear Lounge Couch', 'Jack Knife Couches',
      'Swiveling Captains Chairs', 'Microwave', 'Fridge', 'Cooktop & Pantry',
      'Shower & Toilet', 'Wireless Internet & Apple TV', 'Air Ride Suspension',
      'Hot Water Heater', 'Heat & Massage Captains Chairs', 'Wardrobe Closet',
      'Window Shades', 'Upgraded Flooring',
    ],
    thumbnailImage: kirkImg(1),
    images: [kirkImg(1), kirkImg(2), kirkImg(3)],
    pricing: {
      hourlyRate: 69,
      dailyRate: 549,
      weeklyRate: 2745,
      deposit: 750,
      insuranceFee: 100,
      destinationFee: 50,
      minimumHours: 4,
    },
    availability: true,
  },
  {
    _id: '2',
    name: 'Executive Custom Build',
    type: 'Sprinter',
    year: 2022,
    seating: 10,
    description: '2022 Mercedes Benz Sprinter custom executive build with dual entertainment screens and convertible sleeping configuration.',
    features: [
      '2 Jack Knife Couches (fold to bed)', '4 Swivel Captains', '2 Front Swivel Captains',
      '32" + 50" Smart TVs', 'Surround Sound', 'Ambient Lighting',
      'Fiberglass Running Boards & Body Kit', 'Starlink WiFi',
      'Tray Tables', 'Removable Mounted Tables',
    ],
    thumbnailImage: kirkImg(4),
    images: [kirkImg(4), kirkImg(5), kirkImg(6)],
    pricing: {
      hourlyRate: 59,
      dailyRate: 469,
      weeklyRate: 2345,
      deposit: 500,
      insuranceFee: 75,
      destinationFee: 50,
      minimumHours: 4,
    },
    availability: true,
  },
  {
    _id: '3',
    name: 'Legends Executive',
    type: 'Sprinter',
    year: 2024,
    seating: 12,
    description: 'Mercedes Benz Sprinter with AWD, 360 camera, and seating for 12 — built for executive group travel with premium driver-assist technology.',
    features: [
      '4 Swiveling Captains Chairs', '2 Power Recline Captains', '2 Smart TVs 4K',
      '2 Jack Knife Couches', 'AWD', 'Power Running Boards', 'Starlink WiFi',
      '360 Cam', 'Driver Assist', 'Blind Spot', 'Apple Car Play', 'Power Door',
      'Wolf Rear View Camera', 'Pull Out Dometic Coolers', 'Storage for 15 Large Suitcases',
    ],
    thumbnailImage: kirkImg(7),
    images: [kirkImg(7), kirkImg(8), kirkImg(9)],
    pricing: {
      hourlyRate: 62,
      dailyRate: 497,
      weeklyRate: 2485,
      deposit: 500,
      insuranceFee: 75,
      destinationFee: 50,
      minimumHours: 4,
    },
    availability: true,
  },
  {
    _id: '4',
    name: 'Legends All Terrain Executive',
    type: 'Sprinter',
    year: 2025,
    seating: 10,
    description: '2025 Mercedes Benz Sprinter AWD — brand new with only 15 total miles. Starlight headliner, off-road wheels, and full towing capability.',
    features: [
      'Starlight Headliner', 'Power Captains with Power Recline',
      '32" + 43" Smart TVs 4K', 'Black Rhino Wheels', 'Kicker Surround Sound',
      'Starlink WiFi', 'AWD', 'Roof Rack', 'Ladder Rack', 'Rear Tire Holder',
      'Tow Hitch & HD Towing', 'Ambient Lighting', 'Heated Front Seating',
      'Privacy Shades', 'USB Ports Throughout', 'Rear HVAC', 'Apple Car Play',
    ],
    thumbnailImage: kirkImg(10),
    images: [kirkImg(10), kirkImg(11), kirkImg(12)],
    pricing: {
      hourlyRate: 59,
      dailyRate: 469,
      weeklyRate: 2345,
      deposit: 500,
      insuranceFee: 75,
      destinationFee: 50,
      minimumHours: 4,
    },
    availability: true,
  },
  {
    _id: '5',
    name: 'Executive Shuttle',
    type: 'Sprinter',
    year: 2020,
    seating: 15,
    description: 'Mercedes Benz Sprinter 15-passenger shuttle — professional shuttle configuration ideal for group transport. x4 units available.',
    features: [
      '15-Passenger Capacity', 'Professional Shuttle Configuration',
      'Climate Control', 'Comfortable Seating',
    ],
    thumbnailImage: kirkImg(13),
    images: [kirkImg(13), kirkImg(14), kirkImg(15)],
    pricing: {
      hourlyRate: 52,
      dailyRate: 419,
      weeklyRate: 2095,
      deposit: 500,
      insuranceFee: 75,
      destinationFee: 50,
      minimumHours: 4,
    },
    availability: true,
  },
  {
    _id: '6',
    name: 'Executive Sprinter Shuttle (Remodeled)',
    type: 'Sprinter',
    year: 2020,
    seating: 15,
    description: 'Mercedes Benz Sprinter 15-passenger remodeled shuttle with diamond-stitched seating, premium wood flooring, and entertainment system. x4 units available.',
    features: [
      'Diamond-Stitched Executive Seating', 'Premium Wood Flooring',
      'Ambient LED Lighting', 'Surround Sound', '24" Entertainment Screen',
      'USB Charging Throughout', 'AMG-Style Grille', 'Upgraded LED Lighting',
      'Premium Running Boards', 'Wolfbox Backup Camera',
    ],
    thumbnailImage: kirkImg(16),
    images: [kirkImg(16), kirkImg(17), kirkImg(18)],
    pricing: {
      hourlyRate: 52,
      dailyRate: 419,
      weeklyRate: 2095,
      deposit: 500,
      insuranceFee: 75,
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
