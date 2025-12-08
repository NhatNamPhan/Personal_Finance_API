import { useState, useEffect } from 'react';
import { Box, Button, Typography, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, IconButton, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete'; // Placeholder for delete action
import { useAuth } from '../context/AuthContext';
import { endpoints } from '../services/api';
import { useSnackbar } from 'notistack';
import { format } from 'date-fns';

const columns = [
  {
    field: 'date',
    headerName: 'Date',
    width: 130,
    valueFormatter: (value) => value ? format(new Date(value), 'yyyy-MM-dd') : ''
  },
  { field: 'description', headerName: 'Description', width: 200, flex: 1 },
  { field: 'category', headerName: 'Category', width: 150 },
  {
    field: 'amount',
    headerName: 'Amount',
    width: 130,
    renderCell: (params) => (
      <span style={{ color: params.row.type === 'income' ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>
        {params.row.type === 'income' ? '+' : '-'}${parseFloat(params.value || 0).toLocaleString()}
      </span>
    )
  },
  { field: 'type', headerName: 'Type', width: 100 },
];

export default function Transactions() {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense',
    date: format(new Date(), 'yyyy-MM-dd'),
    category_id: '',
    account_id: ''
  });

  // Dependencies
  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await endpoints.getTransactions(user.id);
      // Add unique id for DataGrid if not present, though api returns transaction_id
      const data = (res.data.transactions || []).map(t => ({ ...t, id: t.transaction_id }));
      setRows(data);
    } catch (error) {
      enqueueSnackbar('Failed to load transactions', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchDependencies = async () => {
    try {
      // Parallel fetch
      const [catRes, accRes] = await Promise.all([
        endpoints.getCategories(user.id).catch(() => ({ data: [] })),
        endpoints.getAccounts(user.id).catch(() => ({ data: [] }))
      ]);
      // Assuming structure, if failure, empty array
      setCategories(catRes.data || []);
      setAccounts(accRes.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
      fetchDependencies();
    }
  }, [user]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    if (!formData.amount || !formData.account_id || !formData.category_id) {
      enqueueSnackbar('Please fill required fields (Amount, Account, Category)', { variant: 'warning' });
      return;
    }

    try {
      await endpoints.addTransaction({
        ...formData,
      });
      enqueueSnackbar('Transaction added!', { variant: 'success' });
      fetchData();
      handleClose();
      // Reset form basics
      setFormData(prev => ({ ...prev, description: '', amount: '' }));
    } catch (error) {
      enqueueSnackbar('Failed to add transaction', { variant: 'error' });
    }
  };

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">Transactions</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
          sx={{ borderRadius: 2 }}
        >
          New Transaction
        </Button>
      </Box>

      <Paper sx={{ height: '100%', width: '100%', p: 0, overflow: 'hidden' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10, 25]}
          checkboxSelection
          disableRowSelectionOnClick
          sx={{
            border: 'none',
            '& .MuiDataGrid-cell:focus': { outline: 'none' },
          }}
        />
      </Paper>

      {/* Add Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Transaction</DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Description"
            fullWidth
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Amount"
              type="number"
              fullWidth
              required
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            />
            <TextField
              label="Type"
              select
              fullWidth
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <MenuItem value="income">Income</MenuItem>
              <MenuItem value="expense">Expense</MenuItem>
            </TextField>
          </Box>
          <TextField
            label="Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Category"
              select
              fullWidth
              required
              helperText={categories.length === 0 ? "No categories found" : ""}
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
            >
              {categories.map((c) => (
                <MenuItem key={c.category_id || c.id} value={c.category_id || c.id}>
                  {c.name}
                </MenuItem>
              ))}
              {/* Fallback if list empty for testing UI */}
              {categories.length === 0 && <MenuItem value={1}>Default (Test)</MenuItem>}
            </TextField>
            <TextField
              label="Account"
              select
              fullWidth
              required
              helperText={accounts.length === 0 ? "No accounts found" : ""}
              value={formData.account_id}
              onChange={(e) => setFormData({ ...formData, account_id: e.target.value })}
            >
              {accounts.map((a) => (
                <MenuItem key={a.account_id || a.id} value={a.account_id || a.id}>
                  {a.name}
                </MenuItem>
              ))}
              {accounts.length === 0 && <MenuItem value={1}>Default (Test)</MenuItem>}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} color="inherit">Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Add Transaction</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
