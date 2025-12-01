from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime
from typing import List
from fastapi import HTTPException

import models
from auth import hash_password

from schemas import (
    ClienteBase,
    VehiculoBase,
    RutaBase,
    RutaCreate,
    RepartidorBase,
    RepartidorCreate,
    ResultadoRutaOptimizada
)


# =======================================================
# 🚚 MOCK – OPTIMIZACIÓN DE RUTAS (ALG. FAKE TSP)
# =======================================================

BASE_LAT = 20.9168
BASE_LON = -101.3508

def mock_optimize_route(db: Session, cliente_ids: List[int]):
    clientes = (
        db.query(models.Cliente)
        .filter(models.Cliente.id_cliente.in_(cliente_ids))
        .all()
    )

    clientes_ordenados = sorted(
        clientes,
        key=lambda c: float(c.latitud) if c.latitud else -9999,
        reverse=True
    )

    ruta = []
    distancia_total = 0
    duracion_total = 0

    # punto base
    ruta.append(
        ResultadoRutaOptimizada(
            nombre="BASE",
            direccion="Centro",
            latitud=BASE_LAT,
            longitud=BASE_LON,
            distancia_km=0,
            duracion_min=0,
        )
    )

    for c in clientes_ordenados:
        distancia_total += abs(float(c.latitud) - BASE_LAT) * 100
        duracion_total += distancia_total * 0.20

        ruta.append(
            ResultadoRutaOptimizada(
                nombre=c.nombre,
                direccion=c.direccion,
                latitud=float(c.latitud),
                longitud=float(c.longitud),
                distancia_km=round(distancia_total, 2),
                duracion_min=round(duracion_total, 2),
            )
        )

    return ruta


# =======================================================
# CRUD CLIENTES
# =======================================================

def get_clientes(db: Session, skip: int = 0, limit: int = 200):
    return db.query(models.Cliente).offset(skip).limit(limit).all()


def get_cliente(db: Session, id_cliente: int):
    return (
        db.query(models.Cliente)
        .filter(models.Cliente.id_cliente == id_cliente)
        .first()
    )


def create_cliente(db: Session, cliente: ClienteBase):
    nuevo = models.Cliente(**cliente.dict())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo


# =======================================================
# CRUD REPARTIDORES (Usuario con rol="repartidor")
# =======================================================

def get_repartidores(db: Session):
    return (
        db.query(models.Usuario)
        .filter(models.Usuario.rol == "repartidor")
        .all()
    )


def create_repartidor(db: Session, data: RepartidorCreate):
    password_hash = hash_password(data.password)

    nuevo = models.Usuario(
        nombre=data.nombre,
        correo=data.correo,
        password_hash=password_hash,
        rol="repartidor",
        activo=1,
    )

    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo


def update_repartidor(db: Session, id_repartidor: int, data: RepartidorBase):
    rep = (
        db.query(models.Usuario)
        .filter(
            models.Usuario.id_usuario == id_repartidor,
            models.Usuario.rol == "repartidor",
        )
        .first()
    )

    if not rep:
        raise HTTPException(status_code=404, detail="Repartidor no encontrado")

    rep.nombre = data.nombre
    rep.correo = data.correo

    db.commit()
    db.refresh(rep)
    return rep


def delete_repartidor(db: Session, id_repartidor: int):
    rep = (
        db.query(models.Usuario)
        .filter(
            models.Usuario.id_usuario == id_repartidor,
            models.Usuario.rol == "repartidor",
        )
        .first()
    )

    if not rep:
        raise HTTPException(status_code=404, detail="Repartidor no encontrado")

    db.delete(rep)
    db.commit()
    return rep


# =======================================================
# CRUD VEHÍCULOS
# =======================================================

def get_vehiculos(db: Session, skip: int = 0, limit: int = 200):
    return db.query(models.Vehiculo).offset(skip).limit(limit).all()


def get_vehiculo(db: Session, id_vehiculo: int):
    return (
        db.query(models.Vehiculo)
        .filter(models.Vehiculo.id_vehiculo == id_vehiculo)
        .first()
    )


def create_vehiculo(db: Session, vehiculo: VehiculoBase):
    nuevo = models.Vehiculo(**vehiculo.dict())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo


# =======================================================
# CRUD RUTAS
# =======================================================

def crear_ruta(db: Session, data: RutaCreate):
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


def update_ruta(db: Session, id_ruta: int, ruta_data: RutaBase):
    ruta = (
        db.query(models.Ruta)
        .filter(models.Ruta.id_ruta == id_ruta)
        .first()
    )

    if not ruta:
        return None

    ruta.nombre_ruta = ruta_data.nombre_ruta
    ruta.id_repartidor = ruta_data.id_repartidor
    ruta.id_vehiculo = ruta_data.id_vehiculo
    ruta.fecha = ruta_data.fecha

    db.commit()
    db.refresh(ruta)
    return ruta


# =======================================================
# CRUD ENTREGAS
# =======================================================

def get_entregas(db: Session, skip: int = 0, limit: int = 200):
    return db.query(models.Entrega).offset(skip).limit(limit).all()


def get_entrega(db: Session, id_entrega: int):
    return (
        db.query(models.Entrega)
        .filter(models.Entrega.id_entrega == id_entrega)
        .first()
    )


# =======================================================
# CRUD PAQUETES
# =======================================================

def get_paquetes(db: Session, skip: int = 0, limit: int = 200):
    return db.query(models.Paquete).offset(skip).limit(limit).all()


# =======================================================
# CRUD SEGUIMIENTO
# =======================================================

def get_seguimientos_por_entrega(db: Session, id_entrega: int):
    return (
        db.query(models.Seguimiento)
        .filter(models.Seguimiento.id_entrega == id_entrega)
        .order_by(models.Seguimiento.fecha.asc())
        .all()
    )


# =======================================================
# CRUD USUARIOS
# =======================================================

def get_usuarios(db: Session, skip: int = 0, limit: int = 200):
    return db.query(models.Usuario).offset(skip).limit(limit).all()


def get_usuario_por_id(db: Session, id_usuario: int):
    return (
        db.query(models.Usuario)
        .filter(models.Usuario.id_usuario == id_usuario)
        .first()
    )


def get_usuario_por_correo(db: Session, correo: str):
    return (
        db.query(models.Usuario)
        .filter(models.Usuario.correo == correo)
        .first()
    )


# =======================================================
# CRUD EVIDENCIAS
# =======================================================

def get_evidencias_por_entrega(db: Session, id_entrega: int):
    return (
        db.query(models.Evidencia)
        .filter(models.Evidencia.id_entrega == id_entrega)
        .all()
    )
