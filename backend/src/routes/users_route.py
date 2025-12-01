from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
import src.models as models
import schemas
import crud
from auth import require_roles, hash_password


router = APIRouter(prefix="/repartidores", tags=["Repartidores"])


# ================================
# Listar repartidores
# ================================
@router.get("/", response_model=list[schemas.Usuario])
def listar_repartidores(
    db: Session = Depends(get_db),
    user=Depends(require_roles(["super_admin", "admin"]))
):
    return crud.get_repartidores(db)


# ================================
# Obtener repartidor por ID
# ================================
@router.get("/{id_usuario}", response_model=schemas.Usuario)
def obtener_repartidor(
    id_usuario: int,
    db: Session = Depends(get_db),
    user=Depends(require_roles(["super_admin", "admin"]))
):
    rep = crud.get_repartidor(db, id_usuario)
    if not rep:
        raise HTTPException(status_code=404, detail="Repartidor no encontrado")
    return rep


# ================================
# Crear repartidor
# ================================
@router.post("/", response_model=schemas.Usuario)
def crear_repartidor(
    data: schemas.UsuarioCreate,
    db: Session = Depends(get_db),
    user=Depends(require_roles(["super_admin"]))
):

    password_hash = hash_password(data.password)
    nuevo = crud.create_repartidor(db, data, password_hash)

    return nuevo


# ================================
# Actualizar repartidor
# ================================
@router.put("/{id_usuario}", response_model=schemas.Usuario)
def actualizar_repartidor(
    id_usuario: int,
    data: schemas.UsuarioBase,
    db: Session = Depends(get_db),
    user=Depends(require_roles(["super_admin"]))
):
    actualizado = crud.update_repartidor(db, id_usuario, data)
    if not actualizado:
        raise HTTPException(status_code=404, detail="Repartidor no encontrado")
    return actualizado


# ================================
# Eliminar repartidor
# ================================
@router.delete("/{id_usuario}", response_model=schemas.Usuario)
def eliminar_repartidor(
    id_usuario: int,
    db: Session = Depends(get_db),
    user=Depends(require_roles(["super_admin"]))
):
    eliminado = crud.delete_repartidor(db, id_usuario)
    if not eliminado:
        raise HTTPException(status_code=404, detail="Repartidor no encontrado")
    return eliminado
