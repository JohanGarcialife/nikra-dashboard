"use client";

import { Download, Eye, Trash2 } from "lucide-react";

/**
 * Componente CampaignTable - Tabla de campañas con paginación
 * @param {Object} props
 * @param {Array} props.campaigns - Array de campañas a mostrar
 * @param {number} props.currentPage - Página actual
 * @param {number} props.totalPages - Total de páginas
 * @param {Function} props.onPageChange - Callback para cambiar de página
 * @param {Function} props.onDownload - Callback para descargar justificación
 * @param {Function} props.onViewDetails - Callback para ver detalles
 * @param {Function} props.onDelete - Callback para eliminar campaña
 */
export default function CampaignTable({
  campaigns = [],
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  onDownload,
  onViewDetails,
  onDelete,
}) {
  // Función para obtener los estilos del badge según el estado
  const getStatusBadge = (estado) => {
    const statusConfig = {
      Preparada: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "Preparada",
      },
      Activa: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Activa",
      },
      Finalizada: {
        bg: "bg-gray-100",
        text: "text-gray-800",
        label: "Finalizada",
      },
      Archivada: {
        bg: "bg-gray-100",
        text: "text-gray-600",
        label: "Archivada",
      },
    };

    const config = statusConfig[estado] || statusConfig.Preparada;

    return (
      <span
        className={`${config.bg} ${config.text} text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap`}
      >
        {config.label}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Estado
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Nombre de la campaña
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Fechas
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                Descarga informe/Datos
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                Detalles
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                Eliminar
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {campaigns.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                  No se encontraron campañas
                </td>
              </tr>
            ) : (
              campaigns.map((campaign) => (
                <tr
                  key={campaign.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    {getStatusBadge(campaign.estado)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-primary">
                      {campaign.nombre}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">
                      {campaign.fechas}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => onDownload(campaign.id)}
                      className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                    >
                      justificación.zip
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => onViewDetails(campaign.id)}
                      className="inline-flex items-center justify-center w-10 h-10 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                      title="Ver detalles"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => onDelete(campaign.id)}
                      className="inline-flex items-center justify-center w-10 h-10 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      title="Eliminar campaña"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-center gap-4">
          <span className="text-sm text-gray-600">Page</span>

          {/* Botón anterior */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm text-gray-600 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ‹
          </button>

          {/* Número de página actual */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full text-sm font-medium">
              {currentPage}
            </span>
          </div>

          {/* Botón siguiente */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm text-gray-600 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ›
          </button>

          {/* Select de items por página */}
          <select
            className="ml-4 px-2 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            defaultValue="30"
          >
            <option value="30">30</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
      )}
    </div>
  );
}

