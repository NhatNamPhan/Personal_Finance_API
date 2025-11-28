from pydantic import BaseModel, EmailStr, field_validator
from datetime import date

class User(BaseModel):
    name: str
    email: EmailStr
    
class Account(BaseModel):
    user_id: int
    name: str
    balance: float
    type: str
    
    @field_validator("type")
    def validator_type(cls, v):
        allowed = {"checking", "savings", "credit_card", "cash"}
        if v not in allowed:
            raise ValueError(f"type must be one of: {', '.join(allowed)}")
        return v

class Category(BaseModel):
    name: str
    type: str
    user_id: int
    
    @field_validator("type")
    def validator_type(cls, v):
        allowed = {"income", "expense"}
        if v not in allowed:
            raise ValueError(f"type must be one of: {', '.join(allowed)}")
        return v

class CategoryUpdate(BaseModel):
    name: str
    type: str
    
    @field_validator("type")
    def validator_type(cls, v):
        allowed = {"income", "expense"}
        if v not in allowed:
            raise ValueError(f"type must be one of: {', '.join(allowed)}")
        return v

class Transaction(BaseModel):
    account_id: int
    category_id: int
    amount: float
    tran_date: date
    description: str
    type: str
    
    @field_validator("type")
    def validator_type(cls, v):
        allowed = {"income", "expense"}
        if v not in allowed:
            raise ValueError(f"type must be one of: {', '.join(allowed)}")
        return v

class Budget(BaseModel):
    user_id: int
    category_id: int
    amount: float
    month: date
    
    @field_validator("month")
    def validate_budget_month(cls, v: date):
        if v.day != 1:
            raise ValueError("Budget month must be the first day of the month")
        return v
    