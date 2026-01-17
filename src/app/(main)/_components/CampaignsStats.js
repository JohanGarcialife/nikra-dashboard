"use client";

import { useState } from "react";
import { Calendar, TrendingUp, Users, Euro, ChevronDown, ChevronUp, Clock, Ticket } from "lucide-react";
import { formatNumber, formatDateForChart } from "@/lib/statsService";

/**
 * Componente CampaignsStats - Muestra estadísticas detalladas por campaña
 * @param {Object} props
 * @param {Array} props.campaigns - Array de campañas con estadísticas
 */
export default function CampaignsStats({ campaigns }) {
  const [expandedCampaigns, setExpandedCampaigns] = useState(new Set());

  if (!campaigns || campaigns.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
        <h3 className="text-lg font-bold text-primary mb-4">
          Estadísticas por Campaña
        </h3>
        <p className="text-gray-500 text-center py-8">
          No hay estadísticas de campañas disponibles
        </p>
      </div>
    );
  }

  const toggleCampaign = (campaignId) => {
    const newExpanded = new Set(expandedCampaigns);
    if (newExpanded.has(campaignId)) {
      newExpanded.delete(campaignId);
    } else {
      newExpanded.add(campaignId);
    }
    setExpandedCampaigns(newExpanded);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
      <h3 className="text-lg font-bold text-primary mb-4">
        Estadísticas por Campaña
      </h3>
      <div className="space-y-4">
        {campaigns.map((campaign) => {
          const isExpanded = expandedCampaigns.has(campaign.id);
          const stats = campaign.stats || {};

          return (
            <div
              key={campaign.id}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              {/* Header de la campaña */}
              <div
                className="p-4 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => toggleCampaign(campaign.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    {campaign.imagenUrl && (
                      <img
                        src={campaign.imagenUrl}
                        alt={campaign.nombre}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-bold text-primary">
                        {campaign.nombre}
                      </h4>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDateForChart(campaign.fechaInicio)} -{" "}
                          {formatDateForChart(campaign.fechaFin)}
                        </span>
                        {campaign.diasRestantes !== undefined && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {campaign.diasRestantes} días restantes
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Progreso</p>
                      <p className="text-lg font-bold text-primary">
                        {stats.progress?.toFixed(1) || 0}%
                      </p>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Contenido expandible */}
              {isExpanded && (
                <div className="p-4 border-t border-gray-200">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Ticket className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-600">
                          Total Tickets
                        </span>
                      </div>
                      <p className="text-xl font-bold text-gray-800">
                        {formatNumber(stats.totalTickets || 0)}
                      </p>
                    </div>

                    <div className="bg-green-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-600">
                          Participaciones
                        </span>
                      </div>
                      <p className="text-xl font-bold text-gray-800">
                        {formatNumber(stats.totalParticipations || 0)}
                      </p>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Euro className="w-4 h-4 text-purple-600" />
                        <span className="text-sm text-gray-600">
                          Volumen Total
                        </span>
                      </div>
                      <p className="text-xl font-bold text-gray-800">
                        {formatNumber(stats.totalAmount || 0)}€
                      </p>
                    </div>

                    <div className="bg-orange-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-orange-600" />
                        <span className="text-sm text-gray-600">
                          Recientes
                        </span>
                      </div>
                      <p className="text-xl font-bold text-gray-800">
                        {formatNumber(stats.recentTickets || 0)} tickets
                      </p>
                    </div>
                  </div>

                  {/* Top Comercios */}
                  {stats.topAssociates && stats.topAssociates.length > 0 && (
                    <div className="mt-4">
                      <h5 className="font-semibold text-gray-700 mb-2">
                        Top Comercios
                      </h5>
                      <div className="space-y-2">
                        {stats.topAssociates.map((associate, idx) => (
                          <div
                            key={associate.id || idx}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded"
                          >
                            <span className="text-sm font-medium text-gray-700">
                              {associate.nombre}
                            </span>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>
                                {formatNumber(associate.ticketCount || 0)} tickets
                              </span>
                              <span>
                                {formatNumber(associate.amount || 0)}€
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
