import { useState } from "react";
import {
  Package,
  MapPin,
  FileText,
  Plus,
  Camera,
  X,
  Shield
} from "lucide-react";

export default function AddOrder({ userId, userRole }) {
  const [formData, setFormData] = useState({
    productName: "",
    address: "",
    notes: "",
    status: "in-progress"
  });

  const [deliveryPhoto, setDeliveryPhoto] = useState(null);
  const [success, setSuccess] = useState(false);

  const handlePhotoUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setDeliveryPhoto(reader.result);

      // Si hay foto → el pedido está entregado
      setFormData({ ...formData, status: "delivered" });
    };

    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setDeliveryPhoto(null);
    setFormData({ ...formData, status: "in-progress" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newOrder = {
      id: Date.now().toString(),
      userId,
      ...formData,
      createdAt: new Date().toISOString(),
      images: deliveryPhoto
        ? [
            {
              id: Date.now().toString(),
              type: "paquete",
              url: deliveryPhoto,
              timestamp: new Date().toISOString()
            }
          ]
        : []
    };

    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    orders.push(newOrder);
    localStorage.setItem("orders", JSON.stringify(orders));

    setSuccess(true);

    setFormData({
      productName: "",
      address: "",
      notes: "",
      status: "in-progress"
    });

    setDeliveryPhoto(null);

    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white border-2 border-black p-8 shadow-[8px_8px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 bg-black text-white rounded-lg">
            <Plus className="w-8 h-8" />
          </div>

          <div>
            <h1 className="text-3xl">Agregar Nuevo Pedido</h1>
            <p className="text-gray-600">Completa los detalles del pedido</p>

            {userRole === "user" && (
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                <Shield className="w-4 h-4" />
                <span>
                  Usuario: Solo puedes cambiar el estado y subir fotos.
                </span>
              </div>
            )}
          </div>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-100 border-2 border-green-500 text-green-700">
            ¡Pedido creado exitosamente!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* SOLO ADMIN puede escribir producto y dirección */}
          {userRole === "admin" && (
            <>
              <div>
                <label className="block mb-2">Nombre del Producto</label>
                <div className="relative">
                  <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.productName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        productName: e.target.value
                      })
                    }
                    className="w-full pl-12 pr-4 py-3 border-2 border-black"
                    placeholder="Ej: Pizza Margarita"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2">Dirección de Entrega</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: e.target.value
                      })
                    }
                    className="w-full pl-12 pr-4 py-3 border-2 border-black"
                    placeholder="Ej: Calle Mayor 15"
                    required
                  />
                </div>
              </div>
            </>
          )}

          {/* Estado inicial */}
          <div>
            <label className="block mb-2">Estado Inicial</label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              disabled={deliveryPhoto !== null}
              className="w-full px-4 py-3 border-2 border-black"
            >
              <option value="in-progress">En Curso</option>
              <option value="delivered">Entregado</option>
              <option value="problem">Con Problema</option>
            </select>

            {deliveryPhoto && (
              <p className="text-sm text-green-600 mt-2">
                ✓ Estado automático: Entregado (subiste foto)
              </p>
            )}
          </div>

          {/* FOTO DEL PAQUETE */}
          <div className="p-6 bg-green-50 border-2 border-green-500">
            <div className="flex items-center gap-2 mb-4">
              <Camera className="w-6 h-6 text-green-700" />
              <h3 className="text-green-900">Foto del Pedido Entregado</h3>
            </div>

            {!deliveryPhoto ? (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  id="delivery-photo"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
                <label
                  htmlFor="delivery-photo"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white border-2 border-green-700 cursor-pointer"
                >
                  <Camera className="w-5 h-5" />
                  Subir Foto de Entrega
                </label>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={deliveryPhoto}
                  className="w-full max-w-md mx-auto border-2 border-black"
                />
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 border-2 border-black"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* PREVIEW DE ESTADO */}
          <div className="p-6 bg-gray-50 border-2 border-gray-300">
            <h3 className="mb-4">Vista Previa del Estado</h3>

            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-2">
                <div
                  className={`w-6 h-6 rounded-full border-2 border-black ${
                    formData.status === "delivered"
                      ? "bg-green-500"
                      : "bg-gray-200"
                  }`}
                />
                <div
                  className={`w-6 h-6 rounded-full border-2 border-black ${
                    formData.status === "in-progress"
                      ? "bg-yellow-400"
                      : "bg-gray-200"
                  }`}
                />
                <div
                  className={`w-6 h-6 rounded-full border-2 border-black ${
                    formData.status === "problem"
                      ? "bg-red-500"
                      : "bg-gray-200"
                  }`}
                />
              </div>

              <div>
                <p className="text-sm text-gray-600">Estado actual:</p>
                <p className="text-sm mt-1">
                  {formData.status === "delivered" && "🟢 Entregado"}
                  {formData.status === "in-progress" && "🟡 En Curso"}
                  {formData.status === "problem" && "🔴 Con Problema"}
                </p>
              </div>
            </div>

            {userRole === "admin" && (
              <div className="mt-4 pt-4 border-t-2 border-gray-400">
                <label className="block mb-2 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Notas del Repartidor
                </label>

                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-black"
                  placeholder="Notas del repartidor..."
                />
              </div>
            )}
          </div>

          {userRole === "admin" && (
            <button
              type="submit"
              className="w-full bg-black text-white py-4 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]"
            >
              <Plus className="w-5 h-5" />
              Crear Pedido
            </button>
          )}
        </form>
      </div>

      {/* INDICADORES */}
      <div className="mt-6 bg-white border-2 border-black p-6 shadow-[8px_8px_0px_rgba(0,0,0,1)]">
        <h3 className="mb-4">Indicadores de Estado</h3>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-green-500 border-2 border-black rounded-full" />
            <div>
              <p>Verde — Entregado</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-yellow-400 border-2 border-black rounded-full" />
            <div>
              <p>Amarillo — En curso</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-red-500 border-2 border-black rounded-full" />
            <div>
              <p>Rojo — Problema</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
