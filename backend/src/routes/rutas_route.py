from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List

from database import get_db
import crud
import schemas
import models
from pydantic import BaseModel

router = APIRouter(prefix="/rutas", tags=["Rutas"])


# ======================================
# GET – LISTAR RUTAS (conductor + vehículo)
# ======================================
@router.get("/", response_model=List[schemas.Ruta])
def listar_rutas(db: Session = Depends(get_db)):
    rutas = db.query(models.Ruta)\
        .options(
            joinedload(models.Ruta.conductor),
            joinedload(models.Ruta.vehiculo)
        ).all()

    return rutas


# ======================================
# POST – CREAR RUTA
# ======================================
@router.post("/", response_model=schemas.Ruta)
def crear_ruta(ruta: schemas.RutaCreate, db: Session = Depends(get_db)):
    return crud.crear_ruta(db, ruta)


# ======================================
# PUT – ACTUALIZAR RUTA
# ======================================
@router.put("/{id_ruta}", response_model=schemas.Ruta)
def actualizar_ruta(id_ruta: int, ruta: schemas.RutaBase, db: Session = Depends(get_db)):
    actualizada = crud.update_ruta(db, id_ruta, ruta)
    if not actualizada:
        raise HTTPException(status_code=404, detail="Ruta no encontrada")
    return actualizada


# ======================================
# DELETE – ELIMINAR RUTA
# ======================================
@router.delete("/{id_ruta}", response_model=schemas.Ruta)
def eliminar_ruta(id_ruta: int, db: Session = Depends(get_db)):
    eliminada = crud.delete_ruta(db, id_ruta)
    if not eliminada:
        raise HTTPException(status_code=404, detail="Ruta no encontrada")
    return eliminada


# ======================================
# POST – OPTIMIZAR RUTA
# ======================================
class ClienteIDs(BaseModel):
    cliente_ids: List[int]

@router.post("/optimizar", response_model=List[schemas.ResultadoRutaOptimizada])
def optimizar_ruta(body: ClienteIDs, db: Session = Depends(get_db)):
    return crud.mock_optimize_route(db, body.cliente_ids)
