import api from "./axios";

export async function getPaquetes() {
  return (await api.get("/paquetes/")).data;
}

export async function getPaquete(id) {
  return (await api.get(`/paquetes/${id}`)).data;
}

export async function createPaquete(data) {
  return (await api.post("/paquetes/", data)).data;
}

export async function updatePaquete(id, data) {
  return (await api.put(`/paquetes/${id}`, data)).data;
}

export async function deletePaquete(id) {
  return (await api.delete(`/paquetes/${id}`)).data;
}
