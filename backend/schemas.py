from pydantic import BaseModel, EmailStr
from datetime import date, time, datetime
from typing import List, Optional
import enum


# ============================================
# ENUMS
# ============================================

class EstadoEntrega(str, enum.Enum):
    pendiente = "pendiente"
    en_camino = "en camino"
    entregado = "entregado"
    retrasado = "retrasado"


class RolUsuario(str, enum.Enum):
    super_admin = "super_admin"
    admin = "admin"
    repartidor = "repartidor"


# ============================================
# 1. BASE MODELS
# ============================================

class ClienteBase(BaseModel):
    nombre: str
    direccion: Optional[str] = None
    telefono: Optional[str] = None
    correo: Optional[str] = None
    latitud: Optional[float] = None
    longitud: Optional[float] = None


class ConductorBase(BaseModel):
    nombre: str
    telefono: Optional[str] = None
    licencia: Optional[str] = None


class VehiculoBase(BaseModel):
    marca: str
    modelo: str
    placas: str
    capacidad: int


class RutaBase(BaseModel):
    nombre_ruta: str
    id_conductor: int
    id_vehiculo: int
    fecha: date


class EntregaBase(BaseModel):
    id_ruta: int
    id_cliente: int
    estado: Optional[EstadoEntrega] = EstadoEntrega.pendiente
    fecha_entrega: date
    hora_entrega: time
    observaciones: Optional[str] = None


class PaqueteBase(BaseModel):
    id_entrega: int
    descripcion: Optional[str] = None
    peso: Optional[float] = None
    valor: Optional[float] = None


class SeguimientoBase(BaseModel):
    id_entrega: int
    estado: EstadoEntrega
    comentario: Optional[str] = None


# ============================================
# 2. MODELOS COMPLETOS PARA RESPUESTA
# ============================================

class Cliente(ClienteBase):
    id_cliente: int
    class Config:
        from_attributes = True


class Conductor(ConductorBase):
    id_conductor: int
    class Config:
        from_attributes = True


class Vehiculo(VehiculoBase):
    id_vehiculo: int
    class Config:
        from_attributes = True


# ============================================
# RELACIONES PARA RUTA
# ============================================

class RutaConductor(BaseModel):
    id_conductor: int
    nombre: str
    class Config:
        from_attributes = True


class RutaVehiculo(BaseModel):
    id_vehiculo: int
    marca: str
    modelo: str
    class Config:
        from_attributes = True


class Ruta(BaseModel):
    id_ruta: int
    nombre_ruta: str
    fecha: date

    conductor: Optional[RutaConductor]
    vehiculo: Optional[RutaVehiculo]

    class Config:
        from_attributes = True


# ============================================
# ENTREGAS
# ============================================

class Entrega(EntregaBase):
    id_entrega: int
    class Config:
        from_attributes = True


class Paquete(PaqueteBase):
    id_paquete: int
    class Config:
        from_attributes = True


class Seguimiento(SeguimientoBase):
    id_seguimiento: int
    fecha: datetime
    class Config:
        from_attributes = True


# ============================================
# 3. OPTIMIZACIÓN DE RUTAS
# ============================================

class ResultadoRutaOptimizada(BaseModel):
    nombre: str
    direccion: str
    latitud: Optional[float] = None
    longitud: Optional[float] = None
    distancia_km: Optional[float] = None
    duracion_min: Optional[float] = None

    class Config:
        from_attributes = True


class ListaClientesOptimizar(BaseModel):
    cliente_ids: List[int]


# ============================================
# 4. USUARIOS Y LOGIN
# ============================================

class UsuarioBase(BaseModel):
    nombre: str
    correo: EmailStr
    rol: RolUsuario = RolUsuario.repartidor
    activo: bool = True


class UsuarioCreate(UsuarioBase):
    password: str


class Usuario(BaseModel):
    id_usuario: int
    nombre: str
    correo: EmailStr
    rol: RolUsuario
    activo: bool
    creado_en: datetime

    class Config:
        from_attributes = True


class CambiarPassword(BaseModel):
    password_actual: str
    password_nueva: str
    confirmar_nueva: str


# ============================================
# 5. EVIDENCIAS
# ============================================

class EvidenciaBase(BaseModel):
    id_entrega: int
    url_foto: str
    tipo: str = "entrega"


class Evidencia(EvidenciaBase):
    id_evidencia: int
    fecha_subida: datetime
    class Config:
        from_attributes = True


# ============================================
# 6. CREAR RUTA DESDE FRONTEND
# ============================================

class RutaCreate(BaseModel):
    nombre_ruta: str
    id_conductor: int
    id_vehiculo: int
