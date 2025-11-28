from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime
from typing import List

import models
import schemas

# =======================================================
# 🚚 ALGORITMO FAKE DE OPTIMIZACIÓN (MOCK TSP)
# =======================================================

BASE_LAT = 20.9168
BASE_LON = -101.3508

def mock_optimize_route(db: Session, cliente_ids: List[int]):
    clientes = db.query(models.Cliente).filter(
        models.Cliente.id_cliente.in_(cliente_ids)
    ).all()

    clientes_ordenados = sorted(
        clientes,
        key=lambda c: c.latitud if c.latitud else -1000,
        reverse=True
    )

    ruta = []

    ruta.append(schemas.ResultadoRutaOptimizada(
        nombre="BASE",
        direccion="Centro",
        latitud=BASE_LAT,
        longitud=BASE_LON,
        distancia_km=0,
        duracion_min=0
    ))

    distancia = 0
    duracion = 0

    for c in clientes_ordenados:
        distancia += abs(float(c.latitud) - BASE_LAT) * 100
        duracion += distancia * 0.2

        ruta.append(schemas.ResultadoRutaOptimizada(
            nombre=c.nombre,
            direccion=c.direccion,
            latitud=float(c.latitud),
            longitud=float(c.longitud),
            distancia_km=round(distancia, 2),
            duracion_min=round(duracion, 2)
        ))

    return ruta


# =======================================================
# CRUD CLIENTES
# =======================================================

def get_clientes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Cliente).offset(skip).limit(limit).all()

def get_cliente(db: Session, id_cliente: int):
    return db.query(models.Cliente).filter(models.Cliente.id_cliente == id_cliente).first()

def create_cliente(db: Session, cliente: schemas.ClienteBase):
    nuevo = models.Cliente(**cliente.dict())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo


# =======================================================
# CRUD CONDUCTORES
# =======================================================

def get_conductores(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Conductor).offset(skip).limit(limit).all()

def get_conductor(db: Session, id_conductor: int):
    return db.query(models.Conductor).filter(models.Conductor.id_conductor == id_conductor).first()

def create_conductor(db: Session, conductor: schemas.ConductorBase):
    nuevo = models.Conductor(**conductor.dict())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo


# =======================================================
# CRUD VEHICULOS
# =======================================================

def get_vehiculos(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Vehiculo).offset(skip).limit(limit).all()

def get_vehiculo(db: Session, id_vehiculo: int):
    return db.query(models.Vehiculo).filter(models.Vehiculo.id_vehiculo == id_vehiculo).first()

def create_vehiculo(db: Session, vehiculo: schemas.VehiculoBase):
    nuevo = models.Vehiculo(**vehiculo.dict())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo


# =======================================================
# CRUD RUTAS
# =======================================================

def get_rutas(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Ruta).offset(skip).limit(limit).all()

def get_ruta(db: Session, id_ruta: int):
    return db.query(models.Ruta).filter(models.Ruta.id_ruta == id_ruta).first()

def crear_ruta(db: Session, ruta: schemas.RutaCreate):
    nueva = models.Ruta(
        nombre_ruta=ruta.nombre_ruta,
        id_conductor=ruta.id_conductor,
        id_vehiculo=ruta.id_vehiculo,
        fecha=datetime.now().date(),
    )
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva

def update_ruta(db: Session, id_ruta: int, ruta_data: schemas.RutaBase):
    ruta = db.query(models.Ruta).filter(models.Ruta.id_ruta == id_ruta).first()
    if not ruta:
        return None

    ruta.nombre_ruta = ruta_data.nombre_ruta
    ruta.id_conductor = ruta_data.id_conductor
    ruta.id_vehiculo = ruta_data.id_vehiculo
    ruta.fecha = ruta_data.fecha

    db.commit()
    db.refresh(ruta)
    return ruta


def delete_ruta(db: Session, id_ruta: int):
    ruta = db.query(models.Ruta).filter(models.Ruta.id_ruta == id_ruta).first()
    if not ruta:
        return None

    db.delete(ruta)
    db.commit()
    return ruta




# =======================================================
# CRUD ENTREGAS
# =======================================================

def get_entregas(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Entrega).offset(skip).limit(limit).all()

def get_entrega(db: Session, id_entrega: int):
    return db.query(models.Entrega).filter(models.Entrega.id_entrega == id_entrega).first()


# =======================================================
# CRUD PAQUETES
# =======================================================

def get_paquetes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Paquete).offset(skip).limit(limit).all()

def get_paquete(db: Session, id_paquete: int):
    return db.query(models.Paquete).filter(models.Paquete.id_paquete == id_paquete).first()


# =======================================================
# CRUD SEGUIMIENTO
# =======================================================

def get_seguimientos(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Seguimiento).offset(skip).limit(limit).all()

def get_seguimiento(db: Session, id_seguimiento: int):
    return db.query(models.Seguimiento).filter(models.Seguimiento.id_seguimiento == id_seguimiento).first()


# =======================================================
# CRUD USUARIOS
# =======================================================

def get_usuarios(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Usuario).offset(skip).limit(limit).all()

def get_usuario_por_id(db: Session, id_usuario: int):
    return db.query(models.Usuario).filter(models.Usuario.id_usuario == id_usuario).first()

def get_usuario_por_correo(db: Session, correo: str):
    return db.query(models.Usuario).filter(models.Usuario.correo == correo).first()


# =======================================================
# CRUD EVIDENCIAS
# =======================================================

def get_evidencias_por_entrega(db: Session, id_entrega: int):
    return db.query(models.Evidencia).filter(models.Evidencia.id_entrega == id_entrega).all()
