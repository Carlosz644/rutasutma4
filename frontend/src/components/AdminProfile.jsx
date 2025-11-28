import { useState, useEffect } from "react";
import {
  Shield,
  Users,
  Package,
  TrendingUp,
  Activity,
  Edit2,
  Save,
  X,
  Mail,
  Phone,
  MapPin,
  User
} from "lucide-react";

export function AdminProfile({ user }) {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    activeOrders: 0,
    completedOrders: 0,
    problemOrders: 0
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const [profileData, setProfileData] = useState({
    name: user.name,
    email: user.email,
    phone: "+34 600 000 000",
    address: "Oficina Central, Madrid"
  });

  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editUserData, setEditUserData] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");

    setStats({
      totalUsers: storedUsers.length + 2,
      totalOrders: orders.length,
      activeOrders: orders.filter((o) => o.status === "in-progress").length,
      completedOrders: orders.filter((o) => o.status === "delivered").length,
      problemOrders: orders.filter((o) => o.status === "problem").length
    });

    setUsers(storedUsers);
  };

  const handleSaveProfile = () => {
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const index = storedUsers.findIndex((u) => u.id === user.id);

    if (index !== -1) {
      storedUsers[index] = { ...storedUsers[index], ...profileData };
      localStorage.setItem("users", JSON.stringify(storedUsers));
    }

    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    localStorage.setItem("currentUser", JSON.stringify({ ...currentUser, ...profileData }));

    setIsEditingProfile(false);
  };

  const handleEditUser = (userId) => {
    const u = users.find((u) => u.id === userId);
    if (u) {
      setEditingUserId(userId);
      setEditUserData({ ...u });
    }
  };

  const handleSaveUser = () => {
    if (!editingUserId || !editUserData) return;

    const updated = users.map((u) => (u.id === editingUserId ? editUserData : u));

    setUsers(updated);
    localStorage.setItem("users", JSON.stringify(updated));
    setEditingUserId(null);
    setEditUserData(null);
  };

  const handleDeleteUser = (userId) => {
    if (confirm("¿Estás seguro de eliminar este usuario?")) {
      const updated = users.filter((u) => u.id !== userId);
      setUsers(updated);
      localStorage.setItem("users", JSON.stringify(updated));
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">

      {/* PERFIL ADMIN */}
      <div className="bg-white border-2 border-black p-8 shadow-[8px_8px_0px_rgba(0,0,0,1)] mb-6">

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center">
              <Shield className="w-10 h-10" />
            </div>

            <div>
              <h1 className="text-3xl">{profileData.name}</h1>
              <p className="text-gray-600">Panel de Administrador</p>
            </div>
          </div>

          {!isEditingProfile ? (
            <button
              onClick={() => setIsEditingProfile(true)}
              className="px-4 py-2 border-2 border-black flex items-center gap-2 hover:bg-gray-50"
            >
              <Edit2 className="w-4 h-4" /> Editar Mi Perfil
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSaveProfile}
                className="px-4 py-2 bg-black text-white flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Guardar
              </button>
              <button
                onClick={() => setIsEditingProfile(false)}
                className="px-4 py-2 border-2 border-black hover:bg-gray-50 flex items-center gap-2"
              >
                <X className="w-4 h-4" /> Cancelar
              </button>
            </div>
          )}
        </div>

        {isEditingProfile && (
          <div className="space-y-4 mb-6 p-4 border-2 bg-gray-50">

            <input
              className="w-full px-4 py-3 border-2 border-black"
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              placeholder="Nombre"
            />

            <input
              className="w-full px-4 py-3 border-2 border-black"
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              placeholder="Email"
            />

            <input
              className="w-full px-4 py-3 border-2 border-black"
              value={profileData.phone}
              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
              placeholder="Teléfono"
            />
          </div>
        )}

        {/* ESTADÍSTICAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          <div className="p-6 border-2 border-black bg-gray-50">
            <Users className="w-8 h-8 mb-1" />
            <div className="text-3xl">{stats.totalUsers}</div>
            <p>Usuarios Totales</p>
          </div>

          <div className="p-6 border-2 border-black bg-gray-50">
            <Package className="w-8 h-8 mb-1" />
            <div className="text-3xl">{stats.totalOrders}</div>
            <p>Pedidos Totales</p>
          </div>

          <div className="p-6 border-2 border-black bg-yellow-50">
            <div className="text-3xl">{stats.activeOrders}</div>
            <p>En Curso</p>
          </div>

          <div className="p-6 border-2 border-black bg-green-50">
            <div className="text-3xl">{stats.completedOrders}</div>
            <p>Entregados</p>
          </div>

          <div className="p-6 border-2 border-black bg-red-50">
            <div className="text-3xl">{stats.problemOrders}</div>
            <p>Con Problemas</p>
          </div>

          <div className="p-6 border-2 border-black bg-gray-50">
            <div className="text-3xl">
              {stats.totalOrders > 0
                ? Math.round((stats.completedOrders / stats.totalOrders) * 100)
                : 0}%
            </div>
            <p>Tasa de Éxito</p>
          </div>
        </div>
      </div>

      {/* LISTA DE USUARIOS */}
      <div className="bg-white border-2 border-black p-8 shadow-[8px_8px_0px_rgba(0,0,0,1)] mb-6">
        <h2 className="text-2xl mb-6">Gestionar Usuarios</h2>

        {users.length === 0 ? (
          <div className="p-6 text-center text-gray-600">
            No hay usuarios registrados
          </div>
        ) : (
          <div className="space-y-4">
            {users.map((u) => (
              <div key={u.id} className="p-4 border-2 border-black bg-gray-50">

                {editingUserId === u.id ? (
                  <div className="space-y-3">
                    <input
                      className="w-full px-3 py-2 border-2 border-black"
                      value={editUserData.name}
                      onChange={(e) =>
                        setEditUserData({ ...editUserData, name: e.target.value })
                      }
                    />

                    <input
                      className="w-full px-3 py-2 border-2 border-black"
                      value={editUserData.email}
                      onChange={(e) =>
                        setEditUserData({ ...editUserData, email: e.target.value })
                      }
                    />

                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveUser}
                        className="px-3 py-2 bg-black text-white"
                      >
                        Guardar
                      </button>

                      <button
                        onClick={() => {
                          setEditingUserId(null);
                          setEditUserData(null);
                        }}
                        className="px-3 py-2 border-2 border-black"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">

                    <div>
                      <p className="font-semibold">{u.name}</p>
                      <p className="text-sm text-gray-600">{u.email}</p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        className="px-3 py-2 border-2 border-black"
                        onClick={() => handleEditUser(u.id)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        className="px-3 py-2 border-2 border-red-500 text-red-500"
                        onClick={() => handleDeleteUser(u.id)}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                )}

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
