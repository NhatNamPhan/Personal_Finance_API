import { AppBar, Toolbar, Typography, IconButton, Box, Avatar, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/NotificationsNoneRounded';
import { useAuth } from '../context/AuthContext';

export default function Header({ onMenuClick, sidebarWidth }) {
  const theme = useTheme();
  const { user } = useAuth(); // Assuming user object has name usually, but here just id

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { md: `calc(100% - ${sidebarWidth}px)` },
        ml: { md: `${sidebarWidth}px` },
        boxShadow: 'none',
        borderBottom: `1px dashed ${theme.palette.divider}`,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(6px)',
        color: 'text.primary',
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2, display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ flexGrow: 1 }} />

        <IconButton color="inherit" sx={{ mr: 2 }}>
          <NotificationsIcon />
        </IconButton>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography variant="subtitle2" fontWeight="600">
            User {user?.id}
          </Typography>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: theme.palette.primary.main,
              boxShadow: '0px 4px 10px rgba(0,0,0,0.1)'
            }}
          >
            U
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
