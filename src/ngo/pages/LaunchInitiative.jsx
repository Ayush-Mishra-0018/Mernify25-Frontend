import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  IconButton,
  Chip,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import RecyclingIcon from '@mui/icons-material/Recycling';
import { useNavigate } from 'react-router-dom';

const LaunchInitiative = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const [endDate, setEndDate] = useState('');
  const [items, setItems] = useState([{ name: '', description: '' }]);

  const handleAddItem = () => {
    setItems([...items, { name: '', description: '' }]);
  };

  const handleRemoveItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const validateForm = () => {
    if (!endDate) {
      showSnackbar('Please select an end date', 'error');
      return false;
    }

    const endDateObj = new Date(endDate);
    if (endDateObj <= new Date()) {
      showSnackbar('End date must be in the future', 'error');
      return false;
    }

    const validItems = items.filter(item => item.name.trim());
    if (validItems.length === 0) {
      showSnackbar('Please add at least one item with a name', 'error');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    setLoading(true);

    try {
      const validItems = items.filter(item => item.name.trim());
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/ngo/collectionInitiative`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          endDate,
          items: validItems,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create initiative');
      }

      const data = await response.json();
      showSnackbar('Collection initiative created successfully!', 'success');
      
      // Reset form
      setTimeout(() => {
        navigate('/ngo/initiatives');
      }, 1500);
    } catch (error) {
      console.error('Error creating initiative:', error);
      showSnackbar(error.message || 'Failed to create initiative', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setEndDate('');
    setItems([{ name: '', description: '' }]);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          bgcolor: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: 3,
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <RecyclingIcon sx={{ fontSize: 60, color: '#10b981', mb: 2 }} />
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
            Launch Collection Initiative
          </Typography>
          <Typography variant="body2" sx={{ color: '#9ca3af' }}>
            Create a new initiative to collect recyclable items from the community
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          {/* End Date */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ color: '#e5e7eb', mb: 2, fontWeight: 600 }}>
              Initiative Duration
            </Typography>
            <TextField
              type="datetime-local"
              label="End Date & Time"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#e5e7eb',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#10b981',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#9ca3af',
                },
              }}
            />
          </Box>

          {/* Items */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ color: '#e5e7eb', fontWeight: 600 }}>
                Items to Collect
              </Typography>
              <Chip
                label={`${items.length} item${items.length > 1 ? 's' : ''}`}
                sx={{
                  bgcolor: 'rgba(16, 185, 129, 0.2)',
                  color: '#10b981',
                  fontWeight: 600,
                }}
              />
            </Box>

            {items.map((item, index) => (
              <Paper
                key={index}
                sx={{
                  p: 3,
                  mb: 2,
                  bgcolor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 2,
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="body1" sx={{ color: '#9ca3af', fontWeight: 600 }}>
                    Item #{index + 1}
                  </Typography>
                  {items.length > 1 && (
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveItem(index)}
                      sx={{ color: '#ef4444' }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>

                <TextField
                  label="Item Name"
                  value={item.name}
                  onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                  fullWidth
                  required
                  placeholder="e.g., Plastic Bottles, Paper, Electronics"
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      color: '#e5e7eb',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#10b981',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#9ca3af',
                    },
                  }}
                />

                <TextField
                  label="Description (Optional)"
                  value={item.description}
                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  fullWidth
                  multiline
                  rows={2}
                  placeholder="Provide details about condition, quantity, or specific requirements"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: '#e5e7eb',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#10b981',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#9ca3af',
                    },
                  }}
                />
              </Paper>
            ))}

            <Button
              startIcon={<AddCircleIcon />}
              onClick={handleAddItem}
              fullWidth
              sx={{
                color: '#10b981',
                borderColor: '#10b981',
                '&:hover': {
                  borderColor: '#059669',
                  bgcolor: 'rgba(16, 185, 129, 0.1)',
                },
                py: 1.5,
                borderRadius: 2,
                border: '2px dashed',
              }}
            >
              Add Another Item
            </Button>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              type="button"
              variant="outlined"
              onClick={handleReset}
              disabled={loading}
              fullWidth
              sx={{
                py: 1.5,
                borderRadius: 2,
                borderColor: 'rgba(255, 255, 255, 0.2)',
                color: '#9ca3af',
                '&:hover': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                },
              }}
            >
              Reset
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              fullWidth
              sx={{
                py: 1.5,
                borderRadius: 2,
                bgcolor: '#10b981',
                fontWeight: 700,
                fontSize: '1rem',
                '&:hover': {
                  bgcolor: '#059669',
                },
                '&:disabled': {
                  bgcolor: '#374151',
                },
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Launch Initiative'}
            </Button>
          </Box>
        </form>
      </Paper>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default LaunchInitiative;
