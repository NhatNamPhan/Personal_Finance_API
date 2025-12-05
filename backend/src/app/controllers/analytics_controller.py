from fastapi import APIRouter
from src.app.services.analytics_service import AnalyticsService
from datetime import date

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/users/{user_id}/spending")
async def get_spending(user_id: int, start_date: date, end_date: date):
    """Get spending analytics for a user within a date range."""
    return AnalyticsService.get_spending(user_id, start_date, end_date)

@router.get("/users/{user_id}/budgets/progress")
async def get_progress(user_id: int, month: date):
    """Get budget progress for a user in a specific month."""
    return AnalyticsService.get_budget_progress(user_id, month)

@router.get("/users/{user_id}/net-worth")
async def get_new_worth(user_id: int):
    """Get net worth for a user."""
    return AnalyticsService.get_net_worth(user_id)

