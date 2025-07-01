// frontend/src/components/Footer.jsx
import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Divider,
} from '@mui/material';
import { Link } from 'react-router-dom';
import {
  Facebook,
  Instagram,
  Twitter,
  LinkedIn,
  Phone,
  Email,
  LocationOn,
} from '@mui/icons-material';
import logo from '../assets/yluridelogo.png';
import '../styles/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { text: 'Our Fleet', path: '/fleet' },
    { text: 'Book a Van', path: '/booking' },
    { text: 'About Us', path: '/about' },
    { text: 'Contact', path: '/contact' },
  ];

  const socialLinks = [
    { icon: <Facebook />, label: 'Facebook', url: 'https://facebook.com' },
    { icon: <Instagram />, label: 'Instagram', url: 'https://instagram.com' },
    { icon: <Twitter />, label: 'Twitter', url: 'https://twitter.com' },
    { icon: <LinkedIn />, label: 'LinkedIn', url: 'https://linkedin.com' },
  ];

  return (
    <Box component="footer" className="footer-main">
      <Container maxWidth="lg" className="footer-container">
        <Grid container spacing={{ xs: 3, md: 4 }} className="footer-grid">
          {/* Company Info Section */}
          <Grid item xs={12} md={4} className="footer-column">
            <Box className="footer-company-section">
              <img 
                src={logo} 
                alt="YLURIDE" 
                className="footer-logo"
              />
              <Typography variant="body2" className="footer-tagline">
                Experience luxury travel with our premium Mercedes van rental service.
              </Typography>
              <Box className="footer-social">
                {socialLinks.map((social) => (
                  <IconButton
                    key={social.label}
                    className="footer-social-btn"
                    aria-label={social.label}
                    component="a"
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Quick Links Section */}
          <Grid item xs={12} sm={6} md={4} className="footer-column">
            <Box className="footer-links-section">
              <Typography variant="h6" className="footer-heading">
                Quick Links
              </Typography>
              <Box className="footer-links-list">
                {quickLinks.map((link) => (
                  <Link
                    key={link.text}
                    to={link.path}
                    className="footer-link"
                  >
                    {link.text}
                  </Link>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Contact Info Section */}
          <Grid item xs={12} sm={6} md={4} className="footer-column">
            <Box className="footer-contact-section">
              <Typography variant="h6" className="footer-heading">
                Contact Info
              </Typography>
              <Box className="footer-contact-list">
                <Box className="footer-contact-item">
                  <Phone className="footer-icon" />
                  <Typography variant="body2">+1 (555) 123-4567</Typography>
                </Box>
                <Box className="footer-contact-item">
                  <Email className="footer-icon" />
                  <Typography variant="body2">info@yluride.com</Typography>
                </Box>
                <Box className="footer-contact-item">
                  <LocationOn className="footer-icon" />
                  <Box>
                    <Typography variant="body2">123 Luxury Lane</Typography>
                    <Typography variant="body2">Dallas, TX 75201</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider className="footer-divider" />

        {/* Copyright Section */}
        <Box className="footer-bottom">
          <Typography variant="body2" className="footer-copyright">
            © {currentYear} YLU Ride. All rights reserved.
          </Typography>
          <Box className="footer-legal">
            <Link to="/privacy" className="footer-legal-link">
              Privacy Policy
            </Link>
            <span className="footer-separator">|</span>
            <Link to="/terms" className="footer-legal-link">
              Terms of Service
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;