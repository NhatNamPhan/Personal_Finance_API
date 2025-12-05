from pydantic import BaseModel, field_validator


class AccountBase(BaseModel):
    name: str
    balance: float
    type: str
    
    @field_validator("type")
    def validator_type(cls, v):
        allowed = {"checking", "savings", "credit_card", "cash"}
        if v not in allowed:
            raise ValueError(f"type must be one of: {', '.join(allowed)}")
        return v


class AccountCreate(AccountBase):
    user_id: int


class AccountResponse(AccountBase):
    account_id: int
    user_id: int
    
    class Config:
        from_attributes = True


# Keep backward compatibility
Account = AccountCreate

