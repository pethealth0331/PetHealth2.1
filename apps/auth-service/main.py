from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel, EmailStr
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
from datetime import datetime, timedelta
import jwt
import os
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="PetHealth - Servicio de Autenticación")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SECRET_KEY = os.getenv("SECRET_KEY", "super_secreta_clave_pethealth_dev_2026!")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
MONGO_URI = os.getenv("MONGO_URI_AUTH", "mongodb://admin:secret@mongodb:27017/auth_db?authSource=admin")

client = AsyncIOMotorClient(MONGO_URI)
db = client.get_default_database()
users_collection = db.users

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def hash_password(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire_mins = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    expire = datetime.utcnow() + timedelta(minutes=expire_mins)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str

@app.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(user: UserCreate):
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="El correo ya se encuentra registrado.")
    
    user_dict = user.dict()
    user_dict["password"] = hash_password(user.password)
    
    await users_collection.insert_one(user_dict)
    
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/login", response_model=TokenResponse)
async def login(user: UserLogin):
    db_user = await users_collection.find_one({"email": user.email})
    
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")
    
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}
