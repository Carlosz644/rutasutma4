from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

# ============================
# 1. Importaciones de Rutas
# ============================

# 🚨 CAMBIO IMPORTANTE:
# Ya NO uses: from backend.src.routes...
# Debe ser:   from src.routes...

from src.routes.rutas_route import router as rutas_router
from src.routes.geocode_route import router as geocode_router
from src.routes.directions_route import router as directions_router
from src.routes.matrix_route import router as matrix_router
from src.routes.optimize_route import router as optimize_router
from src.routes.users_route import router as users_router
from src.routes.clientes_route import router as clientes_router
from src.routes.repartidores_route import router as repartidores_router
from src.routes.vehiculos_route import router as vehiculos_router
from src.routes.rutas_sql_route import router as rutas_sql_router
from src.routes.entregas_route import router as entregas_router
from src.routes.paquetes_route import router as paquetes_router
from src.routes.seguimiento_route import router as seguimiento_router
from src.routes.login_route import router as login_router
from src.routes.system_route import router as system_router
from src.routes.evidencias_route import router as evidencias_router





# ============================
# 2. Base de datos
# ============================

# Cambia ".database" por "database" porque estás dentro de backend/
from database import SessionLocal, engine
from importlib import import_module
import models  # importa los modelos ORM

# Crear tablas si no existen
models.Base.metadata.create_all(bind=engine)


# ============================
# 3. App FastAPI
# ============================

app = FastAPI(title="API de Rutas de Entrega Optimizada")


# ============================
# 4. CORS
# ============================

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================
# 5. DB Dependency
# ============================

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ============================
# 6. Registro de Rutas
# ============================
app.include_router(rutas_router)
app.include_router(geocode_router)
app.include_router(directions_router)
app.include_router(matrix_router)
app.include_router(optimize_router)
app.include_router(users_router)
app.include_router(clientes_router)
app.include_router(repartidores_router)
app.include_router(vehiculos_router)
app.include_router(rutas_sql_router)
app.include_router(entregas_router)
app.include_router(paquetes_router)
app.include_router(seguimiento_router)
app.include_router(login_router)
app.include_router(system_router)
app.include_router(evidencias_router)

# CORRECCIÓN: elimina "backend/uploads"
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")







