import { optimizarRuta } from "../api/rutas";

export default function TestRutaOptimizar() {

  const probar = async () => {
    try {
      const data = await optimizarRuta({
        cliente_ids: [1, 2, 3]
      });

      console.log("RESPUESTA DEL BACKEND:", data);
      alert("Revisa la consola (F12)");
    } catch (err) {
      console.error("ERROR:", err);
    }
  };

  return (
    <div className="p-10">
      <h1>Probar /rutas/optimizar</h1>
      <button
        className="bg-black text-white px-4 py-2"
        onClick={probar}
      >
        Probar Optimización
      </button>
    </div>
  );
}
