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
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import { Close, KeyboardArrowDown, Person } from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
const logo = 'https://ntxvanrentals.s3.us-east-2.amazonaws.com/siteimages/NTXlargemainlogotrans.png';
const hamburgerMenu = 'https://ntxvanrentals.s3.us-east-2.amazonaws.com/siteimages/hamburgermenu.png';
import '../styles/Header.css';

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleUserMenuClose();
    setMobileOpen(false);
    navigate('/');
  };

  const menuItems = [
    { text: 'Home', path: '/' },
    { text: 'Fleet', path: '/booking' },
    { text: 'Contact', path: '/contact' },
  ];

  const drawer = (
    <Box className="header-drawer-container">
      {/* Close button in drawer */}
      <Box className="header-close-button-container">
        <IconButton
          onClick={handleDrawerToggle}
          className="header-close-button"
          aria-label="Close menu"
        >
          <Close sx={{ color: '#002244', fontSize: 28 }} />
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
            className={`header-drawer-menu-item ${location.pathname === item.path ? 'header-drawer-menu-item-active' : ''}`}
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

        {/* Auth items in mobile drawer */}
        {user ? (
          <>
            <Divider sx={{ my: 1 }} />
            <ListItem
              disablePadding
              className={`header-drawer-menu-item ${location.pathname === '/dashboard' ? 'header-drawer-menu-item-active' : ''}`}
            >
              <ListItemText
                primary="Dashboard"
                onClick={() => {
                  navigate('/dashboard');
                  handleDrawerToggle();
                }}
                className="header-drawer-menu-text"
              />
            </ListItem>
            {(user.role === 'owner' || user.role === 'admin') && (
              <ListItem
                disablePadding
                className={`header-drawer-menu-item ${location.pathname === '/owner/listings' ? 'header-drawer-menu-item-active' : ''}`}
              >
                <ListItemText
                  primary="My Listings"
                  onClick={() => {
                    navigate('/owner/listings');
                    handleDrawerToggle();
                  }}
                  className="header-drawer-menu-text"
                />
              </ListItem>
            )}
            <ListItem disablePadding className="header-drawer-menu-item">
              <ListItemText
                primary="Logout"
                onClick={handleLogout}
                className="header-drawer-menu-text"
              />
            </ListItem>
          </>
        ) : (
          <ListItem disablePadding className="header-drawer-menu-item">
            <ListItemText
              primary="Login"
              onClick={() => {
                navigate('/login');
                handleDrawerToggle();
              }}
              className="header-drawer-menu-text"
            />
          </ListItem>
        )}

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

              {/* Auth: Login or User Dropdown */}
              {user ? (
                <>
                  <Button
                    onClick={handleUserMenuOpen}
                    className="header-user-menu-btn"
                    endIcon={<KeyboardArrowDown />}
                    startIcon={<Person />}
                  >
                    {user.firstName}
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleUserMenuClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    classes={{ paper: 'header-user-dropdown' }}
                  >
                    <MenuItem onClick={() => { navigate('/dashboard'); handleUserMenuClose(); }}>
                      Dashboard
                    </MenuItem>
                    {(user.role === 'owner' || user.role === 'admin') && (
                      <MenuItem onClick={() => { navigate('/owner/listings'); handleUserMenuClose(); }}>
                        My Listings
                      </MenuItem>
                    )}
                    <Divider />
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                <Button
                  component={Link}
                  to="/login"
                  className="header-login-button"
                >
                  Login
                </Button>
              )}

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
