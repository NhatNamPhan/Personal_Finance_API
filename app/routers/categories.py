from fastapi import APIRouter, HTTPException
from app.database import get_db
from app.models import Category, CategoryUpdate
from app.utils import check_exists
import psycopg2

router = APIRouter(prefix="/categories", tags=["Categories"])

@router.post("")
async def add_category(category: Category):
    try:
        with get_db() as cur:
            cur.execute(
                "INSERT INTO categories(name, type, user_id) VALUES(%s, %s, %s) RETURNING category_id",
                (category.name, category.type, category.user_id)
            )
            new_id = cur.fetchone()[0]
            return {"message": "Category added successful", "category_id": new_id}
    except psycopg2.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e.pgerror}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("")
async def get_categories(user_id: int, type: str |None = None):
    try:
        with get_db() as cur:
            check_exists("users", "user_id", user_id)
            if type:
                cur.execute(
                    "SELECT * FROM categories WHERE user_id = %s and type = %s",
                    (user_id, type)
                )
                rows = cur.fetchall()
                categories = [{
                    "category_id": row[0],
                    "name": row[1]
                } for row in rows]
                return {
                    "user_id": user_id,
                    "type": type,
                    "categories": categories
                }
            else:
                cur.execute(
                "SELECT * FROM categories WHERE user_id = %s", (user_id,)
                )
                rows = cur.fetchall()
                categories = [{
                    "category_id": row[0],
                    "name": row[1],
                    "type": row[2],
                } for row in rows]
                return {
                    "user_id": user_id,
                    "categories": categories
                }
    except psycopg2.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e.pgerror}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/{category_id}")
async def get_categories_by_id(category_id: int):
    try:
        with get_db() as cur:
            check_exists("categories", "category_id", category_id)
            cur.execute(
                "SELECT * FROM categories WHERE category_id = %s", (category_id,)
            )
            row = cur.fetchone()
            return {
                "category_id": row[0],
                "name": row[1],
                "type": row[2],
                "user_id": row[3]
            }
    except psycopg2.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e.pgerror}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.put("/{category_id}")
async def update_category(category_id: int, update: CategoryUpdate):
    try:
        with get_db() as cur:
            check_exists("categories", "category_id", category_id)
            cur.execute('''
                UPDATE categories
                SET name = %s, 
                    type = %s
                WHERE category_id = %s
                RETURNING category_id, name, type, user_id
            ''', (update.name, update.type, category_id) 
            )
            row = cur.fetchone()
            return {
                "category_id": row[0],
                "name": row[1],
                "type": row[2], 
                "user_id": row[3]
            }
    except psycopg2.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e.pgerror}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.delete("/{category_id}")
async def delete_category(category_id: int):
    try:
        with get_db() as cur:
            check_exists("categories", "category_id", category_id)
            cur.execute(
                "DELETE FROM categories WHERE category_id = %s", (category_id,)
            )
            return {"message": f"Category with id {category_id} has been deleted successfully"}
    except psycopg2.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e.pgerror}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")