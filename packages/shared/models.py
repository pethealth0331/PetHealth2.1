from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

# ==========================================
# GESTIÓN DE USUARIOS
# ==========================================
class UserBase(BaseModel):
    full_name: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserInDB(UserBase):
    id: Optional[str] = Field(alias="_id", default=None)
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

# ==========================================
# GESTIÓN DE MASCOTAS
# ==========================================
class PetBase(BaseModel):
    name: str
    species: str
    breed: Optional[str] = None
    age: int

class PetCreate(PetBase):
    pass

class PetInDB(PetBase):
    id: Optional[str] = Field(alias="_id", default=None)
    owner_email: EmailStr
    created_at: datetime = Field(default_factory=datetime.utcnow)
