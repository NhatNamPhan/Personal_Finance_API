from fastapi import APIRouter
from src.schemas.category import CategoryCreate, CategoryUpdate
from src.app.services.category_service import CategoryService

router = APIRouter(prefix="/categories", tags=["Categories"])

@router.post("")
async def add_category(category: CategoryCreate):
    """Create a new category."""
    return CategoryService.create_category(category)

@router.get("")
async def get_categories(user_id: int, type: str | None = None):
    """Get categories for a user, optionally filtered by type."""
    return CategoryService.get_categories(user_id, type)

@router.get("/{category_id}")
async def get_categories_by_id(category_id: int):
    """Get a category by ID."""
    return CategoryService.get_category_by_id(category_id)

@router.put("/{category_id}")
async def update_category(category_id: int, update: CategoryUpdate):
    """Update a category."""
    return CategoryService.update_category(category_id, update)

@router.delete("/{category_id}")
async def delete_category(category_id: int):
    """Delete a category."""
    return CategoryService.delete_category(category_id)

