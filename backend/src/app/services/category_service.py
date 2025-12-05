from fastapi import HTTPException
from src.core.db import get_db
from src.schemas.category import CategoryCreate, CategoryUpdate
from src.app.utils.validators import check_exists
import psycopg2


class CategoryService:
    @staticmethod
    def create_category(category: CategoryCreate) -> dict:
        """Create a new category."""
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
    
    @staticmethod
    def get_categories(user_id: int, type: str | None = None) -> dict:
        """Get categories for a user, optionally filtered by type."""
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
    
    @staticmethod
    def get_category_by_id(category_id: int) -> dict:
        """Get a category by ID."""
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
    
    @staticmethod
    def update_category(category_id: int, update: CategoryUpdate) -> dict:
        """Update a category."""
        try:
            with get_db() as cur:
                check_exists("categories", "category_id", category_id)
                cur.execute('''
                    UPDATE categories
                    SET name = %s, 
                        type = %s
                    WHERE category_id = %s
                    RETURNING category_id, name, type, user_id
                ''', (update.name, update.type, category_id))
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
    
    @staticmethod
    def delete_category(category_id: int) -> dict:
        """Delete a category."""
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

