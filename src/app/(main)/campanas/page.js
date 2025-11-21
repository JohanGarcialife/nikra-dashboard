"use client";

import { useState, useMemo, useEffect } from "react";
import { Eye, Trash2 } from "lucide-react";
import SearchBar from "../_components/SearchBar";
import CreateCampaignModal from "../_components/CreateCampaignModal";
import CampaignDetailsModal from "../_components/CampaignDetailsModal";
import {
  getCampaigns,
  deleteCampaign,
  uploadCampaignImage,
  createCampaign,
  calculateCampaignStatus,
  formatCampaignDateRange,
} from "@/lib/campaignsService";

const ITEMS_PER_PAGE = 30;

export default function CampanasPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCampaigns, setTotalCampaigns] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);

  // Cargar campañas del backend
  const loadCampaigns = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCampaigns(currentPage, itemsPerPage);
      
      // Formatear campañas con estado y fechas
      const formattedCampaigns = data.campaigns.map((campaign) => ({
        ...campaign,
        estado: calculateCampaignStatus(campaign),
        fechas: formatCampaignDateRange(campaign.fechaInicio, campaign.fechaFin),
      }));
      
      setCampaigns(formattedCampaigns);
      setTotalPages(data.pagination.totalPages);
      setTotalCampaigns(data.pagination.total);
    } catch (err) {
      console.error('Error al cargar campañas:', err);
      setError('Error al cargar las campañas. Por favor, intenta de nuevo.');
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  // Cargar campañas al montar el componente y cuando cambie la página o items por página
  useEffect(() => {
    loadCampaigns();
  }, [currentPage, itemsPerPage]);

  // Filtrar campañas por búsqueda (local)
  const filteredCampaigns = useMemo(() => {
    if (!searchQuery.trim()) return campaigns;

    return campaigns.filter((campaign) =>
      campaign.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [campaigns, searchQuery]);

  // Handlers
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset a primera página al cambiar items por página
  };

  const handleDownload = (campaignId) => {
    // TODO: Conectar con endpoint para descargar archivo
    // const response = await apiClient.get(`/api/campaigns/${campaignId}/download`, { responseType: 'blob' });
    // Crear descarga del archivo
    console.log("Descargando justificación para campaña:", campaignId);
    alert(`Descargando justificación.zip para la campaña ${campaignId}`);
  };

  const handleViewDetails = (campaignId) => {
    setSelectedCampaignId(campaignId);
    setIsDetailsModalOpen(true);
  };

  const handleDelete = async (campaignId) => {
    // Confirmación antes de eliminar
    if (
      window.confirm(
        "¿Estás seguro de que deseas eliminar esta campaña? Esta acción no se puede deshacer."
      )
    ) {
      try {
        await deleteCampaign(campaignId);
        // Recargar campañas después de eliminar
        await loadCampaigns();
        alert('Campaña eliminada exitosamente');
      } catch (error) {
        console.error('Error al eliminar campaña:', error);
        alert('Error al eliminar la campaña. Por favor, intenta de nuevo.');
      }
    }
  };

  const handleCreateCampaign = async (formData, imageFile) => {
    try {
      // 1. Subir la imagen primero
      const uploadResponse = await uploadCampaignImage(imageFile);
      const filename = uploadResponse.filename;

      // 2. Crear la campaña con la URL de la imagen
      const campaignData = {
        nombre: formData.nombre,
        descripcion: formData.descripcion || '',
        imagenUrl: filename, // Solo el filename, el backend construirá la URL
        isActive: formData.isActive !== undefined ? formData.isActive : true,
        fechaInicio: new Date(formData.fechaInicio).toISOString(),
        fechaFin: new Date(formData.fechaFin).toISOString(),
      };

      await createCampaign(campaignData);
      
      // 3. Recargar campañas después de crear
      await loadCampaigns();
      setIsModalOpen(false);
      alert('Campaña creada exitosamente');
    } catch (error) {
      console.error('Error al crear campaña:', error);
      throw error; // Re-lanzar el error para que el modal lo maneje
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary">Campañas</h1>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Contenedor principal - Tarjeta blanca flotante */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* Barra de búsqueda y botón crear dentro del contenedor */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-b border-gray-200">
          <SearchBar
            placeholder="Buscar campaña"
            value={searchQuery}
            onChange={handleSearch}
          />
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium whitespace-nowrap w-full sm:w-auto"
          >
            Crear nueva campaña
          </button>
        </div>

        {/* Tabla de campañas */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Nombre de la campaña
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Fechas
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                  Descarga informe/Datos
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                  Detalles
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                  Eliminar
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      <span className="ml-3 text-gray-500">Cargando campañas...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredCampaigns.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    {searchQuery ? 'No se encontraron campañas con ese nombre' : 'No hay campañas disponibles'}
                  </td>
                </tr>
              ) : (
                filteredCampaigns.map((campaign) => (
                  <tr
                    key={campaign.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-3">
                      {getStatusBadge(campaign.estado)}
                    </td>
                    <td className="px-6 py-3">
                      <span className="text-sm font-medium text-primary">
                        {campaign.nombre}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span className="text-sm text-gray-600">
                        {campaign.fechas}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <button
                        onClick={() => handleDownload(campaign.id)}
                        className="inline-flex items-center gap-2 bg-primary text-white px-4 py-1.5 rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                      >
                        justificación.zip
                      </button>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <button
                        onClick={() => handleViewDetails(campaign.id)}
                        className="inline-flex items-center justify-center w-9 h-9 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                        title="Ver detalles"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <button
                        onClick={() => handleDelete(campaign.id)}
                        className="inline-flex items-center justify-center w-9 h-9 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        title="Eliminar campaña"
                      >
                        <Trash2 className="w-4 h-4" />
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
          <div className="border-t border-gray-200 px-6 py-3 flex items-center justify-center gap-4">
            <span className="text-sm text-gray-600">Page</span>

            {/* Botón anterior */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
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
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm text-gray-600 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ›
            </button>

            {/* Select de items por página */}
            <select
              className="ml-4 px-2 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
            >
              <option value="30">30</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            
            {/* Info de paginación */}
            <span className="ml-4 text-sm text-gray-600">
              {totalCampaigns > 0 ? `Total: ${totalCampaigns} campañas` : ''}
            </span>
          </div>
        )}
      </div>

      {/* Modal para crear campaña */}
      <CreateCampaignModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateCampaign}
      />

      {/* Modal de detalles de campaña */}
      <CampaignDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedCampaignId(null);
        }}
        campaignId={selectedCampaignId}
      />
    </div>
  );
}

// Función helper para obtener los estilos del badge según el estado
function getStatusBadge(estado) {
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
}
