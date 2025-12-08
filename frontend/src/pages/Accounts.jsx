import { useState, useEffect } from 'react';
import { Box, Button, Typography, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Grid, Card, CardContent } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { useAuth } from '../context/AuthContext';
import { endpoints } from '../services/api';
import { useSnackbar } from 'notistack';
import api from '../services/api';

const AccountCard = ({ account }) => {
  let Icon = AccountBalanceIcon;
  let color = '#0ea5e9'; // blue
  if (account.type === 'credit_card') { Icon = CreditCardIcon; color = '#8b5cf6'; } // purple
  if (account.type === 'cash') { Icon = AttachMoneyIcon; color = '#10b981'; } // green

  return (
    <Card sx={{ height: '100%', position: 'relative', overflow: 'hidden', borderLeft: `6px solid ${color}` }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle1" fontWeight="600" color="text.secondary">
            {account.type.replace('_', ' ').toUpperCase()}
          </Typography>
          <Icon sx={{ color: color }} />
        </Box>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {account.name}
        </Typography>
        <Typography variant="h4" color="text.primary">
          ${parseFloat(account.balance).toLocaleString()}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default function Accounts() {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', type: 'checking', balance: '0' });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await endpoints.getAccounts(user.id);
      setAccounts(res.data.accounts || []);
    } catch (error) {
      enqueueSnackbar('Failed to load accounts', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    if (!formData.name) return;
    try {
      // Backend expects float for balance?
      await api.post('/accounts', { ...formData, user_id: user.id });
      enqueueSnackbar('Account added!', { variant: 'success' });
      fetchData();
      handleClose();
      setFormData({ name: '', type: 'checking', balance: '0' });
    } catch (error) {
      enqueueSnackbar('Failed to add account', { variant: 'error' });
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">Accounts</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
          sx={{ borderRadius: 2 }}
        >
          Add Account
        </Button>
      </Box>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <Grid container spacing={3}>
          {accounts.map((acc) => (
            <Grid item xs={12} sm={6} md={4} key={acc.account_id || acc.id}>
              <AccountCard account={acc} />
            </Grid>
          ))}
          {accounts.length === 0 && (
            <Grid item xs={12}>
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography>No accounts found. Create one to get started!</Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add Account</DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Account Name"
            fullWidth
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            label="Initial Balance"
            type="number"
            fullWidth
            required
            value={formData.balance}
            onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
          />
          <TextField
            label="Type"
            select
            fullWidth
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <MenuItem value="checking">Checking</MenuItem>
            <MenuItem value="savings">Savings</MenuItem>
            <MenuItem value="credit_card">Credit Card</MenuItem>
            <MenuItem value="cash">Cash</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
