import axios from "axios";

export async function login(correo, password) {
  try {
    const response = await axios.post("http://127.0.0.1:8000/login/", {
      correo: correo,
      password: password
    });

    console.log("📡 Status recibido del backend:", response.status);
    return response.data;

  } catch (error) {
    console.error("❌ Error en login:", error.response?.data || error.message);
    throw new Error("Credenciales inválidas");
  }
}
