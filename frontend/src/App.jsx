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
import Conductores from "./components/Conductores";
import Vehiculos from "./components/Vehiculos";
import Rutas from "./components/Rutas";

import { Menu, User, Package, MapPin, LogOut } from 'lucide-react';

export default function App() {

  const [currentView, setCurrentView] = useState('login');
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
    setUser(null);
    localStorage.removeItem('currentUser');
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
            {user.role === 'admin' ? 'Administrador' : 'Usuario'}
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

          {/* Agregar pedido */}
          <button
            onClick={() => setCurrentView('add-order')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mt-2 ${
              currentView === 'add-order' ? 'bg-white text-black' : 'hover:bg-gray-900'
            }`}
          >
            <Package className="w-5 h-5" />
            <span>Agregar Pedido</span>
          </button>

          {/* Buscar dirección */}
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
              setCurrentView(user.role === 'admin' ? 'admin-profile' : 'user-profile')
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

          {/* Clientes */}
          <button
            onClick={() => setCurrentView('clientes')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mt-2 ${
              currentView === 'clientes' ? 'bg-white text-black' : 'hover:bg-gray-900'
            }`}
          >
            <User className="w-5 h-5" />
            <span>Clientes</span>
          </button>

          {/* Conductores */}
          <button
            onClick={() => setCurrentView('conductores')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mt-2 ${
              currentView === 'conductores' ? 'bg-white text-black' : 'hover:bg-gray-900'
            }`}
          >
            <User className="w-5 h-5" />
            <span>Conductores</span>
          </button>

          {/* Vehículos */}
          <button
            onClick={() => setCurrentView('vehiculos')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mt-2 ${
              currentView === 'vehiculos' ? 'bg-white text-black' : 'hover:bg-gray-900'
            }`}
          >
            <Package className="w-5 h-5" />
            <span>Vehículos</span>
          </button>

          {/* Rutas */}
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
      <div className="flex-1 flex flex-col">
        <header className="bg-black text-white px-6 py-4 flex items-center gap-4 border-b border-gray-800">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-900 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

          <h2 className="text-xl">
            {currentView === 'orders' && 'Mis Pedidos'}
            {currentView === 'add-order' && 'Agregar Pedido'}
            {currentView === 'address-search' && 'Buscar Dirección'}
            {currentView === 'user-profile' && 'Mi Perfil'}
            {currentView === 'admin-profile' && 'Panel de Administrador'}
            {currentView === 'clientes' && 'Clientes'}
            {currentView === 'conductores' && 'Conductores'}
            {currentView === 'vehiculos' && 'Vehículos'}
            {currentView === 'rutas' && 'Rutas'}
          </h2>
        </header>

        <main className="flex-1 overflow-auto bg-gray-50">
          {currentView === 'orders' && <Orders userRole={user.role} />}
          {currentView === 'add-order' && <AddOrder userId={user.id} userRole={user.role} />}
          {currentView === 'address-search' && <AddressSearch />}
          {currentView === 'user-profile' && <UserProfile user={user} />}
          {currentView === 'admin-profile' && <AdminProfile user={user} />}
          {currentView === 'clientes' && <Clientes />}
          {currentView === 'conductores' && <Conductores />}
          {currentView === 'vehiculos' && <Vehiculos />}
          {currentView === 'rutas' && <Rutas />}
        </main>
      </div>

    </div>
  );
}
