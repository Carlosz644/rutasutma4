from ..models.rutas_model import Ruta
from ..services.geocoding import geocode
from ..services.navigation_sdk import get_route

rutas_db: list[Ruta] = []


def registrar_ruta(ruta: Ruta) -> Ruta:
    lat, lng = geocode(ruta.direccion)
    ruta.latitud = lat
    ruta.longitud = lng

    if lat and lng:
        route_info = get_route(f"{lat},{lng}", "Aguascalientes, México")  
        if route_info:
            ruta.distancia_km = route_info.get("distance_km")
            ruta.duracion_min = route_info.get("duration_min")

    rutas_db.append(ruta)
    return ruta


def listar_rutas() -> list[Ruta]:
    return rutas_db
