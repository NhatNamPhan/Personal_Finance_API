from fastapi import HTTPException
from src.core.db import get_db
from src.schemas.user import UserCreate
import psycopg2


class UserService:
    @staticmethod
    def create_user(user: UserCreate) -> dict:
        """Create a new user."""
        try:
            with get_db() as cur:
                cur.execute(
                    "INSERT INTO users(name, email) VALUES (%s, %s) RETURNING user_id",
                    (user.name, user.email)
                )
                new_id = cur.fetchone()[0]
                return {"message": "User added successfully", "user_id": new_id}
        except psycopg2.Error as e:
            raise HTTPException(status_code=500, detail=f"Database error: {e.pgerror}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
    
    @staticmethod
    def get_user_by_id(user_id: int) -> dict:
        """Get a user by ID."""
        try:
            with get_db() as cur:
                from src.app.utils.validators import check_exists
                check_exists("users", "user_id", user_id)
                cur.execute(
                    "SELECT * FROM users WHERE user_id = %s", (user_id,)
                )
                row = cur.fetchone()
                return {
                    "user_id": row[0],
                    "name": row[1],
                    "email": row[2]
                }
        except psycopg2.Error as e:
            raise HTTPException(status_code=500, detail=f"Database error: {e.pgerror}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

