import api from "./axios";

// Obtener todas las rutas
export const getRutas = async () => {
  const res = await api.get("/rutas/");
  return res.data;
};

// Obtener entregas filtrando por ruta
export const getEntregasPorRuta = async (id_ruta) => {
  const res = await api.get(`/entregas/`, {
    params: { id_ruta }
  });
  return res.data;
};

// Paquetes por entrega
export const getPaquetesPorEntrega = async (id_entrega) => {
  const res = await api.get(`/paquetes/`, {
    params: { id_entrega }
  });
  return res.data;
};

// Seguimiento por entrega
export const getSeguimiento = async (id_entrega) => {
  const res = await api.get(`/seguimiento/entrega/${id_entrega}`);
  return res.data;
};
