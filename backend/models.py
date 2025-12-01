from sqlalchemy import (
    Column, Integer, String, DECIMAL, ForeignKey,
    Date, Time, Text, Enum, DateTime
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
import enum
from database import Base

# ======================================================
# ENUMS
# ======================================================

class EstadoEntrega(str, enum.Enum):
    pendiente = "pendiente"
    en_camino = "en_camino"
    entregado = "entregado"
    retrasado = "retrasado"
    fallido = "fallido"

class RolUsuario(str, enum.Enum):
    super_admin = "super_admin"
    admin = "admin"
    repartidor = "repartidor"

# ======================================================
# USUARIOS
# ======================================================

class Usuario(Base):
    __tablename__ = "usuarios"

    id_usuario = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    correo = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    rol = Column(Enum(RolUsuario), default=RolUsuario.repartidor)
    activo = Column(Integer, default=1)
    creado_en = Column(DateTime, default=func.now())

    # Rutas asignadas (como repartidor)
    rutas_asignadas = relationship(
        "Ruta",
        back_populates="repartidor",
        foreign_keys="Ruta.id_repartidor",
        lazy="raise"
    )

    # Rutas creadas por el usuario (admin)
    rutas_creadas = relationship(
        "Ruta",
        back_populates="creador",
        foreign_keys="Ruta.id_creador",
        lazy="raise"
    )

# ======================================================
# CLIENTES
# ======================================================

class Cliente(Base):
    __tablename__ = "clientes"

    id_cliente = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100))
    direccion = Column(String(200))
    telefono = Column(String(20))
    correo = Column(String(100))
    latitud = Column(DECIMAL(10, 7))
    longitud = Column(DECIMAL(10, 7))

# ======================================================
# VEHICULOS
# ======================================================

class Vehiculo(Base):
    __tablename__ = "vehiculos"

    id_vehiculo = Column(Integer, primary_key=True, index=True)
    marca = Column(String(50))
    modelo = Column(String(50))
    placas = Column(String(20))
    capacidad = Column(Integer)

# ======================================================
# RUTAS
# ======================================================

class Ruta(Base):
    __tablename__ = "rutas"

    id_ruta = Column(Integer, primary_key=True, index=True)
    nombre_ruta = Column(String(100))

    id_repartidor = Column(Integer, ForeignKey("usuarios.id_usuario"))
    id_vehiculo = Column(Integer, ForeignKey("vehiculos.id_vehiculo"))
    fecha = Column(Date)
    id_creador = Column(Integer, ForeignKey("usuarios.id_usuario"))

    # Relación con repartidor
    repartidor = relationship(
        "Usuario",
        foreign_keys=[id_repartidor],
        lazy="joined"
    )

    # Relación con vehículo
    vehiculo = relationship(
        "Vehiculo",
        lazy="joined"
    )

    # Relación con creador (admin)
    creador = relationship(
        "Usuario",
        foreign_keys=[id_creador],
        back_populates="rutas_creadas",
        lazy="raise"
    )

    # Relación con entregas (excesiva → evitar cargar)
    entregas = relationship(
        "Entrega",
        back_populates="ruta",
        lazy="raise"
    )

# ======================================================
# ENTREGAS
# ======================================================

class Entrega(Base):
    __tablename__ = "entregas"

    id_entrega = Column(Integer, primary_key=True, index=True)
    id_ruta = Column(Integer, ForeignKey("rutas.id_ruta"))
    id_cliente = Column(Integer, ForeignKey("clientes.id_cliente"))
    direccion = Column(String(255))
    estado = Column(Enum(EstadoEntrega), default=EstadoEntrega.pendiente)
    fecha_entrega = Column(Date)
    hora_entrega = Column(Time)
    observaciones = Column(Text)

    ruta = relationship("Ruta", back_populates="entregas", lazy="joined")
    cliente = relationship("Cliente", lazy="joined")
    paquetes = relationship("Paquete", back_populates="entrega", lazy="raise")
    seguimientos = relationship("Seguimiento", back_populates="entrega", lazy="raise")

class Paquete(Base):
    __tablename__ = "paquetes"

    id_paquete = Column(Integer, primary_key=True, index=True)
    id_entrega = Column(Integer, ForeignKey("entregas.id_entrega"))
    descripcion = Column(String(200))
    peso = Column(DECIMAL(10, 2))
    valor = Column(DECIMAL(10, 2))

    entrega = relationship("Entrega", back_populates="paquetes", lazy="joined")

class Seguimiento(Base):
    __tablename__ = "seguimiento"

    id_seguimiento = Column(Integer, primary_key=True, index=True)
    id_entrega = Column(Integer, ForeignKey("entregas.id_entrega"))
    fecha = Column(DateTime, default=func.now())
    estado = Column(Enum(EstadoEntrega))
    comentario = Column(Text)

    entrega = relationship("Entrega", back_populates="seguimientos", lazy="joined")
