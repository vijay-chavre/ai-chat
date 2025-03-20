import { createTheme } from '@mui/material/styles';

export const chatTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#8ab4f8', // Light blue for highlights
    },
    secondary: {
      main: '#9aa0a6', // Gray for secondary text
    },
    background: {
      default: '#ffffff', // Light background
      paper: '#f8f9fa', // Slightly darker for chat bubbles
    },
    text: {
      primary: '#202124', // Dark text
      secondary: '#5f6368', // Dimmed text
    },
    divider: '#dadce0',
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    body1: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.8125rem',
      color: '#5f6368',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          padding: '12px',
          boxShadow: 'none',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          backgroundColor: '#f1f3f4',
          borderRadius: '24px',
          padding: '8px 16px',
          color: '#202124',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#5f6368',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          margin: '8px 0',
          backgroundColor: '#dadce0',
        },
      },
    },
  },
});

export default chatTheme;