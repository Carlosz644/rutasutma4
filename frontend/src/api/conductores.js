import api from "./axios";

export async function getConductores() {
  return (await api.get("/conductores/")).data;
}

export async function getConductor(id) {
  return (await api.get(`/conductores/${id}`)).data;
}

export async function createConductor(data) {
  return (await api.post("/conductores/", data)).data;
}

export async function updateConductor(id, data) {
  return (await api.put(`/conductores/${id}`, data)).data;
}

export async function deleteConductor(id) {
  return (await api.delete(`/conductores/${id}`)).data;
}
