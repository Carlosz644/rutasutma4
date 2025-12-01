from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from database import get_db
import schemas
import crud
from auth import verify_password, create_access_token

router = APIRouter(prefix="/login", tags=["Login"])

@router.post("/")
def login(data: schemas.LoginData, db: Session = Depends(get_db)):

    usuario = crud.get_usuario_por_correo(db, data.correo)


    if not usuario:
        raise HTTPException(status_code=401, detail="Usuario no encontrado")

    if not verify_password(data.password, usuario.password_hash):
        raise HTTPException(status_code=401, detail="Contraseña incorrecta")

    token = create_access_token({
        "sub": usuario.correo,
        "id": usuario.id_usuario,
        "rol": usuario.rol
    })

    return {
        "access_token": token,
        "usuario": {
            "id": usuario.id_usuario,
            "nombre": usuario.nombre,
            "correo": usuario.correo,
            "rol": usuario.rol
        }
    }
