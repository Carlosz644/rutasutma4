import api from "./api";

export async function getVehiculos() {
  const res = await api.get("/vehiculos/");
  return res.data;
}

export async function createVehiculo(data) {
  const res = await api.post("/vehiculos/", data);
  return res.data;
}

export async function updateVehiculo(id, data) {
  const res = await api.put(`/vehiculos/${id}`, data);
  return res.data;
}

export async function deleteVehiculo(id) {
  const res = await api.delete(`/vehiculos/${id}`);
  return res.data;
}
