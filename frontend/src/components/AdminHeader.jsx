// frontend/src/components/AdminHeader.jsx
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Box,
  useTheme,
  useMediaQuery,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Close,
  Dashboard,
  People,
  Store,
  DirectionsCar,
  EventNote,
  Payment,
  ArrowBack,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/AdminHeader.css';

const logo = 'https://ntxvanrentals.s3.us-east-2.amazonaws.com/siteimages/NTXlargemainlogotrans.png';

const adminNavItems = [
  { text: 'Dashboard', path: '/admin', icon: <Dashboard /> },
  { text: 'Users', path: '/admin/users', icon: <People /> },
  { text: 'Van Owners', path: '/admin/owners', icon: <Store /> },
  { text: 'Listings', path: '/admin/listings', icon: <DirectionsCar /> },
  { text: 'Bookings', path: '/admin/bookings', icon: <EventNote /> },
  { text: 'Payments', path: '/admin/payments', icon: <Payment /> },
];

const AdminHeader = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  const drawer = (
    <Box className="admin-header-drawer-container">
      <Box className="admin-header-drawer-top">
        <img
          src={logo}
          alt="NTX Luxury Van Rentals"
          className="admin-header-drawer-logo"
          onClick={() => {
            navigate('/admin');
            handleDrawerToggle();
          }}
        />
        <IconButton
          onClick={handleDrawerToggle}
          className="admin-header-close-btn"
          aria-label="Close menu"
        >
          <Close sx={{ color: '#002244', fontSize: 24 }} />
        </IconButton>
      </Box>

      <List className="admin-header-drawer-list">
        {adminNavItems.map((item) => (
          <ListItem
            key={item.text}
            disablePadding
            className={`admin-header-drawer-item ${isActive(item.path) ? 'admin-header-drawer-item-active' : ''}`}
            onClick={() => {
              navigate(item.path);
              handleDrawerToggle();
            }}
          >
            <ListItemIcon className="admin-header-drawer-icon">
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} className="admin-header-drawer-text" />
          </ListItem>
        ))}
      </List>

      <Divider sx={{ borderColor: 'rgba(0,34,68,0.12)', my: 1 }} />

      <List>
        <ListItem
          disablePadding
          className="admin-header-drawer-item"
          onClick={() => {
            navigate('/');
            handleDrawerToggle();
          }}
        >
          <ListItemIcon className="admin-header-drawer-icon">
            <ArrowBack />
          </ListItemIcon>
          <ListItemText primary="Back to Site" className="admin-header-drawer-text" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" className="admin-header-appbar">
        <Toolbar className="admin-header-toolbar">
          {/* Logo */}
          <Box
            component={Link}
            to="/admin"
            className="admin-header-logo-link"
          >
            <img
              src={logo}
              alt="NTX Admin"
              className="admin-header-logo"
            />
          </Box>

          {/* Desktop Nav */}
          {!isMobile ? (
            <Box className="admin-header-desktop-nav">
              {adminNavItems.map((item) => (
                <Button
                  key={item.text}
                  onClick={() => navigate(item.path)}
                  className={`admin-header-nav-btn ${isActive(item.path) ? 'admin-header-nav-btn-active' : ''}`}
                  size="small"
                >
                  {item.text}
                </Button>
              ))}

              <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={() => navigate('/')}
                className="admin-header-back-btn"
                size="small"
              >
                Back to Site
              </Button>
            </Box>
          ) : (
            <IconButton
              aria-label="open admin menu"
              onClick={handleDrawerToggle}
              className="admin-header-mobile-btn"
            >
              <MenuIcon sx={{ color: '#002244', fontSize: 28 }} />
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
        ModalProps={{ keepMounted: true }}
        className="admin-header-drawer"
        classes={{ paper: 'admin-header-drawer-paper' }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default AdminHeader;
