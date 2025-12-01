// frontend/src/components/VanGrid.jsx
import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import VanCard from './VanCard';
import '../styles/VanGrid.css';

const VanGrid = ({ vans, loading, error, onBookNow }) => {
  if (loading) {
    return (
      <Box className="van-grid-loading">
        <CircularProgress sx={{ color: '#002244' }} />
        <Typography>Loading our fleet...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="van-grid-error">
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  if (!vans || vans.length === 0) {
    return (
      <Box className="van-grid-empty">
        <Typography variant="h6">
          No vans available at the moment.
        </Typography>
        <Typography variant="body2">
          Please check back later or contact us for availability.
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="van-grid-container">
      <Box className="van-grid">
        {vans.map((van) => (
          <VanCard key={van._id} van={van} onBookNow={onBookNow} />
        ))}
      </Box>
    </Box>
  );
};

export default VanGrid;
