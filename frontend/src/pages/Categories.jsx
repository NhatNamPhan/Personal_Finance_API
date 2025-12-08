import { useState, useEffect } from 'react';
import { Box, Button, Typography, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Chip, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { DataGrid } from '@mui/x-data-grid';
import { useAuth } from '../context/AuthContext';
import { endpoints } from '../services/api';
import { useSnackbar } from 'notistack';
import api from '../services/api'; // Direct axios access for custom calls if needed

const columns = [
  { field: 'name', headerName: 'Name', flex: 1 },
  {
    field: 'type',
    headerName: 'Type',
    width: 150,
    renderCell: (params) => (
      <Chip
        label={params.value.toUpperCase()}
        color={params.value === 'income' ? 'success' : 'error'}
        size="small"
        variant="outlined"
      />
    )
  },
];

export default function Categories() {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', type: 'expense' });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await endpoints.getCategories(user.id);
      // Ensure unique ID for DataGrid
      const data = (res.data.categories || []).map((c, index) => ({
        id: c.category_id || index, // Fallback index if id missing
        ...c
      }));
      setRows(data);
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Failed to load categories', { variant: 'error' });
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
      await api.post('/categories', { ...formData, user_id: user.id });
      enqueueSnackbar('Category added!', { variant: 'success' });
      fetchData();
      handleClose();
      setFormData({ name: '', type: 'expense' });
    } catch (error) {
      enqueueSnackbar('Failed to add category', { variant: 'error' });
    }
  };

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">Categories</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
          sx={{ borderRadius: 2 }}
        >
          Add Category
        </Button>
      </Box>

      <Paper sx={{ height: '100%', width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          pageSizeOptions={[10, 25]}
          checkboxSelection
          disableRowSelectionOnClick
          sx={{
            border: 'none',
            '& .MuiDataGrid-cell:focus': { outline: 'none' },
          }}
        />
      </Paper>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add Category</DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Name"
            fullWidth
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            label="Type"
            select
            fullWidth
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <MenuItem value="expense">Expense</MenuItem>
            <MenuItem value="income">Income</MenuItem>
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
