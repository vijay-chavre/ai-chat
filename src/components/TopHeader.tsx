import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useTheme,
  Badge,
} from "@mui/material";
import {
  Brightness4,
  Brightness7,
  Menu as MenuIcon,
  Settings,
} from "@mui/icons-material";
import React, { useState } from "react";

interface HeaderProps {
  toggleTheme?: () => void;
}

const TopHeader: React.FC<HeaderProps> = ({ toggleTheme }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="static"
      color="default"
      elevation={1}
      sx={{
        borderBottom: "1px solid #ddd",
        backgroundColor: "#fff",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Left Section */}
        <Box display="flex" alignItems="center">
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ ml: 1 }}>
            My App
          </Typography>
        </Box>

        {/* Right Section */}
        <Box display="flex" alignItems="center" gap={1}>
          {/* Light/Dark Mode Toggle */}
          <IconButton onClick={toggleTheme} color="inherit">
            {theme.palette.mode === "dark" ? <Brightness7 /> : <Brightness4 />}
          </IconButton>

          {/* Settings Icon */}
          <IconButton color="inherit">
            <Settings />
          </IconButton>

          {/* User Avatar with Online Badge */}
          <IconButton onClick={handleMenuOpen} color="inherit">
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              badgeContent={
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    backgroundColor: "#4CAF50", // Green Online Dot
                    borderRadius: "50%",
                    border: "2px solid white",
                  }}
                />
              }
            >
              <Avatar alt="User Avatar" src="/avatar.png" />
            </Badge>
          </IconButton>

          {/* Avatar Dropdown Menu */}
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopHeader;
