import { useState } from "react";
import { LogIn, Mail, Lock } from "lucide-react";
import { login as loginAPI } from "../api/auth";

export function Login({ onLogin, onRegister, onForgotPassword }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 🔥 LOGIN REAL CONTRA EL BACKEND
      const result = await loginAPI(email, password);

      // result = {
      //   access_token: "...",
      //   usuario: { id, rol, nombre, ... }
      // }

      // Llamar al padre
      onLogin({
        id: result.usuario.id,
        email: email,
        name: result.usuario.nombre,
        role: result.usuario.rol,
      });

    } catch (err) {
      console.error(err);
      setError("Credenciales incorrectas o servidor no disponible.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-black text-white rounded-lg mb-4">
            <LogIn className="w-8 h-8" />
          </div>
          <h1 className="text-3xl mb-2">Iniciar Sesión</h1>
          <p className="text-gray-600">Bienvenido al Sistema de Rutas</p>
        </div>

        {error && (
          <div className="bg-red-100 border-2 border-red-500 text-red-700 p-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2">Usuario / Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="usuario / email"
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
                className="w-full pl-12 pr-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="button"
            onClick={onForgotPassword}
            className="text-sm hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </button>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 hover:bg-gray-800 transition-colors border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
          >
            {loading ? "Iniciando..." : "Iniciar Sesión"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            ¿No tienes cuenta?{" "}
            <button onClick={onRegister} className="hover:underline">
              Regístrate aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
