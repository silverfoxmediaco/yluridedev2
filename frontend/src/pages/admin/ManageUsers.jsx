// frontend/src/pages/admin/ManageUsers.jsx
import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Paper, Button, Chip, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import {
  ArrowBack, MoreVert, VerifiedUser, Block, PersonOff, CheckCircle
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import '../../styles/ManageUsers.css';

const roleChipConfig = {
  customer: { label: 'Customer', bg: 'rgba(46, 125, 50, 0.1)', color: '#2e7d32' },
  owner: { label: 'Owner', bg: 'rgba(251, 79, 20, 0.1)', color: '#FB4F14' },
  admin: { label: 'Admin', bg: 'rgba(0, 34, 68, 0.1)', color: '#002244' },
};

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [verifyDialog, setVerifyDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const query = filter === 'all' ? '' : `?role=${filter}`;
      const { data } = await api.get(`/admin/users${query}`);
      setUsers(data);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event, user) => {
    setMenuAnchor(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedUser(null);
  };

  const handleToggleActive = async (userId, currentlyActive) => {
    handleMenuClose();
    try {
      await api.put(`/admin/users/${userId}`, { isActive: !currentlyActive });
      toast.success(`User ${currentlyActive ? 'deactivated' : 'activated'}`);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user');
    }
  };

  const handleVerifyOwner = async () => {
    try {
      await api.put(`/admin/users/${selectedUser._id}/verify-owner`, {
        isVerified: true,
        documents: {
          governmentId: 'approved',
          vanRegistration: 'approved',
          safetyInspection: 'approved',
          proofOfInsurance: 'approved'
        }
      });
      toast.success('Owner verified successfully');
      setVerifyDialog(false);
      handleMenuClose();
      fetchUsers();
    } catch (error) {
      toast.error('Failed to verify owner');
    }
  };

  const handleUnverifyOwner = async (userId) => {
    handleMenuClose();
    try {
      await api.put(`/admin/users/${userId}/verify-owner`, { isVerified: false });
      toast.success('Owner verification removed');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update owner');
    }
  };

  const filterTabs = [
    { key: 'all', label: 'All Users' },
    { key: 'customer', label: 'Customers' },
    { key: 'owner', label: 'Owners' },
    { key: 'admin', label: 'Admins' },
  ];

  return (
    <div className="manage-users-page">
      <Container maxWidth="lg" className="manage-users-container">
        <Box className="manage-users-header">
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/admin')}
            className="manage-users-back-btn"
          >
            Admin Dashboard
          </Button>
          <Typography variant="h3" className="manage-users-title">
            Manage Users
          </Typography>
        </Box>

        {/* Filter Tabs */}
        <Box className="manage-users-filters">
          {filterTabs.map(tab => (
            <Button
              key={tab.key}
              variant={filter === tab.key ? 'contained' : 'text'}
              onClick={() => setFilter(tab.key)}
              className={`manage-users-filter-btn ${filter === tab.key ? 'manage-users-filter-active' : ''}`}
              size="small"
            >
              {tab.label}
            </Button>
          ))}
        </Box>

        {loading ? (
          <Box className="manage-users-loading">
            <CircularProgress sx={{ color: '#002244' }} />
          </Box>
        ) : (
          <TableContainer component={Paper} className="manage-users-table-container">
            <Table>
              <TableHead>
                <TableRow className="manage-users-table-head">
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Joined</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6, color: '#888' }}>
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map(user => {
                    const roleConfig = roleChipConfig[user.role] || roleChipConfig.customer;
                    return (
                      <TableRow key={user._id} className="manage-users-table-row">
                        <TableCell>
                          <Box className="manage-users-name-cell">
                            <Typography className="manage-users-name">
                              {user.firstName} {user.lastName}
                            </Typography>
                            {user.role === 'owner' && user.ownerProfile?.businessName && (
                              <Typography className="manage-users-business">
                                {user.ownerProfile.businessName}
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell className="manage-users-email">{user.email}</TableCell>
                        <TableCell>
                          <Chip
                            label={roleConfig.label}
                            size="small"
                            sx={{ backgroundColor: roleConfig.bg, color: roleConfig.color, fontWeight: 600 }}
                          />
                          {user.role === 'owner' && user.ownerProfile?.isVerified && (
                            <Chip
                              icon={<VerifiedUser sx={{ fontSize: 14 }} />}
                              label="Verified"
                              size="small"
                              sx={{ ml: 0.5, backgroundColor: '#e8f5e9', color: '#2e7d32', fontWeight: 600, fontSize: '0.7rem' }}
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={user.isActive ? 'Active' : 'Inactive'}
                            size="small"
                            sx={{
                              backgroundColor: user.isActive ? '#e8f5e9' : '#ffebee',
                              color: user.isActive ? '#2e7d32' : '#c62828',
                              fontWeight: 600
                            }}
                          />
                        </TableCell>
                        <TableCell className="manage-users-date">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton onClick={(e) => handleMenuOpen(e, user)} size="small">
                            <MoreVert />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Actions Menu */}
        <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
          {selectedUser?.isActive ? (
            <MenuItem onClick={() => handleToggleActive(selectedUser._id, true)}>
              <PersonOff sx={{ mr: 1, fontSize: 18, color: '#c62828' }} /> Deactivate
            </MenuItem>
          ) : (
            <MenuItem onClick={() => handleToggleActive(selectedUser._id, false)}>
              <CheckCircle sx={{ mr: 1, fontSize: 18, color: '#2e7d32' }} /> Activate
            </MenuItem>
          )}
          {selectedUser?.role === 'owner' && !selectedUser?.ownerProfile?.isVerified && (
            <MenuItem onClick={() => { setVerifyDialog(true); }}>
              <VerifiedUser sx={{ mr: 1, fontSize: 18, color: '#2e7d32' }} /> Verify Owner
            </MenuItem>
          )}
          {selectedUser?.role === 'owner' && selectedUser?.ownerProfile?.isVerified && (
            <MenuItem onClick={() => handleUnverifyOwner(selectedUser._id)}>
              <Block sx={{ mr: 1, fontSize: 18, color: '#e67e00' }} /> Remove Verification
            </MenuItem>
          )}
        </Menu>

        {/* Verify Dialog */}
        <Dialog open={verifyDialog} onClose={() => { setVerifyDialog(false); handleMenuClose(); }} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ color: '#002244', fontWeight: 600 }}>Verify Owner</DialogTitle>
          <DialogContent>
            <Typography>
              Verify <strong>{selectedUser?.firstName} {selectedUser?.lastName}</strong>
              {selectedUser?.ownerProfile?.businessName ? ` (${selectedUser.ownerProfile.businessName})` : ''}?
              This will approve all their documents and allow them to list vans.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => { setVerifyDialog(false); handleMenuClose(); }} sx={{ color: '#666', textTransform: 'none' }}>
              Cancel
            </Button>
            <Button
              onClick={handleVerifyOwner}
              variant="contained"
              sx={{ backgroundColor: '#2e7d32', textTransform: 'none', fontWeight: 600, '&:hover': { backgroundColor: '#1b5e20' } }}
            >
              Verify Owner
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
};

export default ManageUsers;
