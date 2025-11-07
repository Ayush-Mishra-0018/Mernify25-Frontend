import React from 'react';
import { Box, Typography } from '@mui/material';

const HeroSection = ({ words, currentWordIndex, isVisible }) => {
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
      </Box>
    </Box>
  );
};

export default HeroSection;
