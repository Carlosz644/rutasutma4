import { useState, useEffect } from "react";
import {
  Package,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  Camera,
  FileText,
  Trash2
} from "lucide-react";

import {
  getAllEntregasFull,
  updateEntrega,
  deleteEntrega
} from "../api/entregas";

import { subirEvidencia } from "../api/evidencias";
import { createSeguimiento } from "../api/seguimiento";

export default function Orders({ userRole }) {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(false);

  // =============================
  // 🔄 Cargar las entregas completas
  // =============================
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await getAllEntregasFull();
      setOrders(data);
    } catch (err) {
      console.error("Error cargando entregas:", err);
    }
    setLoading(false);
  };

  // =============================
  // 🔎 Filtrar entregas
  // =============================
  useEffect(() => {
    let filtered = [...orders];

    if (searchTerm) {
      filtered = filtered.filter((order) =>
        order.direccion?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.estado === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter]);

  // =============================
  // 🎨 Estilos según estado
  // =============================
  const getStatusColor = (estado) => {
    switch (estado) {
      case "entregado": return "bg-green-500";
      case "en_camino": return "bg-yellow-400";
      case "retrasado": return "bg-orange-500";
      case "fallido": return "bg-red-500";
      default: return "bg-gray-400";
    }
  };

  const getStatusText = (estado) => {
    switch (estado) {
      case "entregado": return "Entregado";
      case "en_camino": return "En Ruta";
      case "retrasado": return "Retrasado";
      case "fallido": return "Fallido";
      default: return "Pendiente";
    }
  };

  // =============================
  // 🔄 Actualizar estado
  // =============================
  const handleStatusChange = async (id_entrega, estado) => {
    await updateEntrega(id_entrega, { estado });
    loadOrders();
  };

  // =============================
  // ❌ Eliminar entrega
  // =============================
  const handleDeleteOrder = async (id_entrega) => {
    if (!confirm("¿Eliminar esta entrega?")) return;

    await deleteEntrega(id_entrega);
    loadOrders();
  };

  // =============================
  // 📝 Agregar Nota
  // =============================
  const handleAddNote = async (id_entrega) => {
    if (!newNote.trim()) return;

    await createSeguimiento({
      id_entrega,
      estado: "pendiente",
      comentario: newNote
    });

    setNewNote("");
    loadOrders();
  };

  // =============================
  // 📷 Subir evidencia
  // =============================
  const handleImageUpload = async (id_entrega, event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    await subirEvidencia(id_entrega, file);
    loadOrders();
  };

  // =============================
  // 🖼 RENDER
  // =============================
  return (
    <div className="p-6">

      {/* BUSCADOR Y FILTROS */}
      <div className="bg-white border-2 border-black p-6 shadow mb-6">
        <div className="flex flex-col md:flex-row gap-4">

          {/* 🟦 Buscar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              placeholder="Buscar dirección..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-black"
            />
          </div>

          {/* 🟦 Filtrar */}
          <div className="md:w-64 relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-black bg-white"
            >
              <option value="all">Todos</option>
              <option value="pendiente">Pendiente</option>
              <option value="en_camino">En Ruta</option>
              <option value="entregado">Entregado</option>
              <option value="retrasado">Retrasado</option>
              <option value="fallido">Fallido</option>
            </select>
          </div>
        </div>
      </div>

      {/* LISTA DE ENTREGAS */}
      <div className="space-y-4">

        {loading && <p className="text-center py-10">Cargando entregas…</p>}

        {!loading && filteredOrders.length === 0 && (
          <div className="bg-white border-2 border-black p-12 text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl">No hay entregas</h3>
          </div>
        )}

        {!loading &&
          filteredOrders.map((order) => (
            <div key={order.id_entrega} className="bg-white border-2 border-black p-6 shadow">

              {/* CABECERA */}
              <div className="flex justify-between">
                <div>
                  <h3 className="text-xl">Entrega #{order.id_entrega}</h3>
                  <p className="font-semibold">{order.cliente?.nombre}</p>
                  <p className="text-gray-600">{order.direccion}</p>
                </div>

                <span className={`px-3 py-1 text-white text-sm ${getStatusColor(order.estado)}`}>
                  {getStatusText(order.estado)}
                </span>
              </div>

              {/* EXPANDIR */}
              <button
                onClick={() =>
                  setExpandedOrderId(
                    expandedOrderId === order.id_entrega ? null : order.id_entrega
                  )
                }
                className="flex items-center gap-2 px-4 py-2 border-2 border-black mt-3"
              >
                {expandedOrderId === order.id_entrega ? (
                  <>
                    <ChevronUp /> Ocultar detalles
                  </>
                ) : (
                  <>
                    <ChevronDown /> Ver detalles
                  </>
                )}
              </button>

              {/* PANEL EXPANDIDO */}
              {expandedOrderId === order.id_entrega && (
                <div className="mt-4 p-4 bg-gray-50 border-2 border-gray-300 space-y-6">

                  {/* PAQUETES */}
                  <div>
                    <h4 className="flex items-center gap-2 mb-3">
                      <Package className="w-5 h-5" /> Paquetes
                    </h4>

                    {order.paquetes.length === 0 && <p>No hay paquetes.</p>}

                    {order.paquetes.map((p) => (
                      <div key={p.id_paquete} className="border p-3 bg-white mb-2">
                        <p><strong>Descripción:</strong> {p.descripcion}</p>
                        <p><strong>Peso:</strong> {p.peso} kg</p>
                        <p><strong>Valor:</strong> ${p.valor}</p>
                      </div>
                    ))}
                  </div>

                  {/* SEGUIMIENTO */}
                  <div>
                    <h4 className="flex items-center gap-2 mb-3">
                      <FileText className="w-5 h-5" /> Notas
                    </h4>

                    {order.seguimientos?.map((s) => (
                      <div key={s.id_seguimiento} className="border p-3 bg-white mb-2">
                        <p>{s.comentario}</p>
                        <small className="text-gray-500">
                          {new Date(s.fecha).toLocaleString()}
                        </small>
                      </div>
                    ))}

                    <textarea
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="border-2 border-black w-full p-2"
                      placeholder="Nueva nota…"
                    />

                    <button
                      onClick={() => handleAddNote(order.id_entrega)}
                      className="px-4 py-2 bg-black text-white mt-2"
                    >
                      Agregar nota
                    </button>
                  </div>

                  {/* EVIDENCIAS */}
                  <div>
                    <h4 className="flex items-center gap-2 mb-3">
                      <Camera className="w-5 h-5" /> Fotos
                    </h4>

                    <div className="grid grid-cols-3 gap-2">
                      {order.evidencias.map((ev) => (
                        <img
                          key={ev.id_evidencia}
                          src={ev.url_foto}
                          className="w-full h-24 object-cover border"
                        />
                      ))}
                    </div>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(order.id_entrega, e)}
                      className="border-2 border-black p-2 mt-2"
                    />
                  </div>
                </div>
              )}

              {/* ACCIONES ADMIN */}
              {userRole === "admin" && (
                <div className="flex gap-2 mt-4 pt-4 border-t">

                  <button
                    onClick={() => handleStatusChange(order.id_entrega, "en_camino")}
                    className="px-4 py-2 border-2 border-black hover:bg-yellow-50"
                  >
                    En Ruta
                  </button>

                  <button
                    onClick={() => handleStatusChange(order.id_entrega, "entregado")}
                    className="px-4 py-2 border-2 border-black hover:bg-green-50"
                  >
                    Entregado
                  </button>

                  <button
                    onClick={() => handleStatusChange(order.id_entrega, "fallido")}
                    className="px-4 py-2 border-2 border-black hover:bg-red-50"
                  >
                    Problema
                  </button>

                  <button
                    onClick={() => handleDeleteOrder(order.id_entrega)}
                    className="ml-auto px-4 py-2 border-2 border-black hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 inline mr-1" />
                    Eliminar
                  </button>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
