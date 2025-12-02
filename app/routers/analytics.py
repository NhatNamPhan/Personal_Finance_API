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
