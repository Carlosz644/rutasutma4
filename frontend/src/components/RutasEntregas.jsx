import { useEffect, useState } from "react";
import { getEntregasPorRuta, getCliente } from "../api/entregas";

export default function RutasEntregas({ idRuta, onVolver }) {
  const [entregas, setEntregas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarEntregas();
  }, [idRuta]);

  const cargarEntregas = async () => {
    setLoading(true);

    try {
      const data = await getEntregasPorRuta(idRuta);

      // Obtener nombre del cliente por cada entrega
      const entregasConCliente = await Promise.all(
        data.map(async (e) => {
          let cliente = null;
          try {
            cliente = await getCliente(e.id_cliente);
          } catch {
            cliente = { nombre: "Cliente no encontrado" };
          }

          return {
            ...e,
            clienteNombre: cliente.nombre,
          };
        })
      );

      setEntregas(entregasConCliente);
    } catch (err) {
      console.error("Error cargando entregas:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <button
        onClick={onVolver}
        className="px-4 py-2 mb-4 border-2 border-black bg-white"
      >
        ← Volver a rutas
      </button>

      <h2 className="text-xl font-bold mb-4">Entregas de la Ruta #{idRuta}</h2>

      <div className="bg-white border-2 border-black shadow p-4">
        {loading ? (
          <p className="text-center py-4">Cargando entregas...</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 border-b-2 border-black">
                <th className="p-3 text-left border-b border-black">ID</th>
                <th className="p-3 text-left border-b border-black">Cliente</th>
                <th className="p-3 text-left border-b border-black">Estado</th>
                <th className="p-3 text-left border-b border-black">Fecha</th>
                <th className="p-3 text-left border-b border-black">Hora</th>
              </tr>
            </thead>

            <tbody>
              {entregas.map((e) => (
                <tr key={e.id_entrega} className="border-b border-gray-300">
                  <td className="p-3">{e.id_entrega}</td>
                  <td className="p-3">{e.clienteNombre}</td>
                  <td className="p-3">{e.estado}</td>
                  <td className="p-3">{e.fecha_entrega}</td>
                  <td className="p-3">{e.hora_entrega}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
