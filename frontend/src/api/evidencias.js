import api from "./axios";

// Subir foto evidencia
export async function subirEvidencia(id_entrega, file, tipo) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("tipo", tipo);

  const res = await api.post(`/evidencias/subir/${id_entrega}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  return res.data;
}
