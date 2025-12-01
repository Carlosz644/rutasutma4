# auth.py
from datetime import datetime, timedelta
from typing import Optional, List

from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from passlib.context import CryptContext

# Import correcto hacia DB y CRUD
from database import get_db
import crud


# ===========================================================
# CONFIG JWT
# ===========================================================
SECRET_KEY = "SUPERSECRETO123"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 120

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ===========================================================
# PASSWORDS
# ===========================================================
def verify_password(password: str, hashed_password: str) -> bool:
    return pwd_context.verify(password, hashed_password)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


# ===========================================================
# TOKENS
# ===========================================================
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# ===========================================================
# GET CURRENT USER DESDE TOKEN
# ===========================================================
def get_current_user(
    token: str = Depends(lambda: None),
    db: Session = Depends(get_db)
):
    if token is None:
        raise HTTPException(status_code=401, detail="Token no proporcionado")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        correo = payload.get("sub")

        if correo is None:
            raise HTTPException(status_code=401, detail="Token inválido")

    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")

    user = crud.get_user_by_correo(db, correo)

    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    return user


# ===========================================================
# ROLES
# ===========================================================
def require_roles(roles: List[str]):
    def role_checker(current_user=Depends(get_current_user)):
        if current_user.rol not in roles:
            raise HTTPException(status_code=403, detail="No tienes permisos suficientes")
        return current_user

    return role_checker
