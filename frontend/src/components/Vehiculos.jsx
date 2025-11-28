import { useState, useEffect } from "react";
import {
  getVehiculos,
  createVehiculo,
  updateVehiculo,
  deleteVehiculo,
} from "../api/vehiculos";

import { Plus, Edit2, Trash2, Save, X } from "lucide-react";

export default function Vehiculos() {
  const [vehiculos, setVehiculos] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(null);

  const [formData, setFormData] = useState({
    marca: "",
    modelo: "",
    placas: "",
    capacidad: "",
  });

  // Cargar vehículos
  useEffect(() => {
    loadVehiculos();
  }, []);

  const loadVehiculos = async () => {
    const data = await getVehiculos();
    setVehiculos(data);
  };

  // Crear vehículo
  const handleCreate = async () => {
    if (!formData.marca.trim() || !formData.modelo.trim())
      return alert("Marca y Modelo son obligatorios");

    await createVehiculo(formData);
    setFormData({ marca: "", modelo: "", placas: "", capacidad: "" });
    setIsCreating(false);
    loadVehiculos();
  };

  // Guardar edición
  const handleUpdate = async () => {
    if (!formData.marca.trim() || !formData.modelo.trim())
      return alert("Marca y Modelo son obligatorios");

    await updateVehiculo(isEditing, formData);
    setIsEditing(null);
    setFormData({ marca: "", modelo: "", placas: "", capacidad: "" });
    loadVehiculos();
  };

  // Eliminar vehículo
  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este vehículo?")) return;
    await deleteVehiculo(id);
    loadVehiculos();
  };

  const startEditing = (v) => {
    setIsEditing(v.id_vehiculo);
    setFormData({
      marca: v.marca,
      modelo: v.modelo,
      placas: v.placas,
      capacidad: v.capacidad,
    });
  };

  return (
    <div className="p-6">
      
      {/* Título */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Vehículos</h2>

        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white border-2 border-black hover:bg-gray-800"
        >
          <Plus className="w-4 h-4" />
          Nuevo Vehículo
        </button>
      </div>

      {/* FORM CREAR */}
      {isCreating && (
        <div className="bg-gray-100 border-2 border-black p-4 mb-6 shadow">
          <h3 className="font-bold mb-2">Nuevo Vehículo</h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              className="border-2 border-black p-2"
              placeholder="Marca"
              value={formData.marca}
              onChange={(e) =>
                setFormData({ ...formData, marca: e.target.value })
              }
            />

            <input
              className="border-2 border-black p-2"
              placeholder="Modelo"
              value={formData.modelo}
              onChange={(e) =>
                setFormData({ ...formData, modelo: e.target.value })
              }
            />

            <input
              className="border-2 border-black p-2"
              placeholder="Placas"
              value={formData.placas}
              onChange={(e) =>
                setFormData({ ...formData, placas: e.target.value })
              }
            />

            <input
              className="border-2 border-black p-2"
              placeholder="Capacidad (Kg)"
              value={formData.capacidad}
              onChange={(e) =>
                setFormData({ ...formData, capacidad: e.target.value })
              }
            />
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-black text-white border-2 border-black hover:bg-gray-800 flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Guardar
            </button>

            <button
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 border-2 border-black hover:bg-gray-100 flex items-center gap-2"
            >
              <X className="w-4 h-4" /> Cancelar
            </button>
          </div>
        </div>
      )}

      {/* TABLA */}
      <div className="bg-white border-2 border-black shadow p-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 border-b-2 border-black">
              <th className="p-3 text-left border-b border-black">ID</th>
              <th className="p-3 text-left border-b border-black">Marca</th>
              <th className="p-3 text-left border-b border-black">Modelo</th>
              <th className="p-3 text-left border-b border-black">Placas</th>
              <th className="p-3 text-left border-b border-black">Capacidad</th>
              <th className="p-3 text-left border-b border-black">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {vehiculos.map((v) => (
              <tr key={v.id_vehiculo} className="border-b border-gray-300">

                {isEditing === v.id_vehiculo ? (
                  <>
                    <td className="p-3">{v.id_vehiculo}</td>

                    <td className="p-3">
                      <input
                        className="border-2 border-black p-2 w-full"
                        value={formData.marca}
                        onChange={(e) =>
                          setFormData({ ...formData, marca: e.target.value })
                        }
                      />
                    </td>

                    <td className="p-3">
                      <input
                        className="border-2 border-black p-2 w-full"
                        value={formData.modelo}
                        onChange={(e) =>
                          setFormData({ ...formData, modelo: e.target.value })
                        }
                      />
                    </td>

                    <td className="p-3">
                      <input
                        className="border-2 border-black p-2 w-full"
                        value={formData.placas}
                        onChange={(e) =>
                          setFormData({ ...formData, placas: e.target.value })
                        }
                      />
                    </td>

                    <td className="p-3">
                      <input
                        className="border-2 border-black p-2 w-full"
                        value={formData.capacidad}
                        onChange={(e) =>
                          setFormData({ ...formData, capacidad: e.target.value })
                        }
                      />
                    </td>

                    <td className="p-3 flex gap-2">
                      <button
                        onClick={handleUpdate}
                        className="px-3 py-2 bg-black text-white border-2 border-black hover:bg-gray-800 flex items-center gap-1"
                      >
                        <Save className="w-4 h-4" /> Guardar
                      </button>

                      <button
                        onClick={() => setIsEditing(null)}
                        className="px-3 py-2 border-2 border-black hover:bg-gray-100 flex items-center gap-1"
                      >
                        <X className="w-4 h-4" /> Cancelar
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    {/* MODO NORMAL */}
                    <td className="p-3">{v.id_vehiculo}</td>
                    <td className="p-3">{v.marca}</td>
                    <td className="p-3">{v.modelo}</td>
                    <td className="p-3">{v.placas}</td>
                    <td className="p-3">{v.capacidad}</td>

                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => startEditing(v)}
                        className="px-3 py-2 border-2 border-black hover:bg-gray-100 flex items-center gap-1"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(v.id_vehiculo)}
                        className="px-3 py-2 border-2 border-red-500 text-red-500 hover:bg-red-50 flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </>
                )}

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
