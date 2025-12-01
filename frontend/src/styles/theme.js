// frontend/src/styles/theme.js
import { createTheme } from '@mui/material/styles';

/*
 * NTX Luxury Van Rentals - Brand Color Guide
 * ==========================================
 *
 * Primary Brand Colors:
 * - Navy Blue: #002244 | RGB(0, 34, 68) | HSL(210°, 100%, 13%)
 * - Orange:    #FB4F14 | RGB(251, 79, 20) | HSL(14°, 96%, 53%)
 *
 * Supporting Colors:
 * - White:     #FFFFFF
 * - Silver:    #C0C0C0
 * - Black:     #000000
 */

const theme = createTheme({
  palette: {
    primary: {
      main: '#002244', // Navy Blue (Brand Primary)
      light: '#003366',
      dark: '#001a33',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FB4F14', // Orange (Brand Accent)
      light: '#fc7243',
      dark: '#c93e10',
      contrastText: '#FFFFFF',
    },
    brand: {
      navy: '#002244',
      orange: '#FB4F14',
      white: '#FFFFFF',
      silver: '#C0C0C0',
      black: '#000000',
    },
    background: {
      default: '#FFFFFF', // White
      paper: '#F5F5F5', // Light Gray
    },
    text: {
      primary: '#000000', // Black
      secondary: '#666666', // Medium Gray
    },
    grey: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '3rem',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2.5rem',
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.4,
    },
    h4: {
      fontWeight: 500,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.25rem',
      lineHeight: 1.5,
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 500,
      textTransform: 'none',
      letterSpacing: '0.02em',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          fontSize: '1rem',
        },
        containedPrimary: {
          backgroundColor: '#002244', // Navy Blue
          '&:hover': {
            backgroundColor: '#003366',
          },
        },
        containedSecondary: {
          backgroundColor: '#FB4F14', // Orange
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#c93e10',
            color: '#FFFFFF',
          },
        },
        outlinedPrimary: {
          borderColor: '#002244',
          color: '#002244',
          '&:hover': {
            borderColor: '#002244',
            backgroundColor: 'rgba(0, 34, 68, 0.04)',
          },
        },
        outlinedSecondary: {
          borderColor: '#FB4F14',
          color: '#FB4F14',
          '&:hover': {
            borderColor: '#c93e10',
            backgroundColor: 'rgba(251, 79, 20, 0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          },
        },
      },
    },
  },
});

export default theme;