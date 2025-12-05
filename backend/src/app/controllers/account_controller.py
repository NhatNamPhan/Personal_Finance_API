from fastapi import APIRouter
from src.schemas.account import AccountCreate
from src.app.services.account_service import AccountService

router = APIRouter(prefix="/accounts", tags=["Accounts"])

@router.post("")
async def add_account(account: AccountCreate):
    """Create a new account."""
    return AccountService.create_account(account)

@router.get("")
async def get_account_user_id(user_id: int):
    """Get all accounts for a user."""
    return AccountService.get_accounts_by_user_id(user_id)

