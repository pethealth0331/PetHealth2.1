from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from database import get_db
from schemas import UserCreate, UserResponse, Token, UserLogin
from security import get_password_hash, verify_password, create_access_token
from datetime import datetime

app = FastAPI(title="PetHealth - Auth Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user: UserCreate):
    db = get_db()
    # 1. Chequear si el usuario existe
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="El correo ya está registrado.")
    
    # 2. Hashear y guardar
    user_dict = {
        "full_name": user.full_name,
        "email": user.email,
        "hashed_password": get_password_hash(user.password),
        "created_at": datetime.utcnow()
    }
    result = await db.users.insert_one(user_dict)
    
    return UserResponse(
        id=str(result.inserted_id),
        full_name=user.full_name,
        email=user.email,
        created_at=user_dict["created_at"]
    )

@app.post("/login", response_model=Token)
async def login(user: UserLogin):
    db = get_db()
    # 1. Buscar usuario
    db_user = await db.users.find_one({"email": user.email})
    
    # 2. Verificar contraseña
    if not db_user or not verify_password(user.password, db_user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")
    
    # 3. Retornar JWT con el '_id' como 'sub'
    access_token = create_access_token(data={"sub": str(db_user["_id"])})
    return Token(access_token=access_token, token_type="bearer")
