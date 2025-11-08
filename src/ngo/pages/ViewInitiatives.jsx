import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Tabs,
  Tab,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  Badge,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import PeopleIcon from '@mui/icons-material/People';
import CategoryIcon from '@mui/icons-material/Category';
import { useNavigate } from 'react-router-dom';

const ViewInitiatives = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [initiatives, setInitiatives] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'ongoing', 'completed'

  useEffect(() => {
    fetchInitiatives();
  }, [filter]);

  const fetchInitiatives = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      const url =
        filter === 'all'
          ? `${import.meta.env.VITE_API_URL}/ngo/collectionInitiatives`
          : `${import.meta.env.VITE_API_URL}/ngo/collectionInitiatives?status=${filter}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch initiatives');
      }

      const data = await response.json();
      setInitiatives(data.initiatives);
    } catch (error) {
      console.error('Error fetching initiatives:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (event, newValue) => {
    setFilter(newValue);
  };

  const getStatusColor = (status) => {
    return status === 'ongoing' ? '#fbbf24' : '#10b981';
  };

  const getStatusIcon = (status) => {
    return status === 'ongoing' ? <PendingIcon /> : <CheckCircleIcon />;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDonorsCount = (initiative) => {
    return initiative.donors?.length || 0;
  };

  const getPendingDonorsCount = (initiative) => {
    return initiative.donors?.filter((d) => d.givenStatus === 'pending').length || 0;
  };

  if (loading) {
    return (
      <Container
        maxWidth="lg"
        sx={{
          py: 4,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh',
        }}
      >
        <CircularProgress sx={{ color: '#10b981' }} />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography
          variant="h4"
          fontWeight={800}
          sx={{
            background: 'linear-gradient(90deg, #10b981 0%, #34d399 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1,
          }}
        >
          Collection Initiatives
        </Typography>
        <Typography variant="body1" sx={{ color: '#9ca3af' }}>
          Manage and track your collection initiatives
        </Typography>
      </Box>

      {/* Filter Tabs */}
      <Paper
        elevation={2}
        sx={{
          mb: 3,
          bgcolor: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 2,
        }}
      >
        <Tabs
          value={filter}
          onChange={handleFilterChange}
          centered
          sx={{
            '& .MuiTab-root': {
              color: '#9ca3af',
              fontWeight: 600,
              '&.Mui-selected': {
                color: '#10b981',
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#10b981',
            },
          }}
        >
          <Tab label="All Initiatives" value="all" />
          <Tab label="Ongoing" value="ongoing" icon={<PendingIcon />} iconPosition="start" />
          <Tab label="Completed" value="completed" icon={<CheckCircleIcon />} iconPosition="start" />
        </Tabs>
      </Paper>

      {/* Initiatives List */}
      {initiatives.length === 0 ? (
        <Paper
          sx={{
            p: 6,
            textAlign: 'center',
            bgcolor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 2,
          }}
        >
          <CategoryIcon sx={{ fontSize: 80, color: '#6b7280', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#9ca3af', mb: 1 }}>
            No initiatives found
          </Typography>
          <Typography variant="body2" sx={{ color: '#6b7280' }}>
            {filter === 'all'
              ? 'Launch your first collection initiative to get started'
              : `No ${filter} initiatives at the moment`}
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {initiatives.map((initiative) => (
            <Grid item xs={12} md={6} key={initiative._id}>
              <Card
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 16px rgba(16, 185, 129, 0.2)',
                    borderColor: 'rgba(16, 185, 129, 0.3)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  {/* Status Badge */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Chip
                      icon={getStatusIcon(initiative.status)}
                      label={initiative.status.toUpperCase()}
                      sx={{
                        bgcolor: `${getStatusColor(initiative.status)}20`,
                        color: getStatusColor(initiative.status),
                        fontWeight: 700,
                        fontSize: '0.75rem',
                      }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccessTimeIcon sx={{ fontSize: 18, color: '#9ca3af' }} />
                      <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                        Created {new Date(initiative.creationDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>

                  {/* End Date */}
                  <Box
                    sx={{
                      mb: 3,
                      p: 2,
                      bgcolor: 'rgba(16, 185, 129, 0.1)',
                      borderRadius: 2,
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                    }}
                  >
                    <Typography variant="caption" sx={{ color: '#9ca3af', fontWeight: 600 }}>
                      End Date
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#10b981', fontWeight: 700 }}>
                      {formatDate(initiative.endDate)}
                    </Typography>
                  </Box>

                  {/* Items List */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ color: '#e5e7eb', fontWeight: 700, mb: 1 }}>
                      Items to Collect ({initiative.items.length})
                    </Typography>
                    <List dense>
                      {initiative.items.map((item, index) => (
                        <ListItem
                          key={index}
                          sx={{
                            px: 0,
                            py: 0.5,
                          }}
                        >
                          <CategoryIcon sx={{ fontSize: 16, color: '#10b981', mr: 1 }} />
                          <ListItemText
                            primary={item.name}
                            secondary={item.description}
                            primaryTypographyProps={{
                              sx: { color: '#e5e7eb', fontSize: '0.875rem', fontWeight: 600 },
                            }}
                            secondaryTypographyProps={{
                              sx: { color: '#9ca3af', fontSize: '0.75rem' },
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>

                  <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

                  {/* Donors Stats */}
                  <Box sx={{ display: 'flex', gap: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Badge badgeContent={getDonorsCount(initiative)} color="primary">
                        <PeopleIcon sx={{ color: '#10b981' }} />
                      </Badge>
                      <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                        Total Donors
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Badge badgeContent={getPendingDonorsCount(initiative)} color="warning">
                        <PendingIcon sx={{ color: '#fbbf24' }} />
                      </Badge>
                      <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                        Pending
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default ViewInitiatives;
