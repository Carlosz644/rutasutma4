import { useState, useEffect } from "react";
import { getConductores, createConductor, updateConductor, deleteConductor } from "../api/conductores";
import { Plus, Edit2, Trash2, Save, X } from "lucide-react";

export default function Conductores() {
  const [conductores, setConductores] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(null);

  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    licencia: ""
  });

  // Cargar conductores
  useEffect(() => {
    loadConductores();
  }, []);

  const loadConductores = async () => {
    const data = await getConductores();
    setConductores(data);
  };

  // Guardar nuevo conductor
  const handleCreate = async () => {
    if (!formData.nombre.trim()) return alert("Nombre requerido");

    await createConductor(formData);
    setFormData({ nombre: "", telefono: "", licencia: "" });
    setIsCreating(false);
    loadConductores();
  };

  // Guardar edición
  const handleUpdate = async () => {
    if (!formData.nombre.trim()) return alert("Nombre requerido");

    await updateConductor(isEditing, formData);
    setIsEditing(null);
    setFormData({ nombre: "", telefono: "", licencia: "" });
    loadConductores();
  };

  // Eliminar conductor
  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este conductor?")) return;
    await deleteConductor(id);
    loadConductores();
  };

  // Cargar datos en formulario para editar
  const startEditing = (c) => {
    setIsEditing(c.id_conductor);
    setFormData({
      nombre: c.nombre,
      telefono: c.telefono,
      licencia: c.licencia
    });
  };

  return (
    <div className="p-6">

      {/* Título */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Conductores</h2>

        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white border-2 border-black hover:bg-gray-800"
        >
          <Plus className="w-4 h-4" />
          Nuevo Conductor
        </button>
      </div>

      {/* FORM CREAR */}
      {isCreating && (
        <div className="bg-gray-100 border-2 border-black p-4 mb-6 shadow">
          <h3 className="font-bold mb-2">Nuevo Conductor</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              className="border-2 border-black p-2"
              placeholder="Nombre"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            />

            <input
              className="border-2 border-black p-2"
              placeholder="Teléfono"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
            />

            <input
              className="border-2 border-black p-2"
              placeholder="Licencia"
              value={formData.licencia}
              onChange={(e) => setFormData({ ...formData, licencia: e.target.value })}
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
              <th className="p-3 text-left border-b border-black">Nombre</th>
              <th className="p-3 text-left border-b border-black">Teléfono</th>
              <th className="p-3 text-left border-b border-black">Licencia</th>
              <th className="p-3 text-left border-b border-black">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {conductores.map((c) => (
              <tr key={c.id_conductor} className="border-b border-gray-300">

                {/* SI ESTÁ EDITANDO */}
                {isEditing === c.id_conductor ? (
                  <>
                    <td className="p-3">{c.id_conductor}</td>

                    <td className="p-3">
                      <input
                        className="border-2 border-black p-2 w-full"
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      />
                    </td>

                    <td className="p-3">
                      <input
                        className="border-2 border-black p-2 w-full"
                        value={formData.telefono}
                        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      />
                    </td>

                    <td className="p-3">
                      <input
                        className="border-2 border-black p-2 w-full"
                        value={formData.licencia}
                        onChange={(e) => setFormData({ ...formData, licencia: e.target.value })}
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
                    {/* FILA NORMAL */}
                    <td className="p-3">{c.id_conductor}</td>
                    <td className="p-3">{c.nombre}</td>
                    <td className="p-3">{c.telefono}</td>
                    <td className="p-3">{c.licencia}</td>

                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => startEditing(c)}
                        className="px-3 py-2 border-2 border-black hover:bg-gray-100 flex items-center gap-1"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(c.id_conductor)}
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
