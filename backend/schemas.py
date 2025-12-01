from pydantic import BaseModel, ConfigDict, EmailStr
from datetime import date, time, datetime
from typing import Optional, List
import enum

# ============================================
# ENUMS
# ============================================

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


# ============================================
# CLIENTES
# ============================================

class ClienteBase(BaseModel):
    nombre: str
    direccion: Optional[str] = None
    telefono: Optional[str] = None
    correo: Optional[str] = None
    latitud: Optional[float] = None
    longitud: Optional[float] = None


class Cliente(ClienteBase):
    id_cliente: int
    model_config = ConfigDict(from_attributes=True)


# ============================================
# USUARIOS
# ============================================

class UsuarioBase(BaseModel):
    nombre: str
    correo: EmailStr
    rol: RolUsuario
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

    model_config = ConfigDict(from_attributes=True)


class LoginData(BaseModel):
    correo: str
    password: str



    #Repartidor

class RepartidorBase(BaseModel):
    nombre: str
    correo: str

    class Config:
        from_attributes = True

class RepartidorCreate(RepartidorBase):
    password: str


class Repartidor(RepartidorBase):
    id_usuario: int
    rol: str = "repartidor"

    class Config:
        from_attributes = True



# ============================================
# VEHÍCULOS
# ============================================

class VehiculoBase(BaseModel):
    marca: str
    modelo: str
    placas: str
    capacidad: int


class Vehiculo(VehiculoBase):
    id_vehiculo: int
    model_config = ConfigDict(from_attributes=True)


# ============================================
# RUTAS
# ============================================

class RutaBase(BaseModel):
    nombre_ruta: str
    id_repartidor: int
    id_vehiculo: Optional[int]
    fecha: date
    id_creador: int

    model_config = ConfigDict(from_attributes=True)


class RutaCreate(RutaBase):
    pass


class Ruta(BaseModel):
    id_ruta: int
    nombre_ruta: str
    id_repartidor: int
    id_vehiculo: Optional[int]
    fecha: date
    id_creador: int

    model_config = ConfigDict(from_attributes=True)


class RutaCreateResponse(Ruta):
    pass


# ============================================
# ENTREGAS
# ============================================

class EntregaBase(BaseModel):
    id_ruta: int
    id_cliente: int
    estado: Optional[EstadoEntrega] = EstadoEntrega.pendiente
    fecha_entrega: date
    hora_entrega: time
    observaciones: Optional[str] = None


class Entrega(EntregaBase):
    id_entrega: int
    model_config = ConfigDict(from_attributes=True)


# ============================================
# PAQUETES
# ============================================

class PaqueteBase(BaseModel):
    id_entrega: int
    descripcion: Optional[str] = None
    peso: Optional[float] = None
    valor: Optional[float] = None


class Paquete(PaqueteBase):
    id_paquete: int
    model_config = ConfigDict(from_attributes=True)


# ============================================
# SEGUIMIENTO
# ============================================

class SeguimientoBase(BaseModel):
    id_entrega: int
    estado: EstadoEntrega
    comentario: Optional[str] = None


class Seguimiento(SeguimientoBase):
    id_seguimiento: int
    fecha: datetime
    model_config = ConfigDict(from_attributes=True)


# ============================================
# EVIDENCIAS
# ============================================

class EvidenciaBase(BaseModel):
    id_entrega: int
    url_foto: str
    tipo: str = "entrega"


class Evidencia(EvidenciaBase):
    id_evidencia: int
    fecha_subida: datetime
    model_config = ConfigDict(from_attributes=True)


# ============================================
# OPTIMIZACIÓN
# ============================================

class ResultadoRutaOptimizada(BaseModel):
    nombre: str
    direccion: str
    latitud: Optional[float]
    longitud: Optional[float]
    distancia_km: Optional[float]
    duracion_min: Optional[float]

    model_config = ConfigDict(from_attributes=True)


class ListaClientesOptimizar(BaseModel):
    cliente_ids: List[int]


# ============================================
# CAMBIO PASSWORD
# ============================================

class CambiarPassword(BaseModel):
    password_actual: str
    password_nueva: str
    confirmar_nueva: str
