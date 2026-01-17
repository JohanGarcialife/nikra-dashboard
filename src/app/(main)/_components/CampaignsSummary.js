"use client";

import { Calendar, TrendingUp, Clock, CheckCircle } from "lucide-react";

/**
 * Componente CampaignsSummary - Muestra el resumen de campañas
 * @param {Object} props
 * @param {Object} props.campaignsSummary - Objeto con el resumen de campañas
 */
export default function CampaignsSummary({ campaignsSummary }) {
  if (!campaignsSummary) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6 mb-8 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const summaryCards = [
    {
      label: "Total Campañas",
      value: campaignsSummary.totalCampaigns || 0,
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Campañas Activas",
      value: campaignsSummary.activeCampaigns || 0,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Próximas Campañas",
      value: campaignsSummary.upcomingCampaigns || 0,
      icon: TrendingUp,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      label: "Por Expirar",
      value: campaignsSummary.expiringSoon || 0,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
      <h3 className="text-lg font-bold text-primary mb-4">
        Resumen de Campañas
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {summaryCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className={`${card.bgColor} rounded-lg p-4 flex items-center gap-3`}
            >
              <div className={card.color}>
                <Icon className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{card.label}</p>
                <p className="text-2xl font-bold text-gray-800">
                  {card.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
