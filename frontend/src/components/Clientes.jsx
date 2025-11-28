import { useState, useEffect } from "react";
import { User, Mail, MapPin, Phone, Plus, Edit2, Trash2 } from "lucide-react";
import { getClientes, createCliente, deleteCliente } from "../api/clientes";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: "",
    telefono: "",
    direccion: "",
    email: "",
  });

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      const data = await getClientes();
      setClientes(data);
    } catch (err) {
      console.error("Error cargando clientes:", err);
    }
  };

  const handleCrear = async () => {
    if (!nuevoCliente.nombre.trim()) return alert("Nombre requerido");

    try {
      await createCliente(nuevoCliente);
      setNuevoCliente({ nombre: "", telefono: "", direccion: "", email: "" });
      cargarClientes();
    } catch (err) {
      console.error("Error creando cliente:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar cliente?")) return;

    try {
      await deleteCliente(id);
      cargarClientes();
    } catch (err) {
      console.error("Error eliminando cliente:", err);
    }
  };

  return (
    <div className="p-6">

      <h2 className="text-2xl mb-4">Clientes</h2>

      {/* FORMULARIO NUEVO CLIENTE */}
      <div className="bg-white border-2 border-black p-4 mb-6">
        <h3 className="text-xl mb-2">Nuevo Cliente</h3>

        <input
          className="w-full border-2 border-black p-2 mb-2"
          placeholder="Nombre"
          value={nuevoCliente.nombre}
          onChange={(e) =>
            setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })
          }
        />

        <input
          className="w-full border-2 border-black p-2 mb-2"
          placeholder="Teléfono"
          value={nuevoCliente.telefono}
          onChange={(e) =>
            setNuevoCliente({ ...nuevoCliente, telefono: e.target.value })
          }
        />

        <input
          className="w-full border-2 border-black p-2 mb-2"
          placeholder="Dirección"
          value={nuevoCliente.direccion}
          onChange={(e) =>
            setNuevoCliente({ ...nuevoCliente, direccion: e.target.value })
          }
        />

        <input
          className="w-full border-2 border-black p-2 mb-2"
          placeholder="Email"
          value={nuevoCliente.email}
          onChange={(e) =>
            setNuevoCliente({ ...nuevoCliente, email: e.target.value })
          }
        />

        <button
          onClick={handleCrear}
          className="w-full bg-black text-white py-2 mt-2"
        >
          <Plus className="w-4 h-4 inline-block mr-2" />
          Crear Cliente
        </button>
      </div>

      {/* LISTA DE CLIENTES */}
      <div className="space-y-4">
        {clientes.map((c) => (
          <div
            key={c.id_cliente}
            className="bg-white border-2 border-black p-4 flex justify-between"
          >
            <div>
              <h4 className="text-lg">{c.nombre}</h4>
              <p className="text-gray-600"><Phone className="w-4 h-4 inline" /> {c.telefono}</p>
              <p className="text-gray-600"><Mail className="w-4 h-4 inline" /> {c.email}</p>
              <p className="text-gray-600"><MapPin className="w-4 h-4 inline" /> {c.direccion}</p>
            </div>

            <div className="flex gap-2">
              <button className="px-3 py-2 border-2 border-black">
                <Edit2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleDelete(c.id_cliente)}
                className="px-3 py-2 border-2 border-red-500 text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
