import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Card, CardContent, Fade } from '@mui/material';
import RecyclingIcon from '@mui/icons-material/Recycling';
import PeopleIcon from '@mui/icons-material/People';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import NatureIcon from '@mui/icons-material/Nature';

const HomePage = () => {
  const words = ['Collaborate', 'Conserve', 'Change', 'Connect'];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [activeCard, setActiveCard] = useState(0);

  const communityEfforts = [
    {
      icon: <PeopleIcon sx={{ fontSize: 60, color: '#047857' }} />,
      title: 'Community United 🤝',
      description: 'Join hands with local community to create a cleaner, greener environment',
    },
    {
      icon: <CleaningServicesIcon sx={{ fontSize: 60, color: '#0e7490' }} />,
      title: 'Be a part of Community Initiatives! 🧹',
      description: 'Organizing local cleanup drives to keep our neighborhoods pristine',
    },
    {
      icon: <RecyclingIcon sx={{ fontSize: 60, color: '#059669' }} />,
      title: 'Recycle Together ♻️',
      description: 'Be a part of sustainable waste management',
    },
    {
      icon: <NatureIcon sx={{ fontSize: 60, color: '#10b981' }} />,
      title: 'Green Future',
      description: 'Building a sustainable tomorrow through collective action today',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
        setActiveCard((prevIndex) => (prevIndex + 1) % communityEfforts.length);
        setIsVisible(true);
      }, 500); // Wait for fade out
    }, 3000); // Change both every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Container maxWidth="xl" sx={{ minHeight: '90vh', display: 'flex', alignItems: 'center', py: 4, gap: 4 }}>
      {/* Left Section */}
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

      {/* Right Section - Community Effort */}
      <Box 
        sx={{ 
          flex: 1, 
          display: { xs: 'none', md: 'flex' }, 
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          minHeight: '400px',
        }}
      >
        {communityEfforts.map((effort, index) => (
          <Fade key={index} in={activeCard === index} timeout={1000}>
            <Card
              sx={{
                position: 'absolute',
                width: '100%',
                maxWidth: '450px',
                background: 'linear-gradient(135deg, #d1fae5 0%, #bae6fd 100%)',
                borderRadius: 4,
                boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                transform: activeCard === index ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(10px)',
                opacity: activeCard === index ? 1 : 0,
                transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                display: activeCard === index ? 'block' : 'none',
              }}
            >
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mb: 3,
                    animation: 'float 3s ease-in-out infinite',
                    '@keyframes float': {
                      '0%, 100%': { transform: 'translateY(0)' },
                      '50%': { transform: 'translateY(-10px)' },
                    },
                  }}
                >
                  {effort.icon}
                </Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: '#047857',
                    mb: 2,
                    fontFamily: 'Poppins, sans-serif',
                  }}
                >
                  {effort.title}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: '#475569',
                    fontSize: '1.1rem',
                    lineHeight: 1.6,
                    fontFamily: 'Poppins, sans-serif',
                  }}
                >
                  {effort.description}
                </Typography>
              </CardContent>
            </Card>
          </Fade>
        ))}
      </Box>
    </Container>
  );
};

export default HomePage;