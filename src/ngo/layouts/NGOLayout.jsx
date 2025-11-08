import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import NGONavbar from '../components/NGONavbar';

const NGOLayout = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      }}
    >
      <NGONavbar />
      <Box>
        <Outlet />
      </Box>
    </Box>
  );
};

export default NGOLayout;
