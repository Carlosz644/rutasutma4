import { useEffect, useState } from "react";
import {
  getRepartidores,
  createRepartidor,
  updateRepartidor,
  deleteRepartidor,
} from "../api/repartidores";

export default function Repartidores() {
  const [repartidores, setRepartidores] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRepartidores = async () => {
    try {
      const data = await getRepartidores();
      setRepartidores(data);
    } catch (error) {
      console.error("Error cargando repartidores:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRepartidores();
  }, []);

  if (loading) return <p>Cargando...</p>;

  return (
    <div>
      <h1>Repartidores</h1>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Correo</th>
          </tr>
        </thead>
        <tbody>
          {repartidores.map((r) => (
            <tr key={r.id_usuario}>
              <td>{r.id_usuario}</td>
              <td>{r.nombre}</td>
              <td>{r.correo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
