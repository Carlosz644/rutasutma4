import { useEffect, useState } from "react";
import { getClientes } from "../api/clientes";
import { optimizarRuta } from "../api/rutas";

export default function RutaOptimizar() {
  const [clientes, setClientes] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getClientes().then(setClientes);
  }, []);

  const toggleCliente = (id) => {
    if (seleccionados.includes(id)) {
      setSeleccionados(seleccionados.filter((c) => c !== id));
    } else {
      setSeleccionados([...seleccionados, id]);
    }
  };

  const handleOptimizar = async () => {
    if (seleccionados.length === 0) {
      alert("Selecciona al menos un cliente.");
      return;
    }

    setLoading(true);

    try {
      const data = await optimizarRuta({
        cliente_ids: seleccionados,
      });

      setResultado(data);
    } catch (err) {
      console.error(err);
      alert("Error optimizando la ruta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">

      <h2 className="text-xl font-bold mb-4">Optimizar Ruta</h2>

      {/* LISTA DE CLIENTES */}
      <div className="bg-white border-2 border-black p-4 shadow mb-6">
        <h3 className="text-lg font-semibold mb-3">Selecciona clientes</h3>

        <div className="space-y-2 max-h-64 overflow-auto">
          {clientes.map((c) => (
            <label
              key={c.id_cliente}
              className="flex items-center gap-3 border-b py-2"
            >
              <input
                type="checkbox"
                checked={seleccionados.includes(c.id_cliente)}
                onChange={() => toggleCliente(c.id_cliente)}
              />
              <span>{c.nombre}</span>
            </label>
          ))}
        </div>
      </div>

      {/* BOTÓN OPTIMIZAR */}
      <button
        onClick={handleOptimizar}
        className="bg-black text-white px-4 py-2 mb-6"
        disabled={loading}
      >
        {loading ? "Calculando..." : "Optimizar Ruta"}
      </button>

      {/* RESULTADOS */}
      {resultado && (
        <div className="bg-white border-2 border-black p-6 shadow">
          <h3 className="text-lg font-semibold mb-4">
            Ruta optimizada (orden sugerido)
          </h3>

          <ol className="list-decimal ml-6 space-y-2">
            {resultado.map((punto, index) => (
              <li key={index} className="border-b pb-2">
                <strong>{punto.nombre}</strong>
                <br />
                <span className="text-gray-600">{punto.direccion}</span>
                <br />
                <span className="text-sm text-gray-500">
                  {punto.distancia_km} km — {punto.duracion_min} min
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
