// frontend/src/api/auth.js

export async function login(correo, password) {
  console.log("📡 Enviando login a backend:", correo, password);

  const response = await fetch("http://127.0.0.1:8000/login/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      correo: correo,
      password: password
    }),
  });

  console.log("📡 Status recibido del backend:", response.status);

  if (!response.ok) {
    const text = await response.text();
    console.error("❌ Respuesta con error:", text);
    throw new Error("Credenciales inválidas");
  }

  return await response.json();
}
