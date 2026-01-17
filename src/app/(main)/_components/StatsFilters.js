"use client";

import { useState, useEffect } from "react";
import { Calendar, X } from "lucide-react";

/**
 * Componente StatsFilters - Filtros para las estadísticas del dashboard
 * @param {Object} props
 * @param {Object} props.filters - Filtros actuales
 * @param {Function} props.onFiltersChange - Callback cuando cambian los filtros
 * @param {Array} props.campaigns - Lista de campañas disponibles para filtrar
 * @param {Array} props.associates - Lista de comercios disponibles para filtrar
 */
export default function StatsFilters({
  filters,
  onFiltersChange,
  campaigns = [],
  associates = [],
}) {
  const [localFilters, setLocalFilters] = useState({
    fechaDesde: filters?.fechaDesde || "",
    fechaHasta: filters?.fechaHasta || "",
    campaignId: filters?.campaignId || "",
    associateId: filters?.associateId || "",
    includeTopUsers: filters?.includeTopUsers ?? true,
    includeTopAssociates: filters?.includeTopAssociates ?? true,
    topLimit: filters?.topLimit || 10,
  });

  useEffect(() => {
    setLocalFilters({
      fechaDesde: filters?.fechaDesde || "",
      fechaHasta: filters?.fechaHasta || "",
      campaignId: filters?.campaignId || "",
      associateId: filters?.associateId || "",
      includeTopUsers: filters?.includeTopUsers ?? true,
      includeTopAssociates: filters?.includeTopAssociates ?? true,
      topLimit: filters?.topLimit || 10,
    });
  }, [filters]);

  const handleChange = (field, value) => {
    const newFilters = { ...localFilters, [field]: value };
    setLocalFilters(newFilters);
    
    // Log para debugging cuando se cambia el filtro de campaña
    if (field === 'campaignId' && process.env.NODE_ENV === 'development') {
      console.log('🔍 Filtro de campaña cambiado:', value || 'Todas las campañas');
    }
    
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      fechaDesde: "",
      fechaHasta: "",
      campaignId: "",
      associateId: "",
      includeTopUsers: true,
      includeTopAssociates: true,
      topLimit: 10,
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters =
    localFilters.fechaDesde ||
    localFilters.fechaHasta ||
    localFilters.campaignId ||
    localFilters.associateId;

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-primary">Filtros</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors"
          >
            <X className="w-4 h-4" />
            Limpiar filtros
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Fecha Desde */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha Desde
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={localFilters.fechaDesde}
              onChange={(e) => handleChange("fechaDesde", e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Fecha Hasta */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha Hasta
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={localFilters.fechaHasta}
              onChange={(e) => handleChange("fechaHasta", e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Campaña */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Campaña
          </label>
          <select
            value={localFilters.campaignId}
            onChange={(e) => handleChange("campaignId", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Todas las campañas</option>
            {Array.isArray(campaigns) && campaigns.map((campaign) => {
              // Validar que la campaña tenga un ID válido
              if (!campaign.id) {
                console.warn('Campaña sin ID:', campaign);
                return null;
              }
              return (
                <option key={campaign.id} value={campaign.id}>
                  {campaign.nombre || `Campaña ${campaign.id}`}
                </option>
              );
            })}
          </select>
        </div>

        {/* Comercio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Comercio
          </label>
          <select
            value={localFilters.associateId}
            onChange={(e) => handleChange("associateId", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Todos los comercios</option>
            {Array.isArray(associates) && associates.map((associate) => (
              <option key={associate.id} value={associate.id}>
                {associate.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Opciones adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="includeTopUsers"
            checked={localFilters.includeTopUsers}
            onChange={(e) =>
              handleChange("includeTopUsers", e.target.checked)
            }
            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
          />
          <label
            htmlFor="includeTopUsers"
            className="text-sm text-gray-700 cursor-pointer"
          >
            Incluir Top Usuarios
          </label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="includeTopAssociates"
            checked={localFilters.includeTopAssociates}
            onChange={(e) =>
              handleChange("includeTopAssociates", e.target.checked)
            }
            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
          />
          <label
            htmlFor="includeTopAssociates"
            className="text-sm text-gray-700 cursor-pointer"
          >
            Incluir Top Comercios
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Límite Top
          </label>
          <input
            type="number"
            min="1"
            max="50"
            value={localFilters.topLimit}
            onChange={(e) =>
              handleChange("topLimit", parseInt(e.target.value) || 10)
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
}
