// frontend/src/components/Header.jsx
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  useTheme,
  useMediaQuery,
  IconButton,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/NTXlargemainlogotrans.png';
import hamburgerMenu from '../assets/hamburgermenu.png';
import closingX from '../assets/closingx.png';
import '../styles/Header.css';

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Home', path: '/' },
    { text: 'Fleet', path: '/fleet' },
    { text: 'Contact', path: '/contact' },
  ];

  const drawer = (
    <Box className="header-drawer-container">
      {/* Close button in drawer */}
      <Box className="header-close-button-container">
        <IconButton 
          onClick={handleDrawerToggle} 
          className="header-close-button"
          sx={{ 
            color: 'inherit',
            '&:hover': {
              backgroundColor: 'transparent'
            }
          }}
        >
          <img 
            src={closingX} 
            alt="Close menu" 
            className="header-close-icon"
          />
        </IconButton>
      </Box>
      
      {/* Logo in drawer */}
      <Box className="header-drawer-logo-container">
        <img 
          src={logo} 
          alt="NTX Luxury Van Rentals" 
          className="header-logo-drawer"
          onClick={() => {
            navigate('/');
            handleDrawerToggle();
          }}
        />
      </Box>
      
      {/* Menu items */}
      <List className="header-drawer-menu-list">
        {menuItems.map((item) => (
          <ListItem 
            key={item.text} 
            disablePadding
            className="header-drawer-menu-item"
          >
            <ListItemText 
              primary={item.text} 
              onClick={() => {
                navigate(item.path);
                handleDrawerToggle();
              }}
              className="header-drawer-menu-text"
            />
          </ListItem>
        ))}
        <ListItem disablePadding className="header-drawer-book-item">
          <Button
            variant="contained"
            className="header-drawer-book-button"
            onClick={() => {
              navigate('/booking');
              handleDrawerToggle();
            }}
          >
            Book Now
          </Button>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" className="header-appbar">
        <Toolbar className="header-toolbar">
          {/* Logo */}
          <Box
            component={Link}
            to="/"
            className="header-logo-link"
          >
            <img 
              src={logo} 
              alt="NTX Luxury Van Rentals" 
              className="header-logo"
            />
          </Box>

          {/* Desktop Menu */}
          {!isMobile ? (
            <Box className="header-desktop-menu">
              {menuItems.map((item) => (
                <Button
                  key={item.text}
                  component={Link}
                  to={item.path}
                  className="header-menu-button"
                >
                  {item.text}
                </Button>
              ))}
              <Button
                variant="contained"
                component={Link}
                to="/booking"
                className="header-book-button"
              >
                Book Now
              </Button>
            </Box>
          ) : (
            /* Mobile Menu Button */
            <IconButton
              aria-label="open drawer"
              onClick={handleDrawerToggle}
              className="header-mobile-menu-button"
            >
              <img 
                src={hamburgerMenu} 
                alt="Menu" 
                className="header-hamburger-icon"
              />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        className="header-drawer"
        classes={{
          paper: 'header-drawer-paper'
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Header;