// frontend/src/components/Rutas.jsx
import { useState, useEffect, useMemo } from "react";
import { Edit2, Trash2, MapPin } from "lucide-react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

import {
  getRutas,
  createRuta,
  updateRuta,
  deleteRuta,
} from "../api/rutas";

import { getVehiculos } from "../api/vehiculos";
import { getEntregasPorRuta } from "../api/entregas";

export default function Rutas({ userId, userRole }) {
  const [rutas, setRutas] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);

  // Formulario crear ruta
  const [formData, setFormData] = useState({
    nombre_ruta: "",
    id_vehiculo: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    nombre_ruta: "",
    id_vehiculo: "",
    fecha: "",
  });

  // MAPA
  const [rutaSeleccionada, setRutaSeleccionada] = useState(null);
  const [paradas, setParadas] = useState([]);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  // Centro del mapa
  const center = useMemo(() => {
    if (paradas.length > 0) {
      const c = paradas[0].cliente;
      return {
        lat: Number(c.latitud),
        lng: Number(c.longitud),
      };
    }
    return { lat: 21.8853, lng: -102.2916 }; // Default Aguascalientes
  }, [paradas]);

  // =========================
  // CARGAR DATOS
  // =========================
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [r, v] = await Promise.all([
        getRutas(),
        getVehiculos(),
      ]);

      const rutasFiltradas =
        userRole === "repartidor"
          ? r.filter((ruta) => ruta.id_repartidor === userId)
          : r;

      setRutas(rutasFiltradas);
      setVehiculos(v);
    } catch (err) {
      console.error("Error cargando datos:", err);
    }
  };

  // =========================
  // CARGAR SOLO MARCADORES
  // =========================
  const cargarParadasRuta = async (ruta) => {
    try {
      setRutaSeleccionada(ruta);
      const entregas = await getEntregasPorRuta(ruta.id_ruta);
      setParadas(entregas || []);
    } catch (err) {
      console.error("Error:", err);
      setParadas([]);
    }
  };

  // =========================
  // CREAR RUTA
  // =========================
  const handleCreateSubmit = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("currentUser"));

    const data = {
      nombre_ruta: formData.nombre_ruta,
      id_repartidor: user.id,
      id_vehiculo: formData.id_vehiculo ? parseInt(formData.id_vehiculo) : null,
      fecha: new Date().toISOString().slice(0, 10),
      id_creador: user.id,
    };

    try {
      await createRuta(data);
      alert("Ruta creada");
      setFormData({ nombre_ruta: "", id_vehiculo: "" });
      cargarDatos();
    } catch (err) {
      console.error(err);
      alert("Error al crear ruta");
    }
  };

  // =========================
  // EDITAR
  // =========================
  const handleEditClick = (ruta) => {
    setEditingId(ruta.id_ruta);
    setEditForm({
      nombre_ruta: ruta.nombre_ruta,
      id_vehiculo: ruta.vehiculo?.id_vehiculo || "",
      fecha: ruta.fecha,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const data = {
      nombre_ruta: editForm.nombre_ruta,
      id_repartidor: rutas.find((r) => r.id_ruta === editingId)?.id_repartidor,
      id_vehiculo: editForm.id_vehiculo ? parseInt(editForm.id_vehiculo) : null,
      fecha: editForm.fecha,
    };

    try {
      await updateRuta(editingId, data);
      alert("Ruta actualizada");
      setEditingId(null);
      cargarDatos();
    } catch {
      alert("Error al actualizar");
    }
  };

  // =========================
  // ELIMINAR
  // =========================
  const handleDelete = async (id_ruta) => {
    if (!confirm("¿Eliminar ruta?")) return;
    try {
      await deleteRuta(id_ruta);
      alert("Ruta eliminada");
      cargarDatos();
    } catch {
      alert("Error");
    }
  };

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* IZQUIERDA: CRUD */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Rutas</h2>

        {/* Crear solo si NO es repartidor */}
        {userRole !== "repartidor" && (
          <div className="bg-white p-4 border-2 border-black shadow mb-6">
            <h3 className="text-lg font-bold mb-3">Crear Ruta</h3>

            <form onSubmit={handleCreateSubmit} className="grid grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Nombre de ruta"
                className="border p-2 col-span-3"
                value={formData.nombre_ruta}
                onChange={(e) =>
                  setFormData({ ...formData, nombre_ruta: e.target.value })
                }
                required
              />

              <select
                className="border p-2 col-span-3"
                value={formData.id_vehiculo}
                onChange={(e) =>
                  setFormData({ ...formData, id_vehiculo: e.target.value })
                }
              >
                <option value="">Vehículo</option>
                {vehiculos.map((v) => (
                  <option key={v.id_vehiculo} value={v.id_vehiculo}>
                    {v.marca} {v.modelo}
                  </option>
                ))}
              </select>

              <button className="col-span-3 bg-black text-white px-4 py-2">
                Crear Ruta
              </button>
            </form>
          </div>
        )}

        {/* Tabla */}
        <div className="bg-white p-4 border-2 border-black shadow">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 border-b-2 border-black">
                <th className="p-3">ID</th>
                <th className="p-3">Ruta</th>
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
                  <td className="p-3">
                    {r.vehiculo
                      ? `${r.vehiculo.marca} ${r.vehiculo.modelo}`
                      : "Sin vehículo"}
                  </td>
                  <td className="p-3">{r.fecha}</td>
                  <td className="p-3 text-center space-x-2">
                    <button
                      className="border-2 border-black px-2 py-1"
                      onClick={() => cargarParadasRuta(r)}
                    >
                      <MapPin className="inline w-4 h-4" />
                    </button>

                    {userRole !== "repartidor" && (
                      <>
                        <button
                          className="border-2 border-black px-2 py-1"
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
                      </>
                    )}
                  </td>
                </tr>
              ))}

              {rutas.length === 0 && (
                <tr>
                  <td className="p-3 text-center" colSpan={5}>
                    No hay rutas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DERECHA — MAPA */}
      <div className="bg-white p-4 border-2 border-black shadow h-[600px] flex flex-col">
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          {rutaSeleccionada
            ? `Mapa: ${rutaSeleccionada.nombre_ruta}`
            : "Selecciona una ruta"}
        </h3>

        {isLoaded && (
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={center}
            zoom={paradas.length > 0 ? 13 : 12}
          >
            {/* SOLO MOSTRAR MARCADORES */}
            {paradas.map((p) =>
              p.cliente?.latitud && p.cliente?.longitud ? (
                <Marker
                  key={p.id_entrega}
                  position={{
                    lat: Number(p.cliente.latitud),
                    lng: Number(p.cliente.longitud),
                  }}
                />
              ) : null
            )}
          </GoogleMap>
        )}
      </div>
    </div>
  );
}
