// frontend/src/components/Hero.jsx
import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import vanBackground from '../assets/mercedesvanv1.jpg';
import vanBackgroundMobile from '../assets/blackmvanmobi.webp';
import '../styles/Hero.css';

const Hero = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Check on mount
    checkMobile();

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const handleBookNow = () => {
    navigate('/booking');
  };

  return (
    <Box className="hero-container">
      {/* Parallax Background */}
      <div 
        className="hero-background"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
          backgroundImage: `url(${isMobile ? vanBackgroundMobile : vanBackground})`,
        }}
      />
      
      {/* Dark Overlay */}
      <div className="hero-overlay" />
      
      {/* Content */}
      <Container maxWidth="lg" className="hero-content">
        <Box className="hero-text-container">
          <Typography 
            variant="h1" 
            component="h1" 
            className="hero-title"
          >
            Elevate Your Journey
            <span className="hero-subtitle">Experience Luxury on Every Mile</span>
          </Typography>
          
          <Typography 
            variant="h5" 
            className="hero-description"
          >
            Premium Mercedes vans. Unforgettable experiences. Your adventure starts here.
          </Typography>
          
          <Button
            variant="contained"
            size="large"
            className="hero-cta-button"
            onClick={handleBookNow}
          >
            Book Your Luxury Ride
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Hero;