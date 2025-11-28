from fastapi import APIRouter, Query
from src.services.geocoding import geocode

router = APIRouter(prefix="/geocode", tags=["Geocoding"])

@router.get("/")
def geocode_endpoint(address: str = Query(...)):
    lat, lng = geocode(address)
    return {"latitud": lat, "longitud": lng}
