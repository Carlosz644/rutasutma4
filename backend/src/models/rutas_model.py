from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List

from database import get_db
import crud
import schemas

router = APIRouter(prefix="/rutas", tags=["Rutas"])

# ------------ CREAR RUTA ------------
@router.post("/", response_model=schemas.Ruta)
def crear_ruta_endpoint(
    ruta: schemas.RutaCreate,
    db: Session = Depends(get_db)
):
    nueva_ruta = crud.crear_ruta(db, ruta)
    return nueva_ruta
