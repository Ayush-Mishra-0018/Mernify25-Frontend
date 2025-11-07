import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

// NOTE: update this to your actual backend endpoint
const API_URL = import.meta.env.VITE_API_URL;

const MyInitiatives = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    heading: '',
    description: '',
    eventDate: '', // yyyy-mm-dd
    timeFrom: '', // HH:MM
    timeTo: '', // HH:MM
    upperLimit: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const validate = () => {
    setError('');
    // heading
    if (!form.heading || form.heading.trim().length < 3 || form.heading.trim().length > 100) {
      return 'Heading must be between 3 and 100 characters.';
    }
    // description
    if (!form.description || form.description.trim().length < 10 || form.description.trim().length > 1000) {
      return 'Description must be between 10 and 1000 characters.';
    }
    // date
    if (!form.eventDate) return 'Event date is required.';
    if (!form.timeFrom || !form.timeTo) return 'Start and end times are required.';
    // combine to compare
    const from = new Date(`${form.eventDate}T${form.timeFrom}`);
    const to = new Date(`${form.eventDate}T${form.timeTo}`);
    if (isNaN(from.getTime()) || isNaN(to.getTime())) return 'Invalid date/time.';
    if (to <= from) return 'End time must be after start time.';
    // upperLimit
    const ul = Number(form.upperLimit);
    if (!Number.isInteger(ul) || ul < 1) return 'Upper limit must be an integer >= 1.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setLoading(true);
    setError('');

    // prepare payload: send ISO datetimes for timeFrom/timeTo
    const payload = {
      heading: form.heading.trim(),
      description: form.description.trim(),
      eventDate: new Date(form.eventDate).toISOString(),
      timeFrom: new Date(`${form.eventDate}T${form.timeFrom}`).toISOString(),
      timeTo: new Date(`${form.eventDate}T${form.timeTo}`).toISOString(),
      upperLimit: Number(form.upperLimit),
    };

    try {
      const token = localStorage.getItem('token'); // adjust if you store JWT differently
      const res = await fetch(`${API_URL}/user/communityDrive`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create initiative');

      setSuccess('Initiative created successfully.');
      // small delay so user sees success then navigate
      setTimeout(() => navigate('/my-initiatives'), 900);
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }} component="main">
      <Typography
        variant="h4"
        sx={{
          fontWeight: 800,
          mb: 2,
          background: 'linear-gradient(90deg, #10b981 0%, #06b6d4 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Launch New Initiative
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={2}>
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}

          <TextField
            label="Heading"
            name="heading"
            value={form.heading}
            onChange={handleChange}
            required
            inputProps={{ maxLength: 100 }}
            fullWidth
            sx={{
              '& label.Mui-focused': {
                color: '#10b981',
              },
              '& label': {
                color: '#9ca3af',
              },
              '& .MuiOutlinedInput-root': {
                color: '#fff',
                '& fieldset': {
                  borderColor: '#4b5563',
                },
                '&:hover fieldset': {
                  borderColor: '#6b7280',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#10b981',
                },
              },
            }}
          />

          <TextField
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            multiline
            minRows={4}
            inputProps={{ maxLength: 1000 }}
            fullWidth
            sx={{
              '& label.Mui-focused': {
                color: '#10b981',
              },
              '& label': {
                color: '#9ca3af',
              },
              '& .MuiOutlinedInput-root': {
                color: '#fff',
                '& fieldset': {
                  borderColor: '#4b5563',
                },
                '&:hover fieldset': {
                  borderColor: '#6b7280',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#10b981',
                },
              },
            }}
          />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              label="Event Date"
              name="eventDate"
              type="date"
              value={form.eventDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
              sx={{
                flex: 1,
                '& label.Mui-focused': {
                  color: '#10b981',
                },
                '& label': {
                  color: '#9ca3af',
                },
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& fieldset': {
                    borderColor: '#4b5563',
                  },
                  '&:hover fieldset': {
                    borderColor: '#6b7280',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#10b981',
                  },
                },
                '& input::-webkit-calendar-picker-indicator': {
                  filter: 'invert(1)',
                },
              }}
            />

            <TextField
              label="Start Time"
              name="timeFrom"
              type="time"
              value={form.timeFrom}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
              sx={{
                flex: 1,
                '& label.Mui-focused': {
                  color: '#10b981',
                },
                '& label': {
                  color: '#9ca3af',
                },
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& fieldset': {
                    borderColor: '#4b5563',
                  },
                  '&:hover fieldset': {
                    borderColor: '#6b7280',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#10b981',
                  },
                },
                '& input::-webkit-calendar-picker-indicator': {
                  filter: 'invert(1)',
                },
              }}
            />

            <TextField
              label="End Time"
              name="timeTo"
              type="time"
              value={form.timeTo}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
              sx={{
                flex: 1,
                '& label.Mui-focused': {
                  color: '#10b981',
                },
                '& label': {
                  color: '#9ca3af',
                },
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& fieldset': {
                    borderColor: '#4b5563',
                  },
                  '&:hover fieldset': {
                    borderColor: '#6b7280',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#10b981',
                  },
                },
                '& input::-webkit-calendar-picker-indicator': {
                  filter: 'invert(1)',
                },
              }}
            />
          </Stack>

          <TextField
            label="Upper Limit"
            name="upperLimit"
            type="number"
            value={form.upperLimit}
            onChange={handleChange}
            InputProps={{ inputProps: { min: 1 } }}
            required
            sx={{
              width: 220,
              '& label.Mui-focused': {
                color: '#10b981',
              },
              '& label': {
                color: '#9ca3af',
              },
              '& .MuiOutlinedInput-root': {
                color: '#fff',
                '& fieldset': {
                  borderColor: '#4b5563',
                },
                '&:hover fieldset': {
                  borderColor: '#6b7280',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#10b981',
                },
              },
            }}
          />

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                bgcolor: '#047857',
                color: '#fff',
                px: 4,
                py: 1.2,
                fontWeight: 700,
                textTransform: 'none',
                '&:hover': { bgcolor: '#059669' },
              }}
            >
              {loading ? <CircularProgress size={20} /> : 'Create Initiative'}
            </Button>

            <Button
              type="button"
              variant="outlined"
              onClick={() => navigate(-1)}
              sx={{ borderColor: '#047857', color: '#047857', textTransform: 'none' }}
            >
              Cancel
            </Button>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default MyInitiatives;
