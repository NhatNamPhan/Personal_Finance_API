import { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, LinearProgress, Card, CardContent, Divider } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { endpoints } from '../services/api';
import { format, startOfMonth, endOfMonth, parseISO } from 'date-fns';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { useSnackbar } from 'notistack';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#a4de6c'];

export default function Analytics() {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [netWorth, setNetWorth] = useState(null);
  const [spending, setSpending] = useState(null);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const today = new Date();
      const start = format(startOfMonth(today), 'yyyy-MM-dd');
      const end = format(endOfMonth(today), 'yyyy-MM-dd');
      const month = format(startOfMonth(today), 'yyyy-MM-dd');

      const [netRes, spendRes, budgRes] = await Promise.all([
        endpoints.getNetWorth(user.id).catch(e => console.error("NetWorth Error", e) || { data: { net_worth: 0 } }),
        endpoints.getSpending(user.id, start, end).catch(e => console.error("Spending Error", e) || { data: { by_category: [] } }),
        endpoints.getBudgetProgress(user.id, month).catch(e => console.error("Budget Error", e) || { data: { budgets: [] } })
      ]);

      setNetWorth(netRes.data?.net_worth || 0);
      setSpending(spendRes.data);
      setBudgets(budgRes.data?.budgets || []);

    } catch (error) {
      console.error(error);
      enqueueSnackbar('Failed to load some analytics data', { variant: 'warning' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Box p={4}><Typography>Loading Analytics...</Typography></Box>;

  const pieData = spending?.by_category?.filter(c => c.type === 'expense').map(c => ({
    name: c.name,
    value: parseFloat(c.total_amount)
  })) || [];

  return (
    <Box sx={{ pb: 5 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom mb={4}>Analytics & Reports</Typography>

      <Grid container spacing={3} mb={4}>
        {/* Net Worth Card */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%', bgcolor: 'primary.main', color: 'white' }}>
            <Typography variant="h6" gutterBottom opacity={0.9}>Net Worth</Typography>
            <Typography variant="h3" fontWeight="bold">
              ${parseFloat(netWorth || 0).toLocaleString()}
            </Typography>
            <Typography variant="body2" sx={{ mt: 2, opacity: 0.8 }}>
              Total Assets across all accounts
            </Typography>
          </Paper>
        </Grid>

        {/* Monthly Spending Summary */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">Monthly Spending (Expenses)</Typography>
            <Box sx={{ height: 300, width: '100%' }}>
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(value) => `$${value.toLocaleString()}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Box display="flex" height="100%" alignItems="center" justifyContent="center">
                  <Typography color="text.secondary">No expense data for this month</Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Budgets Section */}
      <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mt: 4, mb: 2 }}>Budget Progress</Typography>
      <Grid container spacing={3}>
        {budgets.length > 0 ? budgets.map((b, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Paper sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="h6">{b.category_name}</Typography>
                <Typography variant="body2" color={b.status === 'over_budget' ? 'error' : 'text.secondary'}>
                  {b.status.replace('_', ' ').toUpperCase()}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={Math.min(b.progress_percent, 100)}
                color={b.status === 'over_budget' ? 'error' : b.status === 'nearly_budget' ? 'warning' : 'primary'}
                sx={{ height: 10, borderRadius: 5, mb: 2 }}
              />
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Spent: ${parseFloat(b.spent).toLocaleString()}
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  Budget: ${parseFloat(b.budget_amount).toLocaleString()}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        )) : (
          <Grid item xs={12}>
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="text.secondary">No active budgets for this month.</Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
