from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas

router = APIRouter(prefix="/rutas", tags=["Rutas"])

# =========================================
# GET: Listar rutas con repartidor y vehículo
# =========================================
@router.get("/", response_model=list[schemas.Ruta])
def listar_rutas(db: Session = Depends(get_db)):
    rutas = db.query(models.Ruta).all()
    return rutas

# =========================================
# GET: Ruta por ID
# =========================================
@router.get("/{id_ruta}", response_model=schemas.Ruta)
def obtener_ruta(id_ruta: int, db: Session = Depends(get_db)):
    ruta = db.query(models.Ruta).filter(models.Ruta.id_ruta == id_ruta).first()
    if not ruta:
        raise HTTPException(status_code=404, detail="Ruta no encontrada")
    return ruta

# =========================================
# POST: Crear ruta
# =========================================
@router.post("/", response_model=schemas.RutaCreateResponse)
def crear_ruta(data: schemas.RutaCreate, db: Session = Depends(get_db)):
    nueva = models.Ruta(
        nombre_ruta=data.nombre_ruta,
        id_repartidor=data.id_repartidor,
        id_vehiculo=data.id_vehiculo,
        fecha=data.fecha,
        id_creador=data.id_creador,
    )
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva

# =========================================
# DELETE: Eliminar ruta
# =========================================
@router.delete("/{id_ruta}")
def eliminar_ruta(id_ruta: int, db: Session = Depends(get_db)):
    ruta = db.query(models.Ruta).filter(models.Ruta.id_ruta == id_ruta).first()
    if not ruta:
        raise HTTPException(status_code=404, detail="Ruta no encontrada")

    db.delete(ruta)
    db.commit()
    return {"message": "Ruta eliminada correctamente"}
