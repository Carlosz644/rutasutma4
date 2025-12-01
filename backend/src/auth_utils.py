# backend/src/auth_utils.py

from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from datetime import datetime

from config import SECRET_KEY, ALGORITHM

# FastAPI leerá automáticamente el header Authorization: Bearer xxx
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login/")

def require_roles(roles_permitidos: list[str]):
    def wrapper(token: str = Depends(oauth2_scheme)):
        if not token:
            raise HTTPException(status_code=401, detail="Token no proporcionado")

        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        except JWTError:
            raise HTTPException(status_code=401, detail="Token inválido")

        rol = payload.get("rol")
        if not rol:
            raise HTTPException(status_code=401, detail="Token sin rol")

        if rol not in roles_permitidos:
            raise HTTPException(status_code=403, detail="Rol no autorizado")

        return payload   # esto es el usuario decodificado

    return wrapper
