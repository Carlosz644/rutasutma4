import api from "./axios";

export async function getVehiculos() {
  return (await api.get("/vehiculos/")).data;
}

export async function getVehiculo(id) {
  return (await api.get(`/vehiculos/${id}`)).data;
}

export async function createVehiculo(data) {
  return (await api.post("/vehiculos/", data)).data;
}

export async function updateVehiculo(id, data) {
  return (await api.put(`/vehiculos/${id}`, data)).data;
}

export async function deleteVehiculo(id) {
  return (await api.delete(`/vehiculos/${id}`)).data;
}
