from fastapi import APIRouter, HTTPException
from app.database import get_db
from app.models import Transaction
from app.utils import check_exists
import psycopg2
from datetime import date

router = APIRouter(prefix="/transactions", tags=['Transactions'])

@router.post("")
async def add_trans(trans: Transaction):
    try:
        with get_db() as cur:
            cur.execute(
                "INSERT INTO transactions(account_id, category_id, amount, date, description, type) VALUES(%s, %s, %s, %s, %s, %s) RETURNING transaction_id",
                (trans.account_id, trans.category_id, trans.amount, trans.date, trans.description, trans.type)
            )
            new_id = cur.fetchone()[0]
            return {"message": "Transaction added successfully", "transaction_id": new_id}
    except psycopg2.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e.pgerror}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("")
async def get_trans_by_user_or_date(
    user_id: int,
    start_date: date | None = None,
    end_date: date | None = None
):
    try:
        with get_db() as cur:
            check_exists("users", "user_id", user_id)
            if start_date is None or end_date is None:
                cur.execute('''
                    SELECT u.user_id, u.name, trans.transaction_id, ca.name, trans.description,
                        trans.amount, trans.date, trans.type
                    FROM transactions trans
                    JOIN accounts acc ON acc.account_id = trans.account_id
                    JOIN users u ON u.user_id = acc.user_id
                    JOIN categories ca ON ca.category_id = trans.category_id
                    WHERE u.user_id = %s
                    ORDER BY trans.date DESC
                ''', (user_id,))
                rows = cur.fetchall()
                if not rows:
                    return {
                        "user_id": user_id,
                        "transactions": []
                    }
                
                transactions = [{
                    "transaction_id": row[2],
                    "category": row[3],
                    "description": row[4],
                    "amount": row[5],
                    "date": row[6],
                    "type": row[7]
                } for row in rows]
                return {
                    "user_id": rows[0][0],
                    "name": rows[0][1],
                    "transactions": transactions
                }
            else:
                cur.execute('''
                    SELECT u.user_id, u.name, trans.transaction_id, ca.name, trans.description,
                        trans.amount, trans.date, trans.type
                    FROM transactions trans
                    JOIN accounts acc ON acc.account_id = trans.account_id
                    JOIN users u ON u.user_id = acc.user_id
                    JOIN categories ca ON ca.category_id = trans.category_id
                    WHERE u.user_id = %s 
                        AND trans.date BETWEEN %s AND %s
                    ORDER BY trans.date DESC
                ''', (user_id, start_date, end_date))
                rows = cur.fetchall()
                
                if not rows:
                    return {
                        "user_id": user_id,
                        "transactions": []
                    }

                transactions = [{
                    "transaction_id": row[2],
                    "category": row[3],
                    "description": row[4],
                    "amount": row[5],
                    "date": row[6],
                    "type": row[7]
                } for row in rows]
                return {
                    "user_id": rows[0][0],
                    "name": rows[0][1],
                    "transactions": transactions
                }
    except psycopg2.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e.pgerror}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/{trans_id}")
async def get_transaction_by_id(trans_id: int):
    try:
        with get_db() as cur:
            check_exists("transactions", "transaction_id", trans_id)
            cur.execute(
                "SELECT * FROM transactions WHERE transaction_id = %s", (trans_id,)
            )
            row = cur.fetchone()
            return {
                "transaction_id": row[0],
                "account_id": row[1],
                "category_id": row[2],
                "amount": row[3],
                "date": row[4],
                "description": row[5],
                "type": row[6],
                "created_at": row[7]
            }
    except psycopg2.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e.pgerror}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
    
