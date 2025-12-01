import api from "./axios";

export const getRepartidores = async () => {
  const r = await api.get("/repartidores/");
  return r.data;
};

export const getRepartidor = async (id) => {
  const r = await api.get(`/repartidores/${id}`);
  return r.data;
};

export const createRepartidor = async (data) => {
  const r = await api.post("/repartidores/", data);
  return r.data;
};

export const updateRepartidor = async (id, data) => {
  const r = await api.put(`/repartidores/${id}`, data);
  return r.data;
};

export const deleteRepartidor = async (id) => {
  const r = await api.delete(`/repartidores/${id}`);
  return r.data;
};
