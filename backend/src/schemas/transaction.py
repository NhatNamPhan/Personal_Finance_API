from pydantic import BaseModel, field_validator
from datetime import date


class TransactionBase(BaseModel):
    amount: float
    date: date
    description: str
    type: str
    
    @field_validator("type")
    def validator_type(cls, v):
        allowed = {"income", "expense"}
        if v not in allowed:
            raise ValueError(f"type must be one of: {', '.join(allowed)}")
        return v


class TransactionCreate(TransactionBase):
    account_id: int
    category_id: int


class TransactionResponse(TransactionBase):
    transaction_id: int
    account_id: int
    category_id: int
    created_at: date | None = None
    
    class Config:
        from_attributes = True


# Keep backward compatibility
Transaction = TransactionCreate

