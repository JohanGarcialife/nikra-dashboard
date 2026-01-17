"use client";

import { useState, useEffect, useCallback } from "react";
import { RefreshCw, AlertCircle } from "lucide-react";
import { getDashboardStats, getDefaultDateRange } from "@/lib/statsService";
import { getAllCampaigns } from "@/lib/campaignsService";
import { getAssociates } from "@/lib/associatesService";
import campaignsCache from "@/lib/campaignsCache";

// Importar componentes
import StatsFilters from "./StatsFilters";
import GlobalMetrics from "./GlobalMetrics";
import TimeSeriesCharts from "./TimeSeriesCharts";
import CampaignsSummary from "./CampaignsSummary";
import CampaignsStats from "./CampaignsStats";
import TopUsers from "./TopUsers";
import TopAssociates from "./TopAssociates";
import DashboardFooter from "./DashboardFooter";

/**
 * Componente DashboardStats - Componente principal para mostrar estadísticas del dashboard
 * Maneja la carga de datos, filtros y renderizado de todos los componentes de estadísticas
 */
export default function DashboardStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [associates, setAssociates] = useState([]);
  const [filters, setFilters] = useState(() => {
    const defaultRange = getDefaultDateRange();
    return {
      ...defaultRange,
      includeTopUsers: true,
      includeTopAssociates: true,
      topLimit: 10,
    };
  });

  // Cargar campañas y comercios para los filtros
  useEffect(() => {
    const loadFilterData = async () => {
      try {
        // Verificar si hay campañas en caché
        let campaignsData = campaignsCache.get();
        
        // Si no hay en caché, verificar si hay una carga en curso
        if (!campaignsData) {
          const existingPromise = campaignsCache.getLoadingPromise();
          
          if (existingPromise) {
            // Reutilizar la promesa existente
            try {
              campaignsData = await existingPromise;
            } catch (error) {
              console.error("Error al reutilizar promesa de campañas:", error);
              campaignsCache.clearLoadingPromise();
            }
          }
          
          // Si aún no hay datos, crear nueva consulta
          if (!campaignsData) {
            const loadPromise = getAllCampaigns();
            campaignsCache.setLoadingPromise(loadPromise);
            
            try {
              campaignsData = await loadPromise;
              // Guardar en caché
              campaignsCache.set(campaignsData);
            } catch (error) {
              console.error("Error al cargar campañas:", error);
              campaignsData = [];
            } finally {
              campaignsCache.clearLoadingPromise();
            }
          }
        }

        // Cargar asociados en paralelo
        const associatesResponse = await getAssociates(1, 100).catch(() => ({ associates: [] }));
        
        setCampaigns(Array.isArray(campaignsData) ? campaignsData : []);
        // getAssociates devuelve un objeto con associates y paginación
        const associatesList = associatesResponse?.associates || [];
        setAssociates(Array.isArray(associatesList) ? associatesList : []);
      } catch (error) {
        console.error("Error al cargar datos para filtros:", error);
        setCampaigns([]);
        setAssociates([]);
      }
    };
    loadFilterData();
  }, []);

  // Función para cargar estadísticas
  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Log de los filtros que se están enviando
      if (process.env.NODE_ENV === 'development') {
        console.log('🔄 Cargando estadísticas con filtros:', filters);
      }
      
      const data = await getDashboardStats(filters);
      
      // Log de los datos recibidos para verificar que se actualizan
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Estadísticas actualizadas:', {
          tieneTimeSeries: !!data?.timeSeries,
          dailyTickets: data?.timeSeries?.dailyTickets?.length || 0,
          dailyAmount: data?.timeSeries?.dailyAmount?.length || 0,
          filtroCampana: filters.campaignId || 'Ninguna'
        });
      }
      
      setStats(data);
    } catch (err) {
      console.error("Error al cargar estadísticas:", err);
      // Mostrar mensaje de error más detallado
      let errorMessage = "Error al cargar las estadísticas. Por favor, intenta de nuevo.";
      if (err.response) {
        // Si hay respuesta del servidor, mostrar el mensaje específico
        errorMessage = err.response.data?.message || 
          err.response.data?.error ||
          `Error ${err.response.status}: ${err.response.statusText}`;
      } else if (err.request) {
        errorMessage = "No se pudo conectar con el servidor. Verifica tu conexión.";
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Cargar estadísticas cuando cambian los filtros
  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleRefresh = () => {
    loadStats();
  };

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-red-600" />
          <div className="flex-1">
            <h3 className="font-bold text-red-800 mb-1">Error al cargar estadísticas</h3>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header con botón de actualizar */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-primary">Estadísticas del Dashboard</h2>
          <p className="text-gray-600 text-sm mt-1">
            Métricas de uso y registro del sistema
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw
            className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
          />
          Actualizar
        </button>
      </div>

      {/* Filtros */}
      <StatsFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        campaigns={campaigns}
        associates={associates}
      />

      {/* Mostrar error si hay pero también hay datos previos */}
      {error && stats && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <p className="text-yellow-800 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Métricas globales */}
      <GlobalMetrics global={stats?.global} />

      {/* Gráficas de series temporales */}
      <TimeSeriesCharts timeSeries={stats?.timeSeries} />

      {/* Resumen de campañas */}
      <CampaignsSummary campaignsSummary={stats?.campaignsSummary} />

      {/* Estadísticas por campaña */}
      {stats?.campaigns && stats.campaigns.length > 0 && (
        <CampaignsStats campaigns={stats.campaigns} />
      )}

      {/* Top usuarios y comercios en grid */}
      {(stats?.topUsers?.length > 0 || stats?.topAssociates?.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {stats.topUsers && stats.topUsers.length > 0 && (
            <TopUsers topUsers={stats.topUsers} />
          )}
          {stats.topAssociates && stats.topAssociates.length > 0 && (
            <TopAssociates topAssociates={stats.topAssociates} />
          )}
        </div>
      )}

      {/* Footer con última actualización */}
      {stats?.metadata?.generatedAt && (
        <DashboardFooter lastUpdate={stats.metadata.generatedAt} />
      )}
    </div>
  );
}
