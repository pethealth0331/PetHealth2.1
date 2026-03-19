from pydantic import BaseModel
from datetime import datetime

class AppointmentCreate(BaseModel):
    pet_name: str
    reason: str
    date: str
    time: str

class AppointmentResponse(AppointmentCreate):
    id: str
    owner_id: str
    created_at: datetime
