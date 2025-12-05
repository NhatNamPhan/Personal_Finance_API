from fastapi import HTTPException
from src.core.db import get_db
from src.schemas.account import AccountCreate
from src.app.utils.validators import check_exists
import psycopg2


class AccountService:
    @staticmethod
    def create_account(account: AccountCreate) -> dict:
        """Create a new account."""
        try:
            with get_db() as cur:
                cur.execute(
                    "INSERT INTO accounts(user_id, name, balance, type) VALUES(%s, %s, %s, %s) RETURNING account_id",
                    (account.user_id, account.name, account.balance, account.type)
                )
                new_id = cur.fetchone()[0]
                return {"message": "Account added successful", "account_id": new_id}
        except psycopg2.Error as e:
            raise HTTPException(status_code=500, detail=f"Database error: {e.pgerror}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
    
    @staticmethod
    def get_accounts_by_user_id(user_id: int) -> dict:
        """Get all accounts for a user."""
        try:
            with get_db() as cur:
                check_exists("users", "user_id", user_id)
                cur.execute(
                    "SELECT * FROM accounts WHERE user_id = %s", (user_id,)
                )
                rows = cur.fetchall()
                accounts = [{
                    "account_id": row[0],
                    "name": row[2],
                    "balance": row[3],
                    "type": row[4]
                } for row in rows]
                return {
                    "user_id": user_id,
                    "accounts": accounts
                }
        except psycopg2.Error as e:
            raise HTTPException(status_code=500, detail=f"Database error: {e.pgerror}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

