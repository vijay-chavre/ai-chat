// src/App.tsx
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import React from 'react';
import ChatApp from './components/ChatApp';
import TopHeader from './components/TopHeader';
import { chatTheme } from './theme';

const App: React.FC = () => {
  

  return (
      <ThemeProvider theme={chatTheme}>
        <CssBaseline />
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
          <Box sx={{ position: 'fixed', top: 0, width: '100%', zIndex: 1100 }}>
            <TopHeader />
          </Box>
          <Box component="main" sx={{ flexGrow: 1, pt: '80px', pb: '80px', overflow: 'auto' }}>
            <ChatApp />
          </Box>
        </Box>
      </ThemeProvider>
    
  );
};

export default App;
