TRUNCATE TABLE 
    budgets, 
    transactions, 
    categories, 
    accounts, 
    users
RESTART IDENTITY CASCADE;

SELECT * FROM users;
SELECT * FROM accounts;
SELECT * FROM categories;
SELECT * FROM transactions;
SELECT * FROM budgets;


SELECT 
    u.user_id,
    SUM(t.amount) FILTER (WHERE t.type = 'income') AS total_income,
    SUM(t.amount) FILTER (WHERE t.type = 'expense') AS total_expense,
	(SUM(t.amount) FILTER (WHERE t.type = 'income')
	- SUM(t.amount) FILTER (WHERE t.type = 'expense')) AS net
FROM transactions t
JOIN accounts a ON a.account_id = t.account_id
JOIN users u ON u.user_id = a.user_id
WHERE u.user_id = 1 AND t.date BETWEEN '2024-01-01' AND '2024-05-01'
GROUP BY u.user_id;

SELECT u.user_id, c.category_id, c.name, t.type, sum(amount) as total_amount
FROM transactions t
JOIN accounts a ON a.account_id = t.account_id
JOIN users u ON u.user_id = a.user_id
JOIN categories c ON c.category_id = t.category_id
WHERE u.user_id = 1 AND t.date BETWEEN '2024-01-01' AND '2024-05-01'
GROUP BY u.user_id, c.category_id, c.name, t.type


WITH spent AS (
    SELECT t.category_id, SUM(t.amount) AS spent
    FROM transactions t
    JOIN accounts a ON a.account_id = t.account_id
    WHERE a.user_id = 1 AND t.type = 'expense'
    GROUP BY t.category_id
)
SELECT 
    b.user_id,
    b.category_id,
    c.name,
    b.amount AS budget_amount,
    COALESCE(s.spent, 0) AS spent,
	b.amount - COALESCE(s.spent, 0) AS remaining,
	ROUND((COALESCE(s.spent, 0) / b.amount) * 100, 2) AS progree_percent,
	CASE 
		WHEN s.spent < b.amount * 0.9 THEN 'under_budget'
		WHEN s.spent >=  b.amount * 0.9 AND s.spent <= b.amount THEN 'nearly_budget'
		WHEN s.spent > b.amount THEN 'over_budget'
	END AS status
FROM budgets b
JOIN categories c ON c.category_id = b.category_id
LEFT JOIN spent s ON s.category_id = b.category_id
WHERE b.user_id = 1
  AND b.month = '2024-01-01'


SELECT user_id, sum(balance) AS net_worth
FROM accounts
WHERE user_id = 1
GROUP BY user_id

SELECT account_id, name, balance, type
FROM accounts
WHERE user_id = 1


CREATE OR REPLACE FUNCTION update_account_balance()
RETURNs trigger AS $$
BEGIN
	IF NEW.type = 'income' THEN
		UPDATE accounts
		SET balance = balance + NEW.amount
		WHERE account_id = NEW.account_id;
	ELSE
		UPDATE accounts
		SET balance = balance - NEW.amount
		WHERE account_id = NEW.account_id;
	END IF;

	RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER trg_update_balance
AFTER INSERT ON transactions
FOR EACH ROW
EXECUTE FUNCTION update_account_balance();















