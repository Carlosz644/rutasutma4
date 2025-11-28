// frontend/src/components/Rutas.jsx
import { useState, useEffect } from "react";
import { Edit2, Trash2 } from "lucide-react";
import {
  getRutas,
  createRuta,
  updateRuta,
  deleteRuta,
} from "../api/rutas";
import { getConductores } from "../api/conductores";
import { getVehiculos } from "../api/vehiculos";

export default function Rutas() {
  const [rutas, setRutas] = useState([]);
  const [conductores, setConductores] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);

  // formulario de creación
  const [formData, setFormData] = useState({
    nombre_ruta: "",
    id_conductor: "",
    id_vehiculo: "",
  });

  // edición
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    nombre_ruta: "",
    id_conductor: "",
    id_vehiculo: "",
    fecha: "",
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const [r, c, v] = await Promise.all([
      getRutas(),
      getConductores(),
      getVehiculos(),
    ]);
    setRutas(r);
    setConductores(c);
    setVehiculos(v);
  };

  // =========================
  // CREAR RUTA
  // =========================
  const handleCreateSubmit = async (e) => {
    e.preventDefault();

    const data = {
      nombre_ruta: formData.nombre_ruta,
      id_conductor: parseInt(formData.id_conductor),
      id_vehiculo: parseInt(formData.id_vehiculo),
    };

    try {
      await createRuta(data);
      alert("✅ Ruta creada");
      setFormData({ nombre_ruta: "", id_conductor: "", id_vehiculo: "" });
      cargarDatos();
    } catch (err) {
      console.error(err);
      alert("❌ Error al crear ruta");
    }
  };

  // =========================
  // PREPARAR EDICIÓN
  // =========================
  const handleEditClick = (ruta) => {
    setEditingId(ruta.id_ruta);
    setEditForm({
      nombre_ruta: ruta.nombre_ruta,
      id_conductor: ruta.id_conductor,
      id_vehiculo: ruta.id_vehiculo,
      // la fecha viene como "2025-11-28"
      fecha: ruta.fecha || "",
    });
  };

  // =========================
  // GUARDAR EDICIÓN
  // =========================
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingId) return;

    const data = {
      nombre_ruta: editForm.nombre_ruta,
      id_conductor: parseInt(editForm.id_conductor),
      id_vehiculo: parseInt(editForm.id_vehiculo),
      fecha: editForm.fecha || new Date().toISOString().slice(0, 10),
    };

    try {
      await updateRuta(editingId, data);
      alert("✅ Ruta actualizada");
      setEditingId(null);
      cargarDatos();
    } catch (err) {
      console.error(err);
      alert("❌ Error al actualizar ruta");
    }
  };

  // =========================
  // ELIMINAR
  // =========================
  const handleDelete = async (id_ruta) => {
    if (!window.confirm("¿Eliminar esta ruta?")) return;

    try {
      await deleteRuta(id_ruta);
      alert("✅ Ruta eliminada");
      cargarDatos();
    } catch (err) {
      console.error(err);
      alert("❌ Error al eliminar ruta");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Rutas</h2>

      {/* FORMULARIO CREAR */}
      <div className="bg-white p-4 border-2 border-black shadow mb-6">
        <h3 className="text-lg font-bold mb-3">Crear Nueva Ruta</h3>

        <form onSubmit={handleCreateSubmit} className="grid grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Nombre de la ruta"
            className="border p-2"
            value={formData.nombre_ruta}
            onChange={(e) =>
              setFormData({ ...formData, nombre_ruta: e.target.value })
            }
            required
          />

          <select
            className="border p-2"
            value={formData.id_conductor}
            onChange={(e) =>
              setFormData({ ...formData, id_conductor: e.target.value })
            }
            required
          >
            <option value="">Selecciona Conductor</option>
            {conductores.map((c) => (
              <option key={c.id_conductor} value={c.id_conductor}>
                {c.nombre}
              </option>
            ))}
          </select>

          <select
            className="border p-2"
            value={formData.id_vehiculo}
            onChange={(e) =>
              setFormData({ ...formData, id_vehiculo: e.target.value })
            }
            required
          >
            <option value="">Selecciona Vehículo</option>
            {vehiculos.map((v) => (
              <option key={v.id_vehiculo} value={v.id_vehiculo}>
                {v.marca} {v.modelo}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="col-span-3 bg-black text-white px-4 py-2 mt-2"
          >
            Crear Ruta
          </button>
        </form>
      </div>

      {/* FORMULARIO EDICIÓN */}
      {editingId && (
        <div className="bg-yellow-50 p-4 border-2 border-black shadow mb-6">
          <h3 className="text-lg font-bold mb-3">
            Editar Ruta #{editingId}
          </h3>

          <form onSubmit={handleEditSubmit} className="grid grid-cols-4 gap-4">
            <input
              type="text"
              className="border p-2"
              value={editForm.nombre_ruta}
              onChange={(e) =>
                setEditForm({ ...editForm, nombre_ruta: e.target.value })
              }
              required
            />

            <select
              className="border p-2"
              value={editForm.id_conductor}
              onChange={(e) =>
                setEditForm({ ...editForm, id_conductor: e.target.value })
              }
              required
            >
              <option value="">Conductor</option>
              {conductores.map((c) => (
                <option key={c.id_conductor} value={c.id_conductor}>
                  {c.nombre}
                </option>
              ))}
            </select>

            <select
              className="border p-2"
              value={editForm.id_vehiculo}
              onChange={(e) =>
                setEditForm({ ...editForm, id_vehiculo: e.target.value })
              }
              required
            >
              <option value="">Vehículo</option>
              {vehiculos.map((v) => (
                <option key={v.id_vehiculo} value={v.id_vehiculo}>
                  {v.marca} {v.modelo}
                </option>
              ))}
            </select>

            <input
              type="date"
              className="border p-2"
              value={editForm.fecha}
              onChange={(e) =>
                setEditForm({ ...editForm, fecha: e.target.value })
              }
            />

            <div className="col-span-4 flex gap-2">
              <button
                type="submit"
                className="bg-black text-white px-4 py-2"
              >
                Guardar cambios
              </button>
              <button
                type="button"
                onClick={() => setEditingId(null)}
                className="border-2 border-black px-4 py-2"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TABLA RUTAS */}
      <div className="bg-white p-4 border-2 border-black shadow">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 border-b-2 border-black">
              <th className="p-3">ID</th>
              <th className="p-3">Ruta</th>
              <th className="p-3">Conductor</th>
              <th className="p-3">Vehículo</th>
              <th className="p-3">Fecha</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {rutas.map((r) => (
              <tr key={r.id_ruta} className="border-b">
                <td className="p-3">{r.id_ruta}</td>
                <td className="p-3">{r.nombre_ruta}</td>
                <td className="p-3">{r.conductor?.nombre || "Sin conductor"}</td>
                <td className="p-3">
                  {r.vehiculo
                    ? `${r.vehiculo.marca} ${r.vehiculo.modelo}`
                    : "Sin vehículo"}
                </td>
                <td className="p-3">{r.fecha}</td>
                <td className="p-3 text-center">
                  <button
                    className="border-2 border-black px-2 py-1 mr-2"
                    onClick={() => handleEditClick(r)}
                  >
                    <Edit2 className="inline w-4 h-4" />
                  </button>
                  <button
                    className="border-2 border-red-500 text-red-500 px-2 py-1"
                    onClick={() => handleDelete(r.id_ruta)}
                  >
                    <Trash2 className="inline w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}

            {rutas.length === 0 && (
              <tr>
                <td className="p-3 text-center" colSpan={6}>
                  No hay rutas registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
