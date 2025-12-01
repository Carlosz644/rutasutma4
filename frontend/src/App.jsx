import { useState, useEffect } from 'react';

import { Login } from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import { UserProfile } from './components/UserProfile';
import { AdminProfile } from './components/AdminProfile';
import { AddressSearch } from './components/AddressSearch';
import Orders from './components/Orders';
import AddOrder from './components/AddOrder';

import Clientes from './components/Clientes';
import Repartidores from "./components/Repartidores";
import Vehiculos from "./components/Vehiculos";
import Rutas from "./components/Rutas";

import { Menu, User, Package, MapPin, LogOut } from 'lucide-react';

export default function App() {

  const [currentView, setCurrentView] = useState('login');
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Mantener sesión iniciada
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setCurrentView('orders');
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    setCurrentView('orders');
  };

  const handleLogout = () => {
    if (user) localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    setUser(null);
    setCurrentView('login');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        
        {currentView === 'login' && (
          <Login
            onLogin={handleLogin}
            onRegister={() => setCurrentView('register')}
            onForgotPassword={() => setCurrentView('forgot-password')}
          />
        )}

        {currentView === 'register' && (
          <Register
            onRegister={handleLogin}
            onBackToLogin={() => setCurrentView('login')}
          />
        )}

        {currentView === 'forgot-password' && (
          <ForgotPassword onBackToLogin={() => setCurrentView('login')} />
        )}

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex">
      
      {/* SIDEBAR */}
      <aside
        className={`${isSidebarOpen ? 'w-64' : 'w-0'} bg-black text-white transition-all duration-300 overflow-hidden flex flex-col`}
      >
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-2xl">Pedidos Express</h1>
          <p className="text-sm text-gray-400 mt-1">{user.name}</p>
          <p className="text-xs text-gray-500">
            {user.role === 'admin' || user.role === 'super_admin'
              ? 'Administrador'
              : 'Repartidor'}
          </p>
        </div>

        <nav className="flex-1 p-4">

          {/* Pedidos */}
          <button
            onClick={() => setCurrentView('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentView === 'orders' ? 'bg-white text-black' : 'hover:bg-gray-900'
            }`}
          >
            <Package className="w-5 h-5" />
            <span>Pedidos</span>
          </button>

          {/* Agregar pedido — SOLO ADMIN */}
          {(user.role === 'admin' || user.role === 'super_admin') && (
            <button
              onClick={() => setCurrentView('add-order')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mt-2 ${
                currentView === 'add-order' ? 'bg-white text-black' : 'hover:bg-gray-900'
              }`}
            >
              <Package className="w-5 h-5" />
              <span>Agregar Pedido</span>
            </button>
          )}

          {/* Buscar dirección — TODOS */}
          <button
            onClick={() => setCurrentView('address-search')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mt-2 ${
              currentView === 'address-search' ? 'bg-white text-black' : 'hover:bg-gray-900'
            }`}
          >
            <MapPin className="w-5 h-5" />
            <span>Buscar Dirección</span>
          </button>

          {/* Perfil */}
          <button
            onClick={() =>
              setCurrentView(
                user.role === 'admin' || user.role === 'super_admin'
                  ? 'admin-profile'
                  : 'user-profile'
              )
            }
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mt-2 ${
              currentView === 'user-profile' || currentView === 'admin-profile'
                ? 'bg-white text-black'
                : 'hover:bg-gray-900'
            }`}
          >
            <User className="w-5 h-5" />
            <span>Mi Perfil</span>
          </button>

          {/* SOLO ADMIN: Clientes */}
          {(user.role === "admin" || user.role === "super_admin") && (
            <button
              onClick={() => setCurrentView('clientes')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mt-2 ${
                currentView === 'clientes' ? 'bg-white text-black' : 'hover:bg-gray-900'
              }`}
            >
              <User className="w-5 h-5" />
              <span>Clientes</span>
            </button>
          )}

          {/* SOLO ADMIN: Repartidores */}
          {(user.role === "admin" || user.role === "super_admin") && (
            <button
              onClick={() => setCurrentView('repartidores')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mt-2 ${
                currentView === 'repartidores' ? 'bg-white text-black' : 'hover:bg-gray-900'
              }`}
            >
              <User className="w-5 h-5" />
              <span>Repartidores</span>
            </button>
          )}

          {/* SOLO ADMIN: Vehículos */}
          {(user.role === "admin" || user.role === "super_admin") && (
            <button
              onClick={() => setCurrentView('vehiculos')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mt-2 ${
                currentView === 'vehiculos' ? 'bg-white text-black' : 'hover:bg-gray-900'
              }`}
            >
              <Package className="w-5 h-5" />
              <span>Vehículos</span>
            </button>
          )}

          {/* Rutas — TODOS */}
          <button
            onClick={() => setCurrentView('rutas')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mt-2 ${
              currentView === 'rutas' ? 'bg-white text-black' : 'hover:bg-gray-900'
            }`}
          >
            <Package className="w-5 h-5" />
            <span>Rutas</span>
          </button>

        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-900 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>

      </aside>

      {/* MAIN CONTENT */}
        <main className="flex-1 overflow-auto bg-gray-50">
          {currentView === 'orders' && <Orders userRole={user.role} />}
          {currentView === 'add-order' && <AddOrder userId={user.id} userRole={user.role} />}
          {currentView === 'address-search' && <AddressSearch />}
          {currentView === 'user-profile' && <UserProfile user={user} />}
          {currentView === 'admin-profile' && <AdminProfile user={user} />}
          {currentView === 'clientes' && <Clientes />}
          {currentView === 'repartidores' && <Repartidores />}
          {currentView === 'vehiculos' && <Vehiculos />}
          {currentView === 'rutas' && (
  <Rutas userId={user.id} userRole={user.role} />
)}

        </main>
      </div>
  );
}
