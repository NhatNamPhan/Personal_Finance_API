import * as React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CategoryIcon from '@mui/icons-material/Category';
import BarChartIcon from '@mui/icons-material/BarChart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link } from 'react-router-dom';

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Thu chi', icon: <AccountBalanceWalletIcon />, path: '/transactions' },
  { text: 'Danh mục', icon: <CategoryIcon />, path: '/categories' },
  { text: 'Báo cáo', icon: <BarChartIcon />, path: '/analytics' },
  { text: 'Tài khoản', icon: <AccountCircleIcon />, path: '/accounts' },
];

export default function Sidebar() {
  return (
    <Drawer variant="permanent" anchor="left">
      <List>
        {menuItems.map((item) => (
          <ListItem button key={item.text} component={Link} to={item.path}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
