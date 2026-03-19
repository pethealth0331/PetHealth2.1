from fastapi import HTTPException, Header, status
import jwt
import os

SECRET_KEY = os.getenv("SECRET_KEY", "super_secreta_clave_pethealth_dev_2026!")
ALGORITHM = os.getenv("ALGORITHM", "HS256")

async def get_current_user_id(authorization: str = Header(...)):
    """
    Inyección de dependencia para verificar el JWT en cada petición 
    protegida y extraer el ID del dueño.
    """
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Formato de token inválido. Debe ser 'Bearer <token>'"
        )
    
    token = authorization.split(" ")[1]
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="El token no contiene el ID de usuario"
            )
        return user_id
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="El token ha expirado"
        )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="No se pudo validar el token"
        )
