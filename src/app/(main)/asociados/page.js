'use client'

import { Users, Plus, Search } from 'lucide-react';

export default function AsociadosPage() {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary mb-2">Asociados</h1>
        <p className="text-gray-600">Gestiona los comercios asociados al CCA de Ceuta</p>
      </div>

      {/* Acciones */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar asociado..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors font-medium">
          <Plus className="w-5 h-5" />
          Nuevo Asociado
        </button>
      </div>

      {/* Contenido placeholder */}
      <div className="bg-white rounded-2xl shadow-md p-12">
        <div className="text-center">
          <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Sección de Asociados
          </h2>
          <p className="text-gray-600 mb-4 max-w-md mx-auto">
            Aquí podrás gestionar todos los comercios asociados, ver sus estadísticas y administrar sus datos.
          </p>
          <p className="text-sm text-gray-500">
            Esta funcionalidad estará disponible próximamente.
          </p>
        </div>
      </div>
    </div>
  );
}

