from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
import os

from database import get_db          # ← CORRECTO
from auth import hash_password       # ← CORRECTO
import crud                          # ← ESTO SÍ SE CAMBIA

router = APIRouter(prefix="/system", tags=["Sistema"])


# 🔐 Modelo para recibir la clave de emergencia
class ResetRequest(BaseModel):
    master_key: str


@router.post("/reset_superadmin")
def reset_superadmin(data: ResetRequest, db: Session = Depends(get_db)):
    """
    Resetea la contraseña del super administrador SOLO si se proporciona 
    correctamente la MASTER_RESET_KEY guardada en el archivo .env.
    """

    master_key_real = os.getenv("MASTER_RESET_KEY")

    if data.master_key != master_key_real:
        raise HTTPException(status_code=403, detail="Clave maestra incorrecta")

    # Buscar al superadmin
    superadmin = crud.get_usuario_por_correo(db, "superadmin@empresa.com")

    if not superadmin:
        raise HTTPException(status_code=404, detail="Superadmin no existe")

    # Nueva contraseña por defecto
    nueva_password = "SuperAdmin123!"
    nuevo_hash = hash_password(nueva_password)

    superadmin.password_hash = nuevo_hash
    db.commit()
    db.refresh(superadmin)

    return {
        "mensaje": "Contraseña del superadmin ha sido restablecida.",
        "nueva_contraseña": nueva_password
    }
