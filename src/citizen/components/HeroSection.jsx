import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const HeroSection = ({ words, currentWordIndex, isVisible }) => {
  const [stats, setStats] = useState({ total: 0, completed: 0, active: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/notLogged/initiativeStats`);
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Box sx={{ flex: 1 }}>
      <Box>
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '3rem', md: '5rem', lg: '6rem' },
            fontWeight: 800,
            background: 'linear-gradient(90deg, #047857 0%, #0e7490 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            mb: 2,
            fontFamily: 'Poppins, sans-serif',
          }}
        >
          EcoSynergy
        </Typography>
        
        <Box sx={{ height: { xs: '60px', md: '80px', lg: '100px' }, overflow: 'hidden' }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', md: '3.5rem', lg: '4.5rem' },
              fontWeight: 800,
              color: '#2AA1DC',
              fontFamily: 'Poppins, sans-serif',
              transition: 'opacity 0.6s ease-in-out, transform 0.6s ease-in-out',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            }}
          >
            {words[currentWordIndex]}
          </Typography>
        </Box>
        
        {/* Stats Display */}
        {loading ? (
          <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
            <CircularProgress size={24} sx={{ color: '#047857' }} />
            <Typography sx={{ color: '#9ca3af' }}>Loading community impact...</Typography>
          </Box>
        ) : (
          <Box sx={{ mt: 4 }}>
            {/* Completed Initiatives Count */}
            <Box 
              sx={{ 
                display: 'inline-flex',
                alignItems: 'center',
                gap: 2,
                bgcolor: 'rgba(16, 185, 129, 0.1)',
                border: '2px solid rgba(16, 185, 129, 0.3)',
                borderRadius: 3,
                px: 4,
                py: 2.5,
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 16px rgba(16, 185, 129, 0.3)',
                  borderColor: 'rgba(16, 185, 129, 0.5)',
                }
              }}
            >
              <EmojiEventsIcon sx={{ fontSize: 40, color: '#10b981' }} />
              <Box>
                <Typography 
                  variant="h2" 
                  sx={{ 
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    fontWeight: 800,
                    color: '#10b981',
                    lineHeight: 1,
                    fontFamily: 'Poppins, sans-serif',
                  }}
                >
                  {stats.completed}
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: '#e5e7eb',
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    mt: 0.5
                  }}
                >
                  Initiatives Completed
                </Typography>
              </Box>
            </Box>

            {/* Motivational Line */}
            <Box sx={{ mt: 3, maxWidth: '600px' }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#94a3b8',
                  fontWeight: 500,
                  fontSize: { xs: '1rem', md: '1.25rem' },
                  lineHeight: 1.6,
                  fontStyle: 'italic',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <TrendingUpIcon sx={{ color: '#10b981' }} />
                Every completed initiative is a step toward a greener tomorrow. Join the movement and make an impact today!
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default HeroSection;
