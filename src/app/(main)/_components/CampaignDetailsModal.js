"use client";

import { X, Ticket, Euro, Users, FileDown } from "lucide-react";
import { useState, useEffect } from "react";
import LineChart from "./LineChart";
import { getCampaignById, getCampaignImageUrl, formatCampaignDateRange } from "@/lib/campaignsService";

/**
 * Componente CampaignDetailsModal - Modal de detalles de campaña
 * @param {Object} props
 * @param {boolean} props.isOpen - Si el modal está abierto
 * @param {Function} props.onClose - Callback para cerrar el modal
 * @param {string} props.campaignId - ID de la campaña
 */
export default function CampaignDetailsModal({ isOpen, onClose, campaignId }) {
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar datos de la campaña cuando se abre el modal
  useEffect(() => {
    const loadCampaign = async () => {
      if (!isOpen || !campaignId) return;

      try {
        setLoading(true);
        setError(null);
        const data = await getCampaignById(campaignId);
        setCampaign(data);
      } catch (err) {
        console.error('Error al cargar campaña:', err);
        setError('Error al cargar los detalles de la campaña');
      } finally {
        setLoading(false);
      }
    };

    loadCampaign();
  }, [isOpen, campaignId]);

  if (!isOpen) return null;

  // Datos mock para las métricas
  const metrics = {
    ticketsRegistrados: 4365,
    volumenTotal: 69676,
    participantesUnicos: 3549,
  };

  // Datos mock para gráfico de registros de tickets diarios
  // Formato compatible con el componente LineChart existente
  const ticketsData = [
    { name: "16/01", value: 430 },
    { name: "17/01", value: 520 },
    { name: "18/01", value: 480 },
    { name: "19/01", value: 680 },
    { name: "20/01", value: 320 },
    { name: "21/01", value: 720 },
    { name: "22/01", value: 820 },
    { name: "23/01", value: 920 },
  ];

  // Datos mock para gráfico de volumen de compras
  // Formato compatible con el componente LineChart existente
  const volumeData = [
    { name: "16/01", value: 6340 },
    { name: "17/01", value: 7620 },
    { name: "18/01", value: 6820 },
    { name: "19/01", value: 8760 },
    { name: "20/01", value: 5820 },
    { name: "21/01", value: 8420 },
    { name: "22/01", value: 8900 },
    { name: "23/01", value: 10080 },
  ];

  // Configuración de la campaña (con valores por defecto mientras carga)
  const config = campaign ? {
    nombre: campaign.nombre || "Nombre de Campaña",
    descripcion: campaign.descripcion || "Sin descripción",
    fechas: formatCampaignDateRange(campaign.fechaInicio, campaign.fechaFin),
    isActive: campaign.isActive ? "Activa" : "Inactiva",
    imagen: getCampaignImageUrl(campaign.imagenUrl),
  } : null;

  const handleExportExcelRegistros = () => {
    console.log("Exportando registros a Excel...");
    // TODO: Implementar exportación real
    alert("Exportando registros a Excel");
  };

  const handleExportPdfInforme = () => {
    console.log("Exportando informe a PDF...");
    // TODO: Implementar exportación real
    alert("Exportando informe a PDF");
  };

  const handleExportExcelParticipantes = () => {
    console.log("Exportando participantes a Excel...");
    // TODO: Implementar exportación real
    alert("Exportando participantes a Excel");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop con blur */}
      <div
        className="absolute inset-0 backdrop-blur-sm bg-black/30"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-5xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header - Fijo */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-primary mb-1">
              {loading ? 'Cargando...' : campaign ? `Detalles — ${campaign.nombre}` : 'Detalles de Campaña'}
            </h2>
            {config && <p className="text-sm text-gray-500">{config.fechas}</p>}
          </div>
          <button
            onClick={onClose}
            className="text-primary hover:text-primary/80 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Contenido - Con scroll interno */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Estado de carga */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <span className="ml-3 text-gray-500">Cargando detalles...</span>
            </div>
          )}

          {/* Mensaje de error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Contenido de la campaña */}
          {!loading && !error && campaign && (
            <>
          {/* Métricas principales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="text-primary">
                  <Ticket className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Tickets registrados</p>
                  <p className="text-2xl font-bold text-primary">
                    {metrics.ticketsRegistrados.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="text-primary">
                  <Euro className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Volumen total registrado</p>
                  <p className="text-2xl font-bold text-primary">
                    {metrics.volumenTotal.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="text-primary">
                  <Users className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Participantes únicos</p>
                  <p className="text-2xl font-bold text-primary">
                    {metrics.participantesUnicos.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Gráficos */}
          <div className="space-y-6">
            <LineChart
              title="Registros de tickets diarios"
              data={ticketsData}
              dataKey="value"
              xAxisKey="name"
              lineColor="#133D74"
            />
            <LineChart
              title="Volumen de compras diarias (€)"
              data={volumeData}
              dataKey="value"
              xAxisKey="name"
              lineColor="#133D74"
              formatValue={(value) => `${value.toLocaleString("es-ES")}€`}
            />
          </div>

          {/* Configuración de la Campaña */}
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-lg font-bold text-primary mb-6">
              Configuración de la Campaña
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Columna izquierda - Información */}
              <div className="space-y-3">
                {/* Nombre de Campaña */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:shadow-sm transition-shadow">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Nombre de Campaña</span>
                    <span className="text-sm font-medium text-primary">{config.nombre}</span>
                  </div>
                </div>
                
                {/* Descripción */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:shadow-sm transition-shadow">
                  <div className="flex flex-col gap-2">
                    <span className="text-sm text-gray-600">Descripción</span>
                    <span className="text-sm font-medium text-primary">{config.descripcion}</span>
                  </div>
                </div>
                
                {/* Fechas */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:shadow-sm transition-shadow">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Fechas</span>
                    <span className="text-sm font-medium text-primary">{config.fechas}</span>
                  </div>
                </div>
                
                {/* Estado */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:shadow-sm transition-shadow">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Estado</span>
                    <span className="text-sm font-medium text-primary">{config.isActive}</span>
                  </div>
                </div>
              </div>

              {/* Columna derecha - Imagen del cartel */}
              <div className="flex items-start justify-center">
                <div className="w-full max-w-sm h-80 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  {config.imagen ? (
                    <img
                      src={config.imagen}
                      alt="Cartel de campaña"
                      className="w-full h-full object-contain p-4"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <p className="text-sm font-medium text-gray-500">Sin imagen</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Botones de exportación */}
          <div className="flex justify-center gap-4 pt-6 border-t border-gray-200">
            <button
              onClick={handleExportExcelRegistros}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm whitespace-nowrap"
            >
              <FileDown className="w-4 h-4" />
              Exportar a Excel (Registros)
            </button>
            <button
              onClick={handleExportPdfInforme}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm whitespace-nowrap"
            >
              <FileDown className="w-4 h-4" />
              Exportar a PDF (Informe)
            </button>
            <button
              onClick={handleExportExcelParticipantes}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm whitespace-nowrap"
            >
              <FileDown className="w-4 h-4" />
              Exportar a Excel (Participantes)
            </button>
          </div>
          </>
          )}
        </div>
      </div>
    </div>
  );
}

