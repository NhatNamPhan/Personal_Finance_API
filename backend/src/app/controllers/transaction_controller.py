from fastapi import APIRouter
from src.schemas.transaction import TransactionCreate
from src.app.services.transaction_service import TransactionService
from datetime import date

router = APIRouter(prefix="/transactions", tags=['Transactions'])

@router.post("")
async def add_trans(trans: TransactionCreate):
    """Create a new transaction."""
    return TransactionService.create_transaction(trans)

@router.get("")
async def get_trans_by_user_or_date(
    user_id: int,
    start_date: date | None = None,
    end_date: date | None = None
):
    """Get transactions for a user, optionally filtered by date range."""
    return TransactionService.get_transactions_by_user(user_id, start_date, end_date)

@router.get("/{trans_id}")
async def get_transaction_by_id(trans_id: int):
    """Get a transaction by ID."""
    return TransactionService.get_transaction_by_id(trans_id)

