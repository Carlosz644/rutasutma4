import { useState } from "react";
import { UserPlus, Mail, Lock, User } from "lucide-react";
import { createUsuario } from "../api/usuarios";

export default function Register({ onRegister, onBackToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState(""); // se usará como username
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      setLoading(true);

      // 🔥 FORMATO REAL DE TU BACKEND FASTAPI
      const userData = {
        username: email,    // backend usa "username"
        nombre: name,
        password: password,
        rol: "repartidor",  // si quieres otro rol, cámbialo aquí
      };

      const newUser = await createUsuario(userData);

      setSuccess("Cuenta creada exitosamente. Redirigiendo...");

      setTimeout(() => {
        onRegister({
          id: newUser.id_usuario,
          email: email,
          name: name,
          role: newUser.rol,
        });
      }, 1500);

    } catch (err) {
      console.error(err);

      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Error conectando con el servidor");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-black text-white rounded-lg mb-4">
            <UserPlus className="w-8 h-8" />
          </div>
          <h1 className="text-3xl mb-2">Crear Cuenta</h1>
          <p className="text-gray-600">Únete al Sistema de Rutas</p>
        </div>

        {error && (
          <div className="bg-red-100 border-2 border-red-500 text-red-700 p-3 mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border-2 border-green-500 text-green-700 p-3 mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block mb-2">Nombre Completo</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-black"
                placeholder="Juan Pérez"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-2">Usuario / Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-black"
                placeholder="usuario@mail.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-2">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-black"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-2">Confirmar Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-black"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            {loading ? "Creando..." : "Crear Cuenta"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            ¿Ya tienes cuenta?{" "}
            <button onClick={onBackToLogin} className="hover:underline">
              Inicia sesión aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
