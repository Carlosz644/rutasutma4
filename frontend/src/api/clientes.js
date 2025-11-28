import api from "./axios";

export async function getClientes() {
  return (await api.get("/clientes/")).data;
}

export async function getCliente(id) {
  return (await api.get(`/clientes/${id}`)).data;
}

export async function createCliente(data) {
  return (await api.post("/clientes/", data)).data;
}

export async function updateCliente(id, data) {
  return (await api.put(`/clientes/${id}`, data)).data;
}

export async function deleteCliente(id) {
  return (await api.delete(`/clientes/${id}`)).data;
}
