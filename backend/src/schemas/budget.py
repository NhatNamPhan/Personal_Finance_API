from pydantic import BaseModel, field_validator
from datetime import date


class BudgetBase(BaseModel):
    amount: float
    month: date
    
    @field_validator("month")
    def validate_budget_month(cls, v: date):
        if v.day != 1:
            raise ValueError("Budget month must be the first day of the month")
        return v


class BudgetCreate(BudgetBase):
    user_id: int
    category_id: int


class BudgetUpdate(BudgetBase):
    pass


class BudgetResponse(BudgetBase):
    budget_id: int
    user_id: int
    category_id: int
    created_at: date | None = None
    
    class Config:
        from_attributes = True


# Keep backward compatibility
Budget = BudgetCreate

