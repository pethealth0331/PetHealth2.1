import os
from motor.motor_asyncio import AsyncIOMotorClient

# Obtiene la URI que Docker inyecta desde .env.development
MONGO_URI = os.getenv("MONGO_URI")

client = AsyncIOMotorClient(MONGO_URI)
# Usaremos una base genérica pethealth_db que alojará colecciones (users, appointments)
db = client.pethealth_db

def get_db():
    """Inyección de dependencia para obtener la DB."""
    return db
