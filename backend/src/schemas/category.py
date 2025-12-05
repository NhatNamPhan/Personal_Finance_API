from pydantic import BaseModel, field_validator


class CategoryBase(BaseModel):
    name: str
    type: str
    
    @field_validator("type")
    def validator_type(cls, v):
        allowed = {"income", "expense"}
        if v not in allowed:
            raise ValueError(f"type must be one of: {', '.join(allowed)}")
        return v


class CategoryCreate(CategoryBase):
    user_id: int


class CategoryUpdate(CategoryBase):
    pass


class CategoryResponse(CategoryBase):
    category_id: int
    user_id: int
    
    class Config:
        from_attributes = True


# Keep backward compatibility
Category = CategoryCreate

