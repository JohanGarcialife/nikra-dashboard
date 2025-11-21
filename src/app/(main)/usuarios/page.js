'use client'

import { UserCog, Plus, Search, Shield, Users } from 'lucide-react';

export default function UsuariosPage() {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary mb-2">Usuarios</h1>
        <p className="text-gray-600">Administra los usuarios del sistema y sus permisos</p>
      </div>

      {/* Acciones */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar usuario..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors font-medium">
          <Plus className="w-5 h-5" />
          Nuevo Usuario
        </button>
      </div>

      {/* Grid de estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-50 p-3 rounded-xl">
              <UserCog className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Usuarios</p>
              <p className="text-2xl font-bold text-gray-900">-</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-green-50 p-3 rounded-xl">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Administradores</p>
              <p className="text-2xl font-bold text-gray-900">-</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-purple-50 p-3 rounded-xl">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Usuarios Activos</p>
              <p className="text-2xl font-bold text-gray-900">-</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido placeholder */}
      <div className="bg-white rounded-2xl shadow-md p-12">
        <div className="text-center">
          <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserCog className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Gestión de Usuarios
          </h2>
          <p className="text-gray-600 mb-4 max-w-md mx-auto">
            Administra los usuarios del sistema, asigna roles y permisos, y controla el acceso al dashboard.
          </p>
          <p className="text-sm text-gray-500">
            Esta funcionalidad estará disponible próximamente.
          </p>
        </div>
      </div>
    </div>
  );
}

