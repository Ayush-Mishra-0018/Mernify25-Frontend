import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import ExploreIcon from '@mui/icons-material/Explore';

const HeroSection = ({ words, currentWordIndex, isVisible }) => {
  const navigate = useNavigate();
  
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
        
        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => navigate('/my-initiatives')}
            sx={{
              bgcolor: '#047857',
              color: 'white',
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: 2,
              textTransform: 'none',
              boxShadow: '0 4px 6px rgba(4, 120, 87, 0.3)',
              '&:hover': {
                bgcolor: '#059669',
                boxShadow: '0 6px 8px rgba(4, 120, 87, 0.4)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Launch New Initiative
          </Button>
          
          <Button
            variant="outlined"
            size="large"
            startIcon={<ExploreIcon />}
            onClick={() => navigate('/community-initiatives')}
            sx={{
              borderColor: '#047857',
              color: '#047857',
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: 2,
              borderWidth: 2,
              textTransform: 'none',
              '&:hover': {
                borderColor: '#059669',
                bgcolor: 'rgba(4, 120, 87, 0.05)',
                borderWidth: 2,
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Explore Community Initiatives
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default HeroSection;
