// frontend/src/pages/Home.jsx
import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
} from '@mui/material';
import {
  LocalShipping,
  Stars,
  AccessTime,
  Security,
  CheckCircle,
  Groups,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import OurServices from '../components/OurServices';
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <LocalShipping fontSize="large" />,
      title: 'Premium Fleet',
      description: 'Luxury Mercedes vans with premium amenities and comfort',
    },
    {
      icon: <Stars fontSize="large" />,
      title: 'VIP Experience',
      description: 'First-class service from booking to return',
    },
    {
      icon: <AccessTime fontSize="large" />,
      title: '24/7 Availability',
      description: 'Book anytime, travel anywhere on your schedule',
    },
    {
      icon: <Security fontSize="large" />,
      title: 'Safe & Secure',
      description: 'Fully insured and professionally maintained vehicles',
    },
  ];

  const services = [
    'Airport Transfers',
    'Corporate Events',
    'Wedding Transportation',
    'City Tours',
    'Group Outings',
    'Special Occasions',
  ];

  const stats = [
    { number: '500+', label: 'Happy Customers' },
    { number: '50+', label: 'Luxury Vans' },
    { number: '24/7', label: 'Support' },
    { number: '5★', label: 'Rating' },
  ];

  return (
    <div className="home-page">
      {/* Hero Section - Component */}
      <Hero />

      {/* Our Services Section - Component */}
      <OurServices />

      {/* Features Section */}
      <section className="features-section">
        <Container maxWidth="lg">
          <div className="section-header">
            <Typography variant="h2" className="section-title">
              Why Choose YLU Ride
            </Typography>
            <Typography variant="body1" className="section-subtitle">
              Premium service, exceptional vehicles, unforgettable experiences
            </Typography>
          </div>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card className="feature-card">
                  <CardContent>
                    <Box className="feature-icon">
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" className="feature-title">
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" className="feature-description">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center" justifyContent="center">
            <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h3" className="services-title">
                Luxury Transportation for Every Occasion
              </Typography>
              <Typography variant="body1" className="services-description">
                Whether you're planning a special event, need airport transportation, 
                or want to explore the city in style, our premium Mercedes vans 
                provide the perfect solution.
              </Typography>
              
              <div className="services-list">
                {services.map((service, index) => (
                  <div key={index} className="service-item">
                    <CheckCircle className="service-icon" />
                    <Typography variant="body1">{service}</Typography>
                  </div>
                ))}
              </div>
              
              <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                <Button
                  variant="contained"
                  size="large"
                  className="services-cta"
                  onClick={() => navigate('/fleet')}
                >
                  Explore Our Fleet
                </Button>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div className="services-image-container">
                <div className="image-placeholder">
                  {/* You can add an image here later */}
                  <Groups sx={{ fontSize: 100, color: '#C0C0C0' }} />
                </div>
              </div>
            </Grid>
          </Grid>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center" alignItems="center">
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <div className="stat-card">
                  <Typography variant="h3" className="stat-number">
                    {stat.number}
                  </Typography>
                  <Typography variant="body1" className="stat-label">
                    {stat.label}
                  </Typography>
                </div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <Container maxWidth="md">
          <div className="cta-content">
            <Typography variant="h3" className="cta-title">
              Ready to Experience Luxury?
            </Typography>
            <Typography variant="body1" className="cta-description">
              Book your premium Mercedes van today and travel in style
            </Typography>
            <div className="cta-buttons">
              <Button
                variant="contained"
                size="large"
                className="cta-primary"
                onClick={() => navigate('/booking')}
              >
                Reserve Your Van
              </Button>
              <Button
                variant="outlined"
                size="large"
                className="cta-secondary"
                onClick={() => navigate('/contact')}
              >
                Contact Us
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Home;