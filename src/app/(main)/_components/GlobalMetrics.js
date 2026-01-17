"use client";

import { Ticket, Euro, Users } from "lucide-react";
import MetricCard from "./MetricCard";
import { formatNumber, formatChange } from "@/lib/statsService";

/**
 * Componente GlobalMetrics - Muestra las métricas globales del dashboard
 * @param {Object} props
 * @param {Object} props.global - Objeto con las métricas globales
 */
export default function GlobalMetrics({ global }) {
  if (!global) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-md p-6 animate-pulse"
          >
            <div className="h-10 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <MetricCard
        icon={Ticket}
        title="Tickets registrados"
        value={formatNumber(global.totalTickets)}
        change={formatChange(global.totalTicketsChange)}
        iconColor="text-primary"
      />
      <MetricCard
        icon={Euro}
        title="Volumen total registrado"
        value={`${formatNumber(global.totalAmount)}€`}
        change={formatChange(global.totalAmountChange)}
        iconColor="text-primary"
      />
      <MetricCard
        icon={Users}
        title="Participantes únicos"
        value={formatNumber(global.totalUsers)}
        change={formatChange(global.totalUsersChange)}
        iconColor="text-primary"
      />
    </div>
  );
}
