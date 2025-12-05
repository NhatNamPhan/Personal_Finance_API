from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    name: str
    email: EmailStr


class UserCreate(UserBase):
    pass


class UserResponse(UserBase):
    user_id: int
    
    class Config:
        from_attributes = True


# Keep backward compatibility
User = UserCreate

