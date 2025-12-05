from fastapi import APIRouter, HTTPException
from app.database import get_db
from app.utils import check_exists
from datetime import date
import psycopg2

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/users/{user_id}/spending")
async def get_spending(user_id: int, start_date: date, end_date: date):
    try:
        with get_db() as cur:
            check_exists("users", "user_id", user_id)
            cur.execute('''
                SELECT 
                    u.user_id,
                    SUM(t.amount) FILTER (WHERE t.type = 'income') AS total_income,
                    SUM(t.amount) FILTER (WHERE t.type = 'expense') AS total_expense,
	                (SUM(t.amount) FILTER (WHERE t.type = 'income')
	                - SUM(t.amount) FILTER (WHERE t.type = 'expense')) AS net
                FROM transactions t
                JOIN accounts a ON a.account_id = t.account_id
                JOIN users u ON u.user_id = a.user_id
                WHERE u.user_id = %s AND t.date BETWEEN %s AND %s
                GROUP BY u.user_id;   
            ''', (user_id, start_date, end_date))
            row_summary = cur.fetchone()
            if row_summary is None:
               return {
                   "user_id": user_id,
                    "start_date": start_date,
                    "end_date": end_date,
                    "summary": {
                        "total_income": 0,
                        "total_expense": 0,
                        "net": 0
                    },
                    "by_category": []
                } 
            cur.execute('''
                SELECT u.user_id, c.category_id, c.name, t.type, sum(amount) as total_amount
                FROM transactions t
                JOIN accounts a ON a.account_id = t.account_id
                JOIN users u ON u.user_id = a.user_id
                JOIN categories c ON c.category_id = t.category_id
                WHERE u.user_id = %s AND t.date BETWEEN %s AND %s
                GROUP BY u.user_id, c.category_id, c.name, t.type;
            ''', (user_id, start_date, end_date))
            rows = cur.fetchall()
            summary = {
                "total_income": row_summary[1],
                "total_expense": row_summary[2],
                "net": row_summary[3]
            }
            categories = [{
                "category_id": row[1],
                "name": row[2],
                "type": row[3],
                "total_amount": row[4]
            } for row in rows]
            return {
                "user_id": user_id,
                "start_date": start_date,
                "end_date": end_date,
                "summary": summary,
                "by_category": categories
            }
    except psycopg2.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e.pgerror}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/users/{user_id}/budgets/progress")
async def get_progress(user_id: int, month: date):
    try:
        with get_db() as cur:
            check_exists("users", "user_id", user_id)
            cur.execute('''
                WITH spent AS (
                    SELECT t.category_id, SUM(t.amount) AS spent
                    FROM transactions t
                    JOIN accounts a ON a.account_id = t.account_id
                    WHERE a.user_id = %s AND t.type = 'expense'
                    GROUP BY t.category_id
                )
                SELECT 
                    b.user_id,
                    b.category_id,
                    c.name,
                    b.amount AS budget_amount,
                    COALESCE(s.spent, 0) AS spent,
                	b.amount - COALESCE(s.spent, 0) AS remaining,
                	ROUND((COALESCE(s.spent, 0) / b.amount) * 100, 2) AS progress_percent,
                	CASE 
                		WHEN COALESCE(s.spent, 0) < b.amount * 0.9 THEN 'under_budget'
                		WHEN COALESCE(s.spent, 0) >=  b.amount * 0.9 
                            AND COALESCE(s.spent, 0) <= b.amount THEN 'nearly_budget'
                		WHEN COALESCE(s.spent, 0) > b.amount THEN 'over_budget'
                	END AS status
                FROM budgets b
                JOIN categories c ON c.category_id = b.category_id
                LEFT JOIN spent s ON s.category_id = b.category_id
                WHERE b.user_id = %s
                  AND b.month = %s 
                ''', (user_id, user_id, month))
            rows = cur.fetchall()
            budgets = [{
                "category_id": row[1],
                "category_name": row[2],
                "budget_amount": row[3],
                "spent": row[4],
                "remaining": row[5],
                "progress_percent": row[6],
                "status": row[7]
            } for row in rows]
            return {
                "user_id": user_id,
                "month": month,
                "budgets": budgets
            }
    except psycopg2.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e.pgerror}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/users/{user_id}/net-worth")
async def get_new_worth(user_id: int):
    try:
        with get_db() as cur:
            check_exists("users", "user_id", user_id)
            cur.execute('''
                SELECT user_id, sum(balance) AS net_worth
                FROM accounts
                WHERE user_id = %s
                GROUP BY user_id
            ''', (user_id,))
            net_worth = cur.fetchone()
            cur.execute('''
                SELECT account_id, name, balance, type
                FROM accounts
                WHERE user_id = %s 
            ''', (user_id,))
            rows = cur.fetchall()
            accounts = [{
                "accounts": row[0],
                "name": row[1],
                "balance": row[2],
                "type": row[3]
            } for row in rows]
            return {
                "user_id": user_id,
                "net_worth": net_worth[1],
                "accounts": accounts
            }
    except psycopg2.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e.pgerror}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")



