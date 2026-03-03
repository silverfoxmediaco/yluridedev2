// frontend/src/pages/admin/AdminPayments.jsx
import React from 'react';
import { Container, Typography, Box, Paper, Button } from '@mui/material';
import { ArrowBack, Payment, Construction } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AdminPayments = () => {
  const navigate = useNavigate();

  return (
    <div style={{ background: '#f5f7fa', minHeight: '80vh', padding: '40px 0' }}>
      <Container maxWidth="lg">
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/admin')}
          sx={{
            color: '#002244',
            textTransform: 'none',
            fontWeight: 500,
            mb: 2,
            minHeight: 44,
          }}
        >
          Admin Dashboard
        </Button>

        <Typography variant="h3" sx={{ color: '#002244', fontWeight: 700, fontSize: '2rem', mb: 3 }}>
          Payments
        </Typography>

        <Paper sx={{ p: 6, borderRadius: 3, textAlign: 'center' }}>
          <Construction sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
          <Typography variant="h5" sx={{ color: '#002244', fontWeight: 600, mb: 1 }}>
            Coming Soon
          </Typography>
          <Typography sx={{ color: '#888', mb: 3 }}>
            Payment management features are currently under development. Check back soon.
          </Typography>
          <Button
            variant="contained"
            startIcon={<Payment />}
            onClick={() => navigate('/admin')}
            sx={{
              backgroundColor: '#002244',
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 2,
              minHeight: 44,
              '&:hover': { backgroundColor: '#003366' },
            }}
          >
            Back to Dashboard
          </Button>
        </Paper>
      </Container>
    </div>
  );
};

export default AdminPayments;
