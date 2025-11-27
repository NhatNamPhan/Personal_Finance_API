from fastapi import APIRouter, HTTPException
from app.models import User
from app.database import get_db
import psycopg2
from app.utils import check_exists

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("")
async def add_user(user: User):
    try:
        with get_db() as cur:
            cur.execute(
                "INSERT INTO users(name, email) VALUES (%s, %s) RETURNING user_id",
                (user.name, user.email)
            )
            new_id = cur.fetchone([0])
            return {"message": "User added successfully", "user_id": new_id}
    except psycopg2.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e.pgerror}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
    
@router.get("/{user_id}")
async def get_user_id(user_id: int):
    try:
        with get_db() as cur:
            check_exists("users", "user_id", user_id)
            cur.execute(
                "SELECT * FROM users WHERE user_id = %s", (user_id,)
            )
            row = cur.fetchone()
            return {
                "user_id": row[0],
                "name": row[1],
                "email": row[2],
                "created_at": row[3]
            }
    except psycopg2.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e.pgerror}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}") 