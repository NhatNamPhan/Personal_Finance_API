import { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Box, CircularProgress, Card, CardContent, Divider, Avatar } from '@mui/material';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownIcon from '@mui/icons-material/TrendingDownRounded';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import { useAuth } from '../context/AuthContext';
import { endpoints } from '../services/api';
import { format } from 'date-fns';

const StatCard = ({ title, value, icon, color, trend }) => (
  <Card sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="body2" color="text.secondary" fontWeight="600" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" fontWeight="bold">
            {value}
          </Typography>
        </Box>
        <Avatar
          sx={{
            bgcolor: `${color}15`,
            color: color,
            width: 48,
            height: 48,
            borderRadius: 3,
          }}
        >
          {icon}
        </Avatar>
      </Box>
      {trend && (
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, gap: 1 }}>
          <Typography
            variant="caption"
            sx={{
              color: trend >= 0 ? 'success.main' : 'error.main',
              bgcolor: trend >= 0 ? 'success.lighter' : 'error.lighter', // custom palette or alpha
              px: 0.5,
              borderRadius: 0.5,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {trend >= 0 ? '+' : ''}{trend}%
          </Typography>
          <Typography variant="caption" color="text.secondary">
            vs last month
          </Typography>
        </Box>
      )}
    </CardContent>
  </Card>
);

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch recent transactions
        const transRes = await endpoints.getTransactions(user.id);
        const transData = transRes.data.transactions || [];
        setTransactions(transData.slice(0, 5)); // Take first 5 relevant ones

        // Calculate basic summary from all fetched transactions (simple client-side logic for now)
        // Ideally backend provides this or we fetch all. Assuming fetch returns substantial amount or we use analytics endpoint.
        // Let's try analytics endpoint too?
        // const analyticsRes = await endpoints.getAnalytics(user.id);

        let inc = 0, exp = 0;
        transData.forEach(t => {
          if (t.type === 'income') inc += parseFloat(t.amount);
          if (t.type === 'expense') exp += parseFloat(t.amount);
        });

        setSummary({
          income: inc,
          expense: exp,
          balance: inc - exp
        });

      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  // Mock data for the chart if real data is sparse
  const chartData = [
    { name: 'Mon', amount: 4000 },
    { name: 'Tue', amount: 3000 },
    { name: 'Wed', amount: 2000 },
    { name: 'Thu', amount: 2780 },
    { name: 'Fri', amount: 1890 },
    { name: 'Sat', amount: 2390 },
    { name: 'Sun', amount: 3490 },
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4" fontWeight="bold">Dashboard</Typography>
        <Typography color="text.secondary">Overview of your financial health</Typography>
      </Grid>

      {/* Summary Cards */}
      <Grid item xs={12} md={4}>
        <StatCard
          title="Total Balance"
          value={`$${summary.balance.toLocaleString()}`}
          icon={<AccountBalanceWalletIcon />}
          color="#0ea5e9" // sky blue
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <StatCard
          title="Total Income"
          value={`$${summary.income.toLocaleString()}`}
          icon={<TrendingUpIcon />}
          color="#10b981" // emerald
          trend={12}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <StatCard
          title="Total Expenses"
          value={`$${summary.expense.toLocaleString()}`}
          icon={<TrendingDownIcon />}
          color="#ef4444" // red
          trend={-5}
        />
      </Grid>

      {/* Main Chart */}
      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 3, height: 400 }}>
          <Typography variant="h6" gutterBottom fontWeight="600">Spending Overview</Typography>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="amount" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorAmount)" />
            </AreaChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      {/* Recent Transactions Side List */}
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 3, height: 400, overflow: 'auto' }}>
          <Typography variant="h6" gutterBottom fontWeight="600">Recent Transactions</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {transactions.length > 0 ? (
              transactions.map((t) => (
                <Box key={t.transaction_id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="subtitle2" fontWeight="600">{t.description || t.category}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t.date ? format(new Date(t.date), 'MMM dd, yyyy') : 'No date'}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    color={t.type === 'income' ? 'success.main' : 'error.main'}
                  >
                    {t.type === 'income' ? '+' : '-'}${parseFloat(t.amount).toLocaleString()}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography color="text.secondary">No transactions found.</Typography>
            )}

            {/* Divider if needed */}
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}
