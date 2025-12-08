import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Typography, Box, useTheme } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/DashboardRounded';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import CategoryIcon from '@mui/icons-material/CategoryRounded';
import BarChartIcon from '@mui/icons-material/BarChartRounded';
import AccountCircleIcon from '@mui/icons-material/AccountCircleRounded';
import LogoutIcon from '@mui/icons-material/LogoutRounded';
import { useAuth } from '../context/AuthContext';

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Transactions', icon: <AccountBalanceWalletIcon />, path: '/transactions' },
  { text: 'Categories', icon: <CategoryIcon />, path: '/categories' },
  { text: 'Analytics', icon: <BarChartIcon />, path: '/analytics' },
  { text: 'Accounts', icon: <AccountCircleIcon />, path: '/accounts' },
];

export default function Sidebar({ width, open, onClose, isMobile }) {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          component="img"
          src="/vite.svg" // Using vite logo as placeholder or just an icon
          sx={{ width: 32, height: 32, filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.2))' }}
        />
        <Typography variant="h6" fontWeight="bold" color="primary">
          FinManager
        </Typography>
      </Box>

      <List sx={{ px: 2, flexGrow: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItemButton
              key={item.text}
              onClick={() => {
                navigate(item.path);
                if (isMobile) onClose();
              }}
              sx={{
                mb: 1,
                borderRadius: 2,
                backgroundColor: isActive ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                color: isActive ? 'primary.main' : 'text.secondary',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.04),
                },
              }}
            >
              <ListItemIcon sx={{ color: isActive ? 'primary.main' : 'inherit', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{ fontWeight: isActive ? 600 : 500 }}
              />
            </ListItemButton>
          );
        })}
      </List>

      <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
        <ListItemButton onClick={logout} sx={{ borderRadius: 2, color: 'error.main' }}>
          <ListItemIcon sx={{ color: 'error.main', minWidth: 40 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 600 }} />
        </ListItemButton>
      </Box>
    </Box>
  );

  // Helper for alpha color since we can't import alpha here without importing from MUI styles
  // Actually we can, but let's just use the theme util if available or import it.
  // Wait, I didn't import alpha. I should fix that.

  return (
    <Box component="nav" sx={{ width: { md: width }, flexShrink: { md: 0 } }}>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width, borderRight: 'none', boxShadow: '4px 0 24px rgba(0,0,0,0.02)' },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}

// Need to import alpha
import { alpha } from '@mui/material/styles';
