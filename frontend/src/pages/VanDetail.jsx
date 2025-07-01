// frontend/src/pages/VanDetail.jsx
import React from 'react';
import { Container, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

const VanDetail = () => {
  const { id } = useParams();
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h2">Van Details</Typography>
      <Typography>Details for van ID: {id}</Typography>
    </Container>
  );
};

export default VanDetail;