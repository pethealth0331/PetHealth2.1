from fastapi import FastAPI, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

from database import get_db
from schemas import AppointmentCreate, AppointmentResponse
from security import get_current_user_id

app = FastAPI(title="PetHealth - Appointment Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/appointments", response_model=AppointmentResponse, status_code=status.HTTP_201_CREATED)
async def schedule_appointment(
    appointment: AppointmentCreate,
    owner_id: str = Depends(get_current_user_id)
):
    """
    Endpoint Protegido: 
    Requiere JWT en el header 'Authorization'.
    Extrae el 'owner_id' del token verificado automáticamente.
    """
    db = get_db()
    
    # Preparamos el documento para MongoDB
    appt_dict = appointment.dict()
    appt_dict["owner_id"] = owner_id
    appt_dict["created_at"] = datetime.utcnow()
    
    # Insertamos asincrónicamente
    result = await db.appointments.insert_one(appt_dict)
    
    return AppointmentResponse(
        id=str(result.inserted_id),
        **appt_dict
    )
