// frontend/src/api/rutas.js
import api from "./axios";

// Obtener todas las rutas
export async function getRutas() {
  return (await api.get("/rutas/")).data;
}

// Crear ruta (usa el schema RutaCreate en el backend)
export async function createRuta(data) {
  return (await api.post("/rutas/", data)).data;
}

// Actualizar ruta (usa RutaBase → necesita fecha)
export async function updateRuta(id_ruta, data) {
  return (await api.put(`/rutas/${id_ruta}`, data)).data;
}

// Eliminar ruta
export async function deleteRuta(id_ruta) {
  return (await api.delete(`/rutas/${id_ruta}`)).data;
}

// Optimizar (opcional, por si lo usas en otro lado)
export async function optimizarRuta(data) {
  return (await api.post("/rutas/optimizar", data)).data;
}
