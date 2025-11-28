import { useState } from "react";
import { KeyRound, Mail, ArrowLeft, Lock, Shield } from "lucide-react";

export default function ForgotPassword({ onBackToLogin }) {
  const [step, setStep] = useState("email"); // 'email' | 'methods' | 'sms' | 'security' | 'newpassword'
  const [email, setEmail] = useState("");
  const [smsCode, setSmsCode] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email.includes("@") || !email.includes(".")) {
      setError("Ingresa un correo electrónico válido");
      return;
    }

    // 🔥 SIMULACIÓN
    // SÍEMPRE avanza (sin verificar usuario real)
    setStep("methods");
  };

  const handleMethodSelection = (method) => {
    setStep(method);
    setError("");
  };

  const handleSmsSubmit = (e) => {
    e.preventDefault();
    if (smsCode === "123456") {
      setStep("newpassword");
    } else {
      setError("Código incorrecto. Para esta demo usa: 123456");
    }
  };

  const handleSecuritySubmit = (e) => {
    e.preventDefault();
    if (securityAnswer.toLowerCase().includes("demo")) {
      setStep("newpassword");
    } else {
      setError('Respuesta incorrecta. Escribe algo que contenga "demo"');
    }
  };

  const handlePasswordReset = (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (newPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    // 🔥 No se actualiza en backend, solo simulación
    alert("Contraseña restablecida correctamente (simulación).");
    onBackToLogin();
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">

        {/* Volver */}
        <button
          onClick={onBackToLogin}
          className="flex items-center gap-2 mb-6 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio de sesión
        </button>

        {/* Paso: EMAIL */}
        {step === "email" && (
          <>
            <div className="text-center mb-8">
              <div className="inline-block p-4 bg-black text-white rounded-lg mb-4">
                <KeyRound className="w-8 h-8" />
              </div>
              <h1 className="text-3xl mb-2">Recuperar Contraseña</h1>
              <p className="text-gray-600">Ingresa tu correo electrónico</p>
            </div>

            {error && (
              <div className="bg-red-100 border-2 border-red-500 text-red-700 p-3 mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className="block mb-2">Correo Electrónico</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-black"
                    placeholder="tu@email.com"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-3 border-2 border-black"
              >
                Continuar
              </button>
            </form>
          </>
        )}

        {/* Paso: MÉTODOS */}
        {step === "methods" && (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl mb-2">Método de Recuperación</h1>
              <p className="text-gray-600">Elige cómo deseas recuperar tu cuenta</p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => handleMethodSelection("sms")}
                className="w-full p-4 border-2 border-black flex items-center gap-4 hover:bg-gray-50"
              >
                <div className="p-3 bg-black text-white rounded-lg">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <div>Código por SMS</div>
                  <p className="text-sm text-gray-600">
                    Enviaremos un código a tu teléfono
                  </p>
                </div>
              </button>

              <button
                onClick={() => handleMethodSelection("security")}
                className="w-full p-4 border-2 border-black flex items-center gap-4 hover:bg-gray-50"
              >
                <div className="p-3 bg-black text-white rounded-lg">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <div>Pregunta de seguridad</div>
                  <p className="text-sm text-gray-600">
                    Responde tu pregunta de seguridad
                  </p>
                </div>
              </button>
            </div>
          </>
        )}

        {/* Paso: SMS */}
        {step === "sms" && (
          <>
            <div className="text-center mb-8">
              <div className="inline-block p-4 bg-black text-white rounded-lg mb-4">
                <Mail className="w-8 h-8" />
              </div>
              <h1 className="text-3xl mb-2">Código SMS</h1>
              <p className="text-gray-600">Ingresa el código enviado</p>
            </div>

            {error && (
              <div className="bg-red-100 border-2 border-red-500 text-red-700 p-3 mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSmsSubmit} className="space-y-4">
              <div>
                <label className="block mb-2">Código</label>
                <input
                  type="text"
                  value={smsCode}
                  onChange={(e) => setSmsCode(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-black text-center text-2xl tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
              </div>

              <button className="w-full bg-black text-white py-3 border-2 border-black">
                Verificar
              </button>
            </form>
          </>
        )}

        {/* Paso: PREGUNTA DE SEGURIDAD */}
        {step === "security" && (
          <>
            <div className="text-center mb-8">
              <div className="inline-block p-4 bg-black text-white rounded-lg mb-4">
                <Shield className="w-8 h-8" />
              </div>
              <h1 className="text-3xl mb-2">Pregunta de Seguridad</h1>
              <p className="text-gray-600">
                ¿Cuál es el nombre de tu primera mascota?
              </p>
            </div>

            {error && (
              <div className="bg-red-100 border-2 border-red-500 text-red-700 p-3 mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSecuritySubmit} className="space-y-4">
              <div>
                <label className="block mb-2">Tu respuesta</label>
                <input
                  type="text"
                  value={securityAnswer}
                  onChange={(e) => setSecurityAnswer(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-black"
                  placeholder="Escribe tu respuesta"
                  required
                />
              </div>

              <button className="w-full bg-black text-white py-3 border-2 border-black">
                Verificar
              </button>
            </form>
          </>
        )}

        {/* Paso: NUEVA CONTRASEÑA */}
        {step === "newpassword" && (
          <>
            <div className="text-center mb-8">
              <div className="inline-block p-4 bg-black text-white rounded-lg mb-4">
                <Lock className="w-8 h-8" />
              </div>
              <h1 className="text-3xl mb-2">Nueva Contraseña</h1>
              <p className="text-gray-600">Crea tu nueva contraseña</p>
            </div>

            {error && (
              <div className="bg-red-100 border-2 border-red-500 text-red-700 p-3 mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div>
                <label className="block mb-2">Nueva Contraseña</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-black"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div>
                <label className="block mb-2">Confirmar Contraseña</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-black"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button className="w-full bg-black text-white py-3 border-2 border-black">
                Restablecer Contraseña
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
