import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import sys

# Si estás ejecutando esto en Windows con Python nativo, esta política evita un error común del EventLoop
if sys.platform == 'win32':
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

async def test_connection():
    # Usamos localhost y el puerto 27017 que expusimos en el docker-compose
    MONGO_URI = "mongodb://admin:secret@localhost:27017/?authSource=admin"
    print("--------------------------------------------------")
    print(f"⏳ Intentando conectar a MongoDB en: {MONGO_URI}")
    print("--------------------------------------------------")
    
    try:
        # Iniciamos el cliente con un timeout corto para que no se quede colgado si falla
        client = AsyncIOMotorClient(MONGO_URI, serverSelectionTimeoutMS=5000)
        
        # El comando 'ping' verifica si el servidor responde
        response = await client.admin.command('ping')
        
        print("\n✅ ¡ÉXITO! Conexión a MongoDB establecida correctamente.")
        print(f"Respuesta del servidor: {response}")
        
        # Listemos las bases de datos para ver qué hay dentro
        dbs = await client.list_database_names()
        print(f"\nBases de datos disponibles: {dbs}")
        
    except Exception as e:
        print("\n❌ ERROR: No se pudo conectar a MongoDB.")
        print(f"Detalle del error: {e}")
        print("\nSugerencias de solución:")
        print("1. Verifica en Docker Desktop que 'pethealth-mongodb' esté en verde (Running).")
        print("2. Asegúrate de tener instalado motor ejecutando: pip install motor pymongo")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(test_connection())