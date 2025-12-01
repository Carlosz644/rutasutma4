from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
import crud
import schemas

router = APIRouter(prefix="/repartidores", tags=["Repartidores"])


@router.get("/", response_model=list[schemas.Repartidor])
def listar(db: Session = Depends(get_db)):
    return crud.get_repartidores(db)


@router.post("/", response_model=schemas.Repartidor)
def crear(data: schemas.RepartidorCreate, db: Session = Depends(get_db)):
    return crud.create_repartidor(db, data)


@router.put("/{id_repartidor}", response_model=schemas.Repartidor)
def actualizar(id_repartidor: int, data: schemas.RepartidorBase, db: Session = Depends(get_db)):
    return crud.update_repartidor(db, id_repartidor, data)


@router.delete("/{id_repartidor}", response_model=schemas.Repartidor)
def eliminar(id_repartidor: int, db: Session = Depends(get_db)):
    return crud.delete_repartidor(db, id_repartidor)
