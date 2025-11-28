import { useState } from 'react';
import { User, Mail, Phone, MapPin } from 'lucide-react';

export function UserProfile({ user }) {
  const [formData] = useState({
    name: user.name,
    email: user.email,
    phone: '+34 600 000 000',
    address: 'Calle Principal 123, Madrid'
  });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center">
              <User className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-3xl">{formData.name}</h1>
              <p className="text-gray-600">Usuario</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block mb-2 text-sm text-gray-600">Nombre Completo</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.name}
                disabled
                className="w-full pl-12 pr-4 py-3 border-2 border-black bg-gray-50"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-600">Correo Electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full pl-12 pr-4 py-3 border-2 border-black bg-gray-50"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-600">Teléfono</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                value={formData.phone}
                disabled
                className="w-full pl-12 pr-4 py-3 border-2 border-black bg-gray-50"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-600">Dirección</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.address}
                disabled
                className="w-full pl-12 pr-4 py-3 border-2 border-black bg-gray-50"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-100 border-2 border-gray-300">
          <p className="text-sm text-gray-600">
            ℹ️ Para modificar tu información de perfil, contacta con el administrador del sistema.
          </p>
        </div>

        <div className="mt-8 p-4 bg-gray-100 border-2 border-gray-300">
          <h3 className="mb-2">Estadísticas de Pedidos</h3>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center">
              <div className="text-2xl">12</div>
              <p className="text-sm text-gray-600">Total</p>
            </div>
            <div className="text-center">
              <div className="text-2xl">2</div>
              <p className="text-sm text-gray-600">En Curso</p>
            </div>
            <div className="text-center">
              <div className="text-2xl">10</div>
              <p className="text-sm text-gray-600">Entregados</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
