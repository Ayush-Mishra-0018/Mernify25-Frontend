import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar, Menu, MenuItem, IconButton } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ViewListIcon from '@mui/icons-material/ViewList';
import LogoutIcon from '@mui/icons-material/Logout';
import { jwtDecode } from 'jwt-decode';

const NGONavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);

  const token = localStorage.getItem('token');
  const user = token ? jwtDecode(token) : null;

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar 
      position="sticky" 
      sx={{
        background: 'linear-gradient(90deg, #047857 0%, #0e7490 100%)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
        {/* Logo/Brand */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              cursor: 'pointer',
              background: 'linear-gradient(90deg, #ffffff 0%, #e5e7eb 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontFamily: 'Poppins, sans-serif',
            }}
            onClick={() => navigate('/ngo')}
          >
            EcoSynergy
          </Typography>
          <Typography
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              px: 2,
              py: 0.5,
              borderRadius: 2,
              fontSize: '0.875rem',
              fontWeight: 600,
            }}
          >
            NGO Portal
          </Typography>
        </Box>

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => navigate('/ngo/launch')}
            sx={{
              color: 'white',
              fontWeight: 600,
              bgcolor: isActive('/ngo/launch') ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.15)',
              },
              borderRadius: 2,
              px: 3,
            }}
          >
            Launch Initiative
          </Button>

          <Button
            startIcon={<ViewListIcon />}
            onClick={() => navigate('/ngo/initiatives')}
            sx={{
              color: 'white',
              fontWeight: 600,
              bgcolor: isActive('/ngo/initiatives') ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.15)',
              },
              borderRadius: 2,
              px: 3,
            }}
          >
            View Initiatives
          </Button>

          {/* User Menu */}
          <IconButton onClick={handleMenuOpen} sx={{ ml: 2 }}>
            <Avatar
              src={user?.profilePictureURL}
              alt={user?.name}
              sx={{
                width: 40,
                height: 40,
                border: '2px solid white',
              }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                bgcolor: '#1e293b',
                color: '#e5e7eb',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                mt: 1,
              },
            }}
          >
            <MenuItem disabled sx={{ opacity: 1, color: '#9ca3af' }}>
              <Box>
                <Typography variant="body2" fontWeight={600}>
                  {user?.name}
                </Typography>
                <Typography variant="caption" sx={{ color: '#6b7280' }}>
                  {user?.email}
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleMenuClose();
                handleLogout();
              }}
              sx={{
                color: '#ef4444',
                '&:hover': {
                  bgcolor: 'rgba(239, 68, 68, 0.1)',
                },
              }}
            >
              <LogoutIcon sx={{ mr: 1, fontSize: 20 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NGONavbar;
