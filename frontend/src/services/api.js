// API service for backend communication
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

class ApiService {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || 'An error occurred');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Users
  async createUser(userData) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getUser(userId) {
    return this.request(`/users/${userId}`);
  }

  // Accounts
  async createAccount(accountData) {
    return this.request('/accounts', {
      method: 'POST',
      body: JSON.stringify(accountData),
    });
  }

  async getAccounts(userId) {
    return this.request(`/accounts?user_id=${userId}`);
  }

  // Categories
  async createCategory(categoryData) {
    return this.request('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  async getCategories(userId, type = null) {
    const url = type 
      ? `/categories?user_id=${userId}&type=${type}`
      : `/categories?user_id=${userId}`;
    return this.request(url);
  }

  async getCategory(categoryId) {
    return this.request(`/categories/${categoryId}`);
  }

  async updateCategory(categoryId, categoryData) {
    return this.request(`/categories/${categoryId}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  }

  async deleteCategory(categoryId) {
    return this.request(`/categories/${categoryId}`, {
      method: 'DELETE',
    });
  }

  // Transactions
  async createTransaction(transactionData) {
    return this.request('/transactions', {
      method: 'POST',
      body: JSON.stringify(transactionData),
    });
  }

  async getTransactions(userId, startDate = null, endDate = null) {
    let url = `/transactions?user_id=${userId}`;
    if (startDate) url += `&start_date=${startDate}`;
    if (endDate) url += `&end_date=${endDate}`;
    return this.request(url);
  }

  async getTransaction(transactionId) {
    return this.request(`/transactions/${transactionId}`);
  }

  // Budgets
  async createBudget(budgetData) {
    return this.request('/budgets', {
      method: 'POST',
      body: JSON.stringify(budgetData),
    });
  }

  async getBudgets(userId, month = null) {
    let url = `/budgets?user_id=${userId}`;
    if (month) url += `&month=${month}`;
    return this.request(url);
  }

  async getBudget(budgetId) {
    return this.request(`/budgets/${budgetId}`);
  }

  async updateBudget(budgetId, budgetData) {
    return this.request(`/budgets/${budgetId}`, {
      method: 'PUT',
      body: JSON.stringify(budgetData),
    });
  }

  async deleteBudget(budgetId) {
    return this.request(`/budgets/${budgetId}`, {
      method: 'DELETE',
    });
  }

  // Analytics
  async getSpending(userId, startDate, endDate) {
    return this.request(`/analytics/users/${userId}/spending?start_date=${startDate}&end_date=${endDate}`);
  }

  async getBudgetProgress(userId, month) {
    return this.request(`/analytics/users/${userId}/budgets/progress?month=${month}`);
  }

  async getNetWorth(userId) {
    return this.request(`/analytics/users/${userId}/net-worth`);
  }
}

export default new ApiService();

