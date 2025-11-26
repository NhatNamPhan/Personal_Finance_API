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

INSERT INTO users (name, email, created_at) VALUES
('Alice Walker', 'alice.walker@example.com', '2025-01-05 09:12:00'),
('Michael Johnson', 'michael.johnson@example.com', '2025-01-10 11:25:00'),
('Sarah Kim', 'sarah.kim@example.com', '2025-01-14 08:47:00'),
('David Brown', 'david.brown@example.com', '2025-01-20 18:20:00'),
('Emma Davis', 'emma.davis@example.com', '2025-01-22 14:10:00');

INSERT INTO accounts (user_id, name, balance, type, created_at) VALUES
(1, 'Chase Checking Account', 3250.75, 'checking', '2025-01-06 10:00:00'),
(2, 'Bank of America Savings', 8200.00, 'savings', '2025-01-12 15:30:00'),
(3, 'PayPal Wallet', 540.20, 'cash', '2025-01-15 09:45:00'),
(4, 'Capital One Credit Card', -1250.40, 'credit_card', '2025-01-21 19:00:00'),
(5, 'Cash Wallet', 180.00, 'cash', '2025-01-23 16:20:00');

INSERT INTO categories (name, type, user_id) VALUES
('Monthly Salary', 'income', 1),
('Dining Out', 'expense', 2),
('Public Transport', 'expense', 3),
('Entertainment', 'expense', 4),
('Freelance Work', 'income', 5);

INSERT INTO transactions (account_id, category_id, amount, date, description, type, created_at) VALUES
(1, 1, 4800.00, '2025-02-01', 'February salary deposited', 'income', '2025-02-01 08:00:00'),
(2, 2, 42.50, '2025-02-03', 'Lunch at Italian restaurant', 'expense', '2025-02-03 13:20:00'),
(3, 3, 3.00, '2025-02-05', 'Subway ticket to campus', 'expense', '2025-02-05 07:50:00'),
(4, 4, 18.99, '2025-02-07', 'Netflix monthly subscription', 'expense', '2025-02-07 21:10:00'),
(5, 5, 600.00, '2025-02-10', 'Payment for design project', 'income', '2025-02-10 10:35:00');

INSERT INTO budgets (user_id, category_id, amount, month, created_at) VALUES
(1, 1, 5000.00, '2025-02-01', '2025-02-01 09:00:00'),
(2, 2, 300.00, '2025-02-01', '2025-02-01 09:10:00'),
(3, 3, 100.00, '2025-02-01', '2025-02-01 09:20:00'),
(4, 4, 150.00, '2025-02-01', '2025-02-01 09:30:00'),
(5, 5, 1200.00, '2025-02-01', '2025-02-01 09:40:00');