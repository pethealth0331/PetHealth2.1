import os
from motor.motor_asyncio import AsyncIOMotorClient

# Compartimos la misma instancia lógica de base de datos dictada por Atlas
MONGO_URI = os.getenv("MONGO_URI")

client = AsyncIOMotorClient(MONGO_URI)
db = client.pethealth_db

def get_db():
    return db
