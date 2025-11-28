import api from "./axios";

// Crear una nota (seguimiento)
export async function createSeguimiento({ id_entrega, nota, tipo }) {
  const res = await api.post("/seguimiento/", {
    id_entrega,
    comentario: nota,
    estado: tipo    // info / warning / fallido / etc
  });
  return res.data;
}

// Obtener todas las notas de una entrega
export async function getSeguimientosPorEntrega(id_entrega) {
  const res = await api.get(`/seguimiento/entrega/${id_entrega}`);
  return res.data;
}
