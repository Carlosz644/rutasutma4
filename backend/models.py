from __future__ import annotations
from sqlalchemy import Column, Integer, String, DECIMAL, ForeignKey, Date, Time, Text, Enum, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
import enum

from database import Base


# =====================================================
# ENUMS
# =====================================================

class EstadoEntrega(str, enum.Enum):
    pendiente = "pendiente"
    en_camino = "en camino"
    entregado = "entregado"
    retrasado = "retrasado"


class RolUsuario(str, enum.Enum):
    super_admin = "super_admin"
    admin = "admin"
    repartidor = "repartidor"


# =====================================================
# 1. CLIENTES
# =====================================================

class Cliente(Base):
    __tablename__ = "clientes"

    id_cliente = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    direccion = Column(String(200))
    telefono = Column(String(20))
    correo = Column(String(100))
    latitud = Column(DECIMAL(10, 7))
    longitud = Column(DECIMAL(10, 7))

    # NO cargar relaciones automáticamente → evita datos mezclados
    entregas = relationship("Entrega", back_populates="cliente", lazy="noload")


# =====================================================
# 2. CONDUCTORES
# =====================================================

class Conductor(Base):
    __tablename__ = "conductores"

    id_conductor = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    telefono = Column(String(20))
    licencia = Column(String(50))

    # MUY IMPORTANTE:
    # No queremos rutas dentro de conductores en el frontend
    rutas = relationship("Ruta", back_populates="conductor", lazy="noload")


# =====================================================
# 3. VEHÍCULOS
# =====================================================

class Vehiculo(Base):
    __tablename__ = "vehiculos"

    id_vehiculo = Column(Integer, primary_key=True, index=True)
    marca = Column(String(50))
    modelo = Column(String(50))
    placas = Column(String(20))
    capacidad = Column(Integer)

    # Igualmente, no queremos rutas dentro de vehículos
    rutas = relationship("Ruta", back_populates="vehiculo", lazy="noload")


# =====================================================
# 4. RUTAS
# =====================================================

class Ruta(Base):
    __tablename__ = "rutas"

    id_ruta = Column(Integer, primary_key=True, index=True)
    nombre_ruta = Column(String(100))
    id_conductor = Column(Integer, ForeignKey("conductores.id_conductor"))
    id_vehiculo = Column(Integer, ForeignKey("vehiculos.id_vehiculo"))
    fecha = Column(Date)

    # Estas SÍ deben venir al frontend → se cargan con lazy="joined"
    conductor = relationship("Conductor", back_populates="rutas", lazy="joined")
    vehiculo = relationship("Vehiculo", back_populates="rutas", lazy="joined")

    # Las entregas generalmente NO se deben cargar
    entregas = relationship("Entrega", back_populates="ruta", lazy="noload")


# =====================================================
# 5. ENTREGAS
# =====================================================

class Entrega(Base):
    __tablename__ = "entregas"

    id_entrega = Column(Integer, primary_key=True, index=True)
    id_ruta = Column(Integer, ForeignKey("rutas.id_ruta"))
    id_cliente = Column(Integer, ForeignKey("clientes.id_cliente"))
    estado = Column(Enum(EstadoEntrega), default=EstadoEntrega.pendiente)
    fecha_entrega = Column(Date)
    hora_entrega = Column(Time)
    observaciones = Column(Text)

    ruta = relationship("Ruta", back_populates="entregas", lazy="joined")
    cliente = relationship("Cliente", back_populates="entregas", lazy="joined")
    paquetes = relationship("Paquete", back_populates="entrega", lazy="noload")
    seguimientos = relationship("Seguimiento", back_populates="entrega", lazy="noload")


# =====================================================
# 6. PAQUETES
# =====================================================

class Paquete(Base):
    __tablename__ = "paquetes"

    id_paquete = Column(Integer, primary_key=True, index=True)
    id_entrega = Column(Integer, ForeignKey("entregas.id_entrega"))
    descripcion = Column(String(200))
    peso = Column(DECIMAL(10, 2))
    valor = Column(DECIMAL(10, 2))

    entrega = relationship("Entrega", back_populates="paquetes", lazy="joined")


# =====================================================
# 7. SEGUIMIENTO
# =====================================================

class Seguimiento(Base):
    __tablename__ = "seguimiento"

    id_seguimiento = Column(Integer, primary_key=True, index=True)
    id_entrega = Column(Integer, ForeignKey("entregas.id_entrega"))
    fecha = Column(DateTime, default=func.now())
    estado = Column(Enum(EstadoEntrega))
    comentario = Column(Text)

    entrega = relationship("Entrega", back_populates="seguimientos", lazy="joined")


# =====================================================
# 8. USUARIOS
# =====================================================

class Usuario(Base):
    __tablename__ = "usuarios"

    id_usuario = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    correo = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    rol = Column(Enum(RolUsuario), default=RolUsuario.repartidor, nullable=False)
    activo = Column(Integer, default=1, nullable=False)
    creado_en = Column(DateTime, default=func.now())


# =====================================================
# 9. EVIDENCIAS
# =====================================================

class Evidencia(Base):
    __tablename__ = "evidencias_entrega"

    id_evidencia = Column(Integer, primary_key=True, index=True)
    id_entrega = Column(Integer, ForeignKey("entregas.id_entrega"), nullable=False)
    url_foto = Column(String(500), nullable=False)
    tipo = Column(Enum("entrega", "documento", "cliente", "otro"), default="entrega")
    fecha_subida = Column(DateTime, default=datetime.utcnow)

    entrega = relationship("Entrega", lazy="joined")
