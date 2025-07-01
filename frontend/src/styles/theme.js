// frontend/src/styles/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#000000', // Black
      light: '#2C2C2C', // Dark Gray
      dark: '#000000',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#C0C0C0', // Silver
      light: '#E0E0E0', // Light Silver
      dark: '#808080', // Dark Silver
      contrastText: '#000000',
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
          backgroundColor: '#000000',
          '&:hover': {
            backgroundColor: '#2C2C2C',
          },
        },
        containedSecondary: {
          backgroundColor: '#C0C0C0',
          color: '#000000',
          '&:hover': {
            backgroundColor: '#808080',
            color: '#FFFFFF',
          },
        },
        outlinedPrimary: {
          borderColor: '#000000',
          color: '#000000',
          '&:hover': {
            borderColor: '#000000',
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        },
        outlinedSecondary: {
          borderColor: '#C0C0C0',
          color: '#666666',
          '&:hover': {
            borderColor: '#808080',
            backgroundColor: 'rgba(192, 192, 192, 0.1)',
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