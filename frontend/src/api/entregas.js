import api from "./axios";

// 🔥 Cargar TODAS las entregas COMPLETAS
export async function getAllEntregasFull() {
  const res = await api.get("/entregas/");
  const entregas = res.data;

  // Cargar datos relacionados (cliente, paquetes, seguimiento y evidencias)
  const fullData = await Promise.all(
    entregas.map(async (entrega) => {
      const [cliente, paquetes, seguimientos, evidencias] = await Promise.all([
        api.get(`/clientes/${entrega.id_cliente}`).then((r) => r.data),
        api.get(`/paquetes/?id_entrega=${entrega.id_entrega}`).then((r) => r.data),
        api.get(`/seguimiento/entrega/${entrega.id_entrega}`).then((r) => r.data),
        api.get(`/evidencias/${entrega.id_entrega}`).then((r) => r.data),
      ]);

      return {
        ...entrega,
        cliente,
        direccion: cliente?.direccion || "",
        paquetes,
        seguimientos,
        evidencias,
      };
    })
  );

  return fullData;
}

// 🔄 Actualizar entrega
export async function updateEntrega(id_entrega, data) {
  const res = await api.put(`/entregas/${id_entrega}`, data);
  return res.data;
}

// ❌ Eliminar entrega
export async function deleteEntrega(id_entrega) {
  const res = await api.delete(`/entregas/${id_entrega}`);
  return res.data;
}
