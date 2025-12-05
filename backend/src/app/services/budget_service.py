from fastapi import HTTPException
from src.core.db import get_db
from src.schemas.budget import BudgetCreate, BudgetUpdate
from src.app.utils.validators import check_exists
import psycopg2
from datetime import date


class BudgetService:
    @staticmethod
    def create_budget(budget: BudgetCreate) -> dict:
        """Create a new budget."""
        try:
            with get_db() as cur:
                cur.execute(
                    "INSERT INTO budgets(user_id, category_id, amount, month) VALUES(%s, %s, %s, %s) RETURNING budget_id",
                    (budget.user_id, budget.category_id, budget.amount, budget.month)
                )
                new_id = cur.fetchone()[0]
                return {"message": "Budget added successfully", "budget_id": new_id}
        except psycopg2.Error as e:
            raise HTTPException(status_code=500, detail=f"Database error: {e.pgerror}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
    
    @staticmethod
    def get_budgets(user_id: int, month: date | None = None) -> dict:
        """Get budgets for a user, optionally filtered by month."""
        try:
            with get_db() as cur:
                check_exists("users", "user_id", user_id)
                if month is None:
                    cur.execute(
                        "SELECT * FROM budgets WHERE user_id = %s", (user_id,)
                    )
                    rows = cur.fetchall()
                    budgets = [{
                        "budget_id": row[0],
                        "category_id": row[2],
                        "amount": row[3],
                        "month": row[4]
                    } for row in rows]
                    return {
                        "user_id": user_id,
                        "budgets": budgets
                    }
                else:
                    cur.execute('''
                        SELECT * FROM budgets
                        WHERE user_id = %s 
                            AND month = %s
                    ''', (user_id, month))
                    rows = cur.fetchall()
                    budgets = [{
                        "budget_id": row[0],
                        "category_id": row[2],
                        "amount": row[3],  
                    } for row in rows]
                    return {
                        "user_id": user_id,
                        "month": month,
                        "budgets": budgets
                    }
        except psycopg2.Error as e:
            raise HTTPException(status_code=500, detail=f"Database error : {e.pgerror}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
    
    @staticmethod
    def get_budget_by_id(budget_id: int) -> dict:
        """Get a budget by ID."""
        try:
            with get_db() as cur:
                check_exists("budgets", "budget_id", budget_id)
                cur.execute(
                    "SELECT * FROM budgets WHERE budget_id = %s", (budget_id,)
                )
                row = cur.fetchone()
                return {
                    "budget_id": row[0],
                    "user_id": row[1],
                    "category_id": row[2],
                    "amount": row[3],
                    "month": row[4],
                    "created_at": row[5]
                }
        except psycopg2.Error as e:
            raise HTTPException(status_code=500, detail=f"Database error: {e.pgerror}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
    
    @staticmethod
    def update_budget(budget_id: int, update: BudgetUpdate) -> dict:
        """Update a budget."""
        try:
            with get_db() as cur:
                check_exists("budgets", "budget_id", budget_id)
                cur.execute('''
                    UPDATE budgets
                    SET amount = %s,
                        month = %s
                    WHERE budget_id = %s
                    RETURNING budget_id, user_id, category_id, amount, month, created_at
                ''', (update.amount, update.month, budget_id))
                row = cur.fetchone()
                return {
                    "budget_id": row[0],
                    "user_id": row[1],
                    "category_id": row[2],
                    "amount": row[3],
                    "month": row[4],
                    "created_at": row[5]
                }
        except psycopg2.Error as e:
            raise HTTPException(status_code=500, detail=f"Database error: {e.pgerror}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
    
    @staticmethod
    def delete_budget(budget_id: int) -> dict:
        """Delete a budget."""
        try:
            with get_db() as cur:
                check_exists("budgets", "budget_id", budget_id)
                cur.execute(
                    "DELETE FROM budgets WHERE budget_id = %s", (budget_id,)
                )        
                return {"message": f"Budget with id {budget_id} has been deleted successfully"}    
        except psycopg2.Error as e:
            raise HTTPException(status_code=500, detail=f"Database error: {e.pgerror}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

