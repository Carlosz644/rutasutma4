import api from "./axios";

/* ===========================
   LISTAR USUARIOS
=========================== */
export async function getUsuarios() {
  const response = await api.get("/usuarios/");
  return response.data;
}

/* ===========================
   OBTENER USUARIO POR ID
=========================== */
export async function getUsuario(id) {
  const response = await api.get(`/usuarios/${id}`);
  return response.data;
}

/* ===========================
   CREAR USUARIO
=========================== */
export async function createUsuario(data) {
  const response = await api.post("/usuarios/", data);
  return response.data;
}

/* ===========================
   ACTUALIZAR USUARIO
=========================== */
export async function updateUsuario(id, data) {
  const response = await api.put(`/usuarios/${id}`, data);
  return response.data;
}

/* ===========================
   ELIMINAR USUARIO
=========================== */
export async function deleteUsuario(id) {
  const response = await api.delete(`/usuarios/${id}`);
  return response.data;
}

/* ===========================
   CAMBIAR PASSWORD (ADMIN)
=========================== */
export async function cambiarPasswordAdmin(id, newPassword) {
  const response = await api.put(`/usuarios/${id}/cambiar_password`, {
    nueva_password: newPassword,
  });
  return response.data;
}

/* ===========================
   CAMBIAR MI PASSWORD (USUARIO LOGUEADO)
=========================== */
export async function cambiarMiPassword(oldPassword, newPassword) {
  const response = await api.put(`/usuarios/cambiar_mi_password`, {
    password_actual: oldPassword,
    nueva_password: newPassword,
  });
  return response.data;
}
