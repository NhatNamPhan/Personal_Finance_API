from fastapi import APIRouter
from src.schemas.user import UserCreate
from src.app.services.user_service import UserService

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("")
async def add_user(user: UserCreate):
    """Create a new user."""
    return UserService.create_user(user)

@router.get("/{user_id}")
async def get_user_id(user_id: int):
    """Get a user by ID."""
    return UserService.get_user_by_id(user_id)

