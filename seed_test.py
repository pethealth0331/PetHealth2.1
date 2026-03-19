import asyncio
import os
import sys
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from datetime import datetime

# Solución para el error común de EventLoop de Motor en Windows
if sys.platform == 'win32':
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

# Cargamos tu configuración
load_dotenv(".env.development")

async def crear_primer_registro():
    uri = os.getenv("MONGO_URI")
    print(f"URI cargada: {uri[:25]}...") # Para verificar que cargó el .env
    
    client = AsyncIOMotorClient(uri)
    
    # 1. Definimos la base de datos (se creará automáticamente)
    db = client.PetHealthDB 
    
    # 2. Definimos la colección
    collection = db.pets
    
    # 3. El documento que vamos a guardar
    nueva_mascota = {
        "nombre": "Lucas",
        "especie": "Perro",
        "raza": "Golden Retriever",
        "edad": 3,
        "fecha_registro": datetime.now()
    }
    
    try:
        print("Enviando a Lucas a la nube...")
        resultado = await collection.insert_one(nueva_mascota)
        print(f"Exito! Registro creado con el ID: {resultado.inserted_id}")
        print("\n👉 Ahora ve a Chrome, refresca Atlas y busca 'PetHealthDB'")
    except Exception as e:
        print(f"Error al escribir: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(crear_primer_registro())