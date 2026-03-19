from fastapi import FastAPI, HTTPException, Depends, status, Header
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi.middleware.cors import CORSMiddleware
import jwt
import os

app = FastAPI(title="PetHealth - Servicio de Citas Veterinaria")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SECRET_KEY = os.getenv("SECRET_KEY", "super_secreta_clave_pethealth_dev_2026!")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
MONGO_URI = os.getenv("MONGO_URI_APPOINTMENTS", "mongodb://admin:secret@mongodb:27017/appointments_db?authSource=admin")

client = AsyncIOMotorClient(MONGO_URI)
db = client.get_default_database()
appointments_collection = db.appointments

async def verify_jwt_token(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Formato de token inválido")
    
    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Credenciales no válidas")
        return email
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="El token ha expirado. Inicia sesión nuevamente.")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Token no decodificable.")

class AppointmentCreate(BaseModel):
    pet_name: str
    vet_name: str
    appointment_date: str
    reason: str

class AppointmentResponse(AppointmentCreate):
    id: str
    owner_email: str

@app.post("/appointments/schedule", response_model=AppointmentResponse, status_code=status.HTTP_201_CREATED)
async def schedule_appointment(
    appointment: AppointmentCreate, 
    current_user_email: str = Depends(verify_jwt_token)
):
    appointment_dict = appointment.dict()
    appointment_dict["owner_email"] = current_user_email  
    
    result = await appointments_collection.insert_one(appointment_dict)
    
    response_data = {**appointment_dict, "id": str(result.inserted_id)}
    return response_data
