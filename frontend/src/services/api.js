import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response || error.message);
    return Promise.reject(error);
  }
);

export const endpoints = {
  // Transactions
  getTransactions: (userId, params) => api.get('/transactions', { params: { user_id: userId, ...params } }),
  addTransaction: (data) => api.post('/transactions', data),
  deleteTransaction: (id) => api.delete(`/transactions/${id}`),
  updateTransaction: (id, data) => api.put(`/transactions/${id}`, data),

  // Analytics (deduced from router file existence, though I didn't verify exact paths, assuming standard)
  // Analytics
  getSpending: (userId, start, end) => api.get(`/analytics/users/${userId}/spending`, { params: { start_date: start, end_date: end } }),
  getBudgetProgress: (userId, month) => api.get(`/analytics/users/${userId}/budgets/progress`, { params: { month } }),
  getNetWorth: (userId) => api.get(`/analytics/users/${userId}/net-worth`),

  // Accounts
  getAccounts: (userId) => api.get('/accounts', { params: { user_id: userId } }),

  // Categories
  getCategories: (userId) => api.get('/categories', { params: { user_id: userId } }),

  // User (check existence)
  checkUser: (userId) => api.get(`/users/${userId}`), // Assuming this exists or similar
};

export default api;
