
import * as React from 'react';
import { Box, Toolbar } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Categories from './pages/Categories';
import Analytics from './pages/Analytics';
import Accounts from './pages/Accounts';

function App() {
  return (
    <Router>
      <Box sx={{ display: 'flex' }}>
        <Header />
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 3, ml: '240px' }}>
          <Toolbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/accounts" element={<Accounts />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;

