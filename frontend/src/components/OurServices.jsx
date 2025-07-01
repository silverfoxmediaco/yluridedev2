// frontend/src/components/OurServices.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Container, Grid, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  FlightTakeoff,
  BusinessCenter,
  Celebration,
  LocationCity,
  Groups,
  EmojiEvents,
  DirectionsCar,
  AccessTime,
} from '@mui/icons-material';
import '../styles/OurServices.css';

const OurServices = () => {
  const navigate = useNavigate();
  const [visibleCards, setVisibleCards] = useState([]);
  const observerRef = useRef(null);
  const sectionRef = useRef(null);

  const services = [
    {
      icon: <FlightTakeoff />,
      title: 'Airport Luxury Transfers',
      shortDesc: 'First-class airport transportation',
      description: 'Skip the stress of airport parking and ride-shares. Our professional chauffeurs provide punctual, door-to-door service with flight tracking and complimentary wait time. Experience seamless transfers to DFW, Love Field, and private terminals.',
      features: ['Flight Tracking', 'Meet & Greet Service', '60 Min Free Wait Time', 'Luggage Assistance'],
      popular: true,
    },
    {
      icon: <BusinessCenter />,
      title: 'Corporate Transportation',
      shortDesc: 'Impress clients with executive travel',
      description: 'Elevate your business image with our corporate transportation solutions. Perfect for client meetings, team events, and executive travel. Our Mercedes vans offer mobile workspace amenities and professional presentation.',
      features: ['WiFi Equipped', 'Privacy Screens', 'Corporate Accounts', 'Flexible Billing'],
      popular: false,
    },
    {
      icon: <Celebration />,
      title: 'Wedding & Special Events',
      shortDesc: 'Make your special day unforgettable',
      description: 'Create magical moments with our luxury wedding transportation. From bridal parties to guest shuttles, we ensure everyone arrives in style and comfort. Our vans are decorated to match your theme.',
      features: ['Custom Decoration', 'Red Carpet Service', 'Champagne Ready', 'Photo Opportunities'],
      popular: true,
    },
    {
      icon: <LocationCity />,
      title: 'City Tours & Sightseeing',
      shortDesc: 'Explore in luxury and comfort',
      description: 'Discover Dallas and beyond with our guided city tours. Our knowledgeable chauffeurs provide insider recommendations while you enjoy panoramic views from our luxury Mercedes vans.',
      features: ['Local Guides', 'Custom Routes', 'Photo Stops', 'Refreshments Included'],
      popular: false,
    },
    {
      icon: <Groups />,
      title: 'Group Transportation',
      shortDesc: 'Keep your group together in style',
      description: 'Whether it\'s a family reunion, sports team, or company outing, our spacious Mercedes vans accommodate groups up to 14 passengers without compromising on luxury or comfort.',
      features: ['Spacious Seating', 'Entertainment Systems', 'Climate Control', 'Ample Luggage Space'],
      popular: true,
    },
    {
      icon: <EmojiEvents />,
      title: 'VIP & Celebrity Transport',
      shortDesc: 'Discrete luxury for high-profile clients',
      description: 'Our VIP service offers maximum privacy and security for celebrities, executives, and dignitaries. Experience white-glove service with our most exclusive vehicles and trained security drivers.',
      features: ['Privacy Glass', 'Security Trained', 'NDA Compliance', 'Exclusive Routes'],
      popular: false,
    },
  ];

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.dataset.index);
          setVisibleCards(prev => [...new Set([...prev, index])]);
        }
      });
    }, observerOptions);

    observerRef.current = observer;

    const cards = document.querySelectorAll('.os-card');
    cards.forEach(card => observer.observe(card));

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <section className="our-services-section" ref={sectionRef}>
      <Container maxWidth="lg">
        {/* Section Header */}
        <Box className="os-header">
          <Typography variant="overline" className="os-overline">
            OUR PREMIUM SERVICES
          </Typography>
          <Typography variant="h2" component="h2" className="os-main-title">
            Luxury Transportation Solutions
          </Typography>
          <Typography variant="h5" className="os-subtitle">
            Tailored experiences for every journey in our Mercedes-Benz fleet
          </Typography>
        </Box>

        {/* Services Grid */}
        <Grid container spacing={4} className="os-grid">
          {services.map((service, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Box
                className={`os-card ${visibleCards.includes(index) ? 'os-visible' : ''} ${service.popular ? 'os-popular' : ''}`}
                data-index={index}
              >
                {service.popular && (
                  <div className="os-popular-badge">
                    <span>Most Popular</span>
                  </div>
                )}
                
                <div className="os-icon-wrapper">
                  <div className="os-icon">
                    {service.icon}
                  </div>
                  <div className="os-icon-background"></div>
                </div>

                <Typography variant="h5" className="os-title">
                  {service.title}
                </Typography>

                <Typography variant="body2" className="os-short-desc">
                  {service.shortDesc}
                </Typography>

                <Typography variant="body1" className="os-description">
                  {service.description}
                </Typography>

                <Box className="os-features">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="os-feature-item">
                      <span className="os-feature-dot"></span>
                      <Typography variant="body2">{feature}</Typography>
                    </div>
                  ))}
                </Box>

                <Button
                  className="os-cta"
                  variant="outlined"
                  onClick={() => navigate('/booking')}
                >
                  Book This Service
                </Button>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Bottom CTA */}
        <Box className="os-bottom-cta">
          <Box className="os-cta-content">
            <DirectionsCar className="os-cta-icon" />
            <Typography variant="h4" className="os-cta-title">
              Need a Custom Solution?
            </Typography>
            <Typography variant="body1" className="os-cta-text">
              We specialize in creating bespoke transportation experiences tailored to your unique requirements
            </Typography>
            <Box className="os-cta-buttons">
              <Button
                variant="contained"
                className="os-cta-button-primary"
                onClick={() => navigate('/contact')}
              >
                Discuss Your Needs
              </Button>
              <Button
                variant="text"
                className="os-cta-button-secondary"
                startIcon={<AccessTime />}
              >
                Available 24/7
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </section>
  );
};

export default OurServices;