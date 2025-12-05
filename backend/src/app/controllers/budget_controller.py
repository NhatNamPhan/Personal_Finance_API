from fastapi import APIRouter
from src.schemas.budget import BudgetCreate, BudgetUpdate
from src.app.services.budget_service import BudgetService
from datetime import date

router = APIRouter(prefix="/budgets", tags=['Budgets'])

@router.post("")
async def add_budget(budget: BudgetCreate):
    """Create a new budget."""
    return BudgetService.create_budget(budget)

@router.get("")
async def get_budget(user_id: int, month: date | None = None):
    """Get budgets for a user, optionally filtered by month."""
    return BudgetService.get_budgets(user_id, month)

@router.get("/{budget_id}")
async def get_budget_by_id(budget_id: int):
    """Get a budget by ID."""
    return BudgetService.get_budget_by_id(budget_id)

@router.put("/{budget_id}")           
async def update_budget(budget_id: int, update: BudgetUpdate):
    """Update a budget."""
    return BudgetService.update_budget(budget_id, update)

@router.delete("/{budget_id}")
async def delete_budget(budget_id: int):
    """Delete a budget."""
    return BudgetService.delete_budget(budget_id)

