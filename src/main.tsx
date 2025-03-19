// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { darkTheme } from './theme';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <App />
    </ThemeProvider>
  </React.StrictMode>
);
