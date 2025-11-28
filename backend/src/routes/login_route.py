from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from auth import verify_password, create_access_token
from database import get_db
import crud

router = APIRouter(prefix="/login", tags=["Login"])

class LoginRequest(BaseModel):
    correo: str
    password: str

@router.post("/")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    # Buscar usuario por correo
   user = crud.get_usuario_por_correo(db, data.correo)
   if not user:
        raise HTTPException(status_code=400, detail="Usuario no encontrado")

    # Verificar contraseña
   if not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Contraseña incorrecta")

    # Crear token
   token = create_access_token({"id_usuario": user.id_usuario})

   return {
        "access_token": token,
        "usuario": {
            "id": user.id_usuario,
            "nombre": user.nombre,
            "correo": user.correo,
            "rol": user.rol
        }
    }
