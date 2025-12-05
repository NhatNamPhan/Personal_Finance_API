-- Table Users
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table accounts
CREATE TABLE accounts (
    account_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    balance DECIMAL(15,2) DEFAULT 0.00,
    type VARCHAR(50) NOT NULL CHECK (
        type IN ('checking', 'savings', 'credit_card', 'cash')
    ), 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table categories
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE
);

-- Table transactions
CREATE TABLE transactions (
    transaction_id SERIAL PRIMARY KEY,
    account_id INTEGER REFERENCES accounts(account_id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(category_id),
    amount DECIMAL(15,2) NOT NULL,
    date DATE NOT NULL,
    description TEXT,
    type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table budgets
CREATE TABLE budgets (
    budget_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(category_id),
    amount DECIMAL(15,2) NOT NULL,
    month DATE NOT NULL, -- First day of the month
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 1. Insert Users
INSERT INTO users (name, email, created_at) VALUES
('John Smith', 'john.smith@email.com', '2023-06-15 09:30:00'),
('Emma Johnson', 'emma.j@email.com', '2023-07-20 14:45:00'),
('Michael Chen', 'michael.chen@email.com', '2023-08-10 11:20:00'),
('Sarah Williams', 'sarah.w@email.com', '2023-09-05 16:10:00'),
('David Miller', 'david.m@email.com', '2023-10-12 13:25:00');

-- 2. Insert Accounts
INSERT INTO accounts (user_id, name, balance, type, created_at) VALUES
-- User 1 Accounts
(1, 'Chase Checking', 12500.00, 'checking', '2023-06-20'),
(1, 'Bank of America Savings', 35000.00, 'savings', '2023-06-25'),
(1, 'Citi Credit Card', -1250.50, 'credit_card', '2023-07-01'),
(1, 'Cash Wallet', 500.00, 'cash', '2023-07-05'),

-- User 2 Accounts
(2, 'Wells Fargo Checking', 8500.75, 'checking', '2023-07-22'),
(2, 'High-Yield Savings', 42000.00, 'savings', '2023-07-25'),
(2, 'American Express', -3200.00, 'credit_card', '2023-08-01'),

-- User 3 Accounts
(3, 'Business Account', 27500.00, 'checking', '2023-08-12'),
(3, 'Investment Account', 125000.00, 'savings', '2023-08-15'),
(3, 'Chase Sapphire', -4500.75, 'credit_card', '2023-08-20'),

-- User 4 Accounts
(4, 'Local Credit Union', 9500.25, 'checking', '2023-09-10'),
(4, 'Emergency Fund', 18000.00, 'savings', '2023-09-12'),
(4, 'Discover Card', -1800.00, 'credit_card', '2023-09-15'),

-- User 5 Accounts
(5, 'Retirement Checking', 32000.00, 'checking', '2023-10-15'),
(5, 'Senior Savings', 45000.00, 'savings', '2023-10-18'),
(5, 'Mastercard', -950.25, 'credit_card', '2023-10-20');

-- 3. Insert Categories
INSERT INTO categories (name, type, user_id) VALUES
-- User 1 Categories
('Salary', 'income', 1),
('Freelance Income', 'income', 1),
('Investment Returns', 'income', 1),
('Groceries', 'expense', 1),
('Dining Out', 'expense', 1),
('Transportation', 'expense', 1),
('Entertainment', 'expense', 1),
('Shopping', 'expense', 1),
('Utilities', 'expense', 1),
('Healthcare', 'expense', 1),

-- User 2 Categories
('Monthly Salary', 'income', 2),
('Bonus', 'income', 2),
('Food & Dining', 'expense', 2),
('Travel', 'expense', 2),
('Education', 'expense', 2),
('Subscriptions', 'expense', 2),

-- User 3 Categories
('Business Income', 'income', 3),
('Dividends', 'income', 3),
('Rent', 'expense', 3),
('Car Payment', 'expense', 3),
('Insurance', 'expense', 3),
('Gifts & Donations', 'expense', 3),

-- User 4 Categories
('Full-time Job', 'income', 4),
('Part-time Job', 'income', 4),
('Home Maintenance', 'expense', 4),
('Childcare', 'expense', 4),
('Fitness', 'expense', 4),

-- User 5 Categories
('Retirement Pension', 'income', 5),
('Social Security', 'income', 5),
('Medical Expenses', 'expense', 5),
('Hobbies', 'expense', 5),
('Charity', 'expense', 5);

-- 4. Insert Transactions (January 2024 data)
INSERT INTO transactions (account_id, category_id, amount, date, description, type, created_at) VALUES
-- User 1 Transactions (Mixed income/expense)
-- January 2024
(1, 1, 5500.00, '2024-01-01', 'Monthly Salary Deposit', 'income', '2024-01-01 08:30:00'),
(1, 4, 85.75, '2024-01-02', 'Whole Foods Groceries', 'expense', '2024-01-02 18:45:00'),
(1, 5, 42.50, '2024-01-03', 'Starbucks Coffee', 'expense', '2024-01-03 07:15:00'),
(1, 6, 25.00, '2024-01-04', 'Uber to Work', 'expense', '2024-01-04 08:20:00'),
(1, 2, 1200.00, '2024-01-05', 'Freelance Web Design', 'income', '2024-01-05 14:00:00'),
(1, 7, 65.00, '2024-01-06', 'Movie Tickets', 'expense', '2024-01-06 20:30:00'),
(1, 8, 129.99, '2024-01-07', 'Amazon Shopping', 'expense', '2024-01-07 15:45:00'),
(1, 9, 135.25, '2024-01-08', 'Electricity Bill', 'expense', '2024-01-08 09:00:00'),
(1, 10, 75.50, '2024-01-09', 'Pharmacy Prescription', 'expense', '2024-01-09 11:30:00'),
(1, 4, 120.00, '2024-01-10', 'Costco Bulk Shopping', 'expense', '2024-01-10 16:20:00'),

-- More User 1 Transactions
(1, 5, 85.00, '2024-01-12', 'Italian Restaurant Dinner', 'expense', '2024-01-12 19:45:00'),
(1, 6, 45.00, '2024-01-13', 'Gas Station Fuel', 'expense', '2024-01-13 10:15:00'),
(1, 3, 350.00, '2024-01-15', 'Stock Dividend Payment', 'income', '2024-01-15 12:00:00'),
(1, 7, 40.00, '2024-01-16', 'Netflix & Spotify', 'expense', '2024-01-16 08:30:00'),
(1, 8, 299.99, '2024-01-18', 'New Headphones', 'expense', '2024-01-18 14:20:00'),

-- User 2 Transactions
(5, 11, 6200.00, '2024-01-01', 'Monthly Salary', 'income', '2024-01-01 09:00:00'),
(5, 13, 75.25, '2024-01-03', 'Trader Joes Groceries', 'expense', '2024-01-03 17:30:00'),
(5, 13, 52.80, '2024-01-05', 'Sushi Dinner', 'expense', '2024-01-05 20:15:00'),
(5, 14, 450.00, '2024-01-10', 'Flight to Chicago', 'expense', '2024-01-10 11:45:00'),
(5, 12, 1500.00, '2024-01-15', 'Annual Bonus', 'income', '2024-01-15 13:00:00'),
(5, 15, 299.00, '2024-01-18', 'Online Course Purchase', 'expense', '2024-01-18 15:30:00'),
(5, 16, 14.99, '2024-01-20', 'Monthly Netflix', 'expense', '2024-01-20 08:45:00'),

-- User 3 Transactions
(8, 17, 8500.00, '2024-01-01', 'Business Revenue', 'income', '2024-01-01 10:00:00'),
(8, 20, 1200.00, '2024-01-03', 'Monthly Rent Payment', 'expense', '2024-01-03 09:00:00'),
(8, 21, 450.00, '2024-01-05', 'Car Loan Payment', 'expense', '2024-01-05 14:30:00'),
(8, 18, 250.00, '2024-01-10', 'Stock Dividends', 'income', '2024-01-10 12:00:00'),
(8, 22, 185.75, '2024-01-12', 'Car Insurance', 'expense', '2024-01-12 11:15:00'),
(8, 23, 100.00, '2024-01-15', 'Charity Donation', 'expense', '2024-01-15 16:45:00'),

-- User 4 Transactions
(11, 24, 4800.00, '2024-01-01', 'Full-time Job Salary', 'income', '2024-01-01 08:30:00'),
(11, 25, 1200.00, '2024-01-05', 'Part-time Job Payment', 'income', '2024-01-05 19:00:00'),
(11, 27, 800.00, '2024-01-07', 'Monthly Childcare', 'expense', '2024-01-07 09:15:00'),
(11, 26, 350.00, '2024-01-10', 'Home Repair - Plumbing', 'expense', '2024-01-10 14:30:00'),
(11, 28, 75.00, '2024-01-15', 'Gym Membership', 'expense', '2024-01-15 07:45:00'),

-- User 5 Transactions
(14, 29, 3200.00, '2024-01-01', 'Monthly Pension', 'income', '2024-01-01 10:00:00'),
(14, 30, 1450.00, '2024-01-03', 'Social Security Payment', 'income', '2024-01-03 11:30:00'),
(14, 31, 250.00, '2024-01-05', 'Doctor Visit Co-pay', 'expense', '2024-01-05 13:45:00'),
(14, 32, 85.00, '2024-01-10', 'Gardening Supplies', 'expense', '2024-01-10 15:20:00'),
(14, 32, 200.00, '2024-01-15', 'Local Food Bank Donation', 'expense', '2024-01-15 12:00:00');

-- 5. Insert Budgets for January 2024
INSERT INTO budgets (user_id, category_id, amount, month, created_at) VALUES
-- User 1 Budgets
(1, 4, 400.00, '2024-01-01', '2023-12-28'),    -- Groceries
(1, 5, 200.00, '2024-01-01', '2023-12-28'),    -- Dining Out
(1, 6, 150.00, '2024-01-01', '2023-12-28'),    -- Transportation
(1, 7, 100.00, '2024-01-01', '2023-12-28'),    -- Entertainment
(1, 8, 300.00, '2024-01-01', '2023-12-28'),    -- Shopping
(1, 9, 150.00, '2024-01-01', '2023-12-28'),    -- Utilities
(1, 10, 100.00, '2024-01-01', '2023-12-28'),   -- Healthcare

-- User 2 Budgets
(2, 13, 300.00, '2024-01-01', '2023-12-29'),   -- Food & Dining
(2, 14, 500.00, '2024-01-01', '2023-12-29'),   -- Travel
(2, 15, 200.00, '2024-01-01', '2023-12-29'),   -- Education
(2, 16, 50.00, '2024-01-01', '2023-12-29'),    -- Subscriptions

-- User 3 Budgets
(3, 20, 1200.00, '2024-01-01', '2023-12-30'),  -- Rent
(3, 21, 450.00, '2024-01-01', '2023-12-30'),   -- Car Payment
(3, 22, 200.00, '2024-01-01', '2023-12-30'),   -- Insurance
(3, 23, 150.00, '2024-01-01', '2023-12-30'),   -- Gifts & Donations

-- User 4 Budgets
(4, 26, 400.00, '2024-01-01', '2023-12-31'),   -- Home Maintenance
(4, 27, 800.00, '2024-01-01', '2023-12-31'),   -- Childcare
(4, 28, 100.00, '2024-01-01', '2023-12-31'),   -- Fitness

-- User 5 Budgets
(5, 31, 300.00, '2024-01-01', '2024-01-01'),   -- Medical Expenses
(5, 32, 100.00, '2024-01-01', '2024-01-01'),   -- Hobbies
(5, 32, 250.00, '2024-01-01', '2024-01-01');   -- Charity