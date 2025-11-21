"use client";

import { useRouter } from "next/navigation";
import apiClient from "@/lib/axios";
import { useEffect, useState } from "react";
import useAuthStore from "@/store/auth";
import { Ticket, Euro, Users } from "lucide-react";

// Importar componentes del dashboard
import DashboardHeader from "./_components/DashboardHeader";
import MetricCard from "./_components/MetricCard";
import LineChart from "./_components/LineChart";
import DashboardFooter from "./_components/DashboardFooter";

// Importar servicio de campañas
import {
  getActiveCampaigns,
  formatCampaignDateRange,
} from "@/lib/campaignsService";

export default function Home() {
  const { user, login, logout } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [activeCampaign, setActiveCampaign] = useState(null);
  const [campaignLoading, setCampaignLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`;
        const response = await apiClient.get(url);

        if (response.data) {
          login(response.data);
        } else {
          throw new Error("No user data received");
        }
      } catch (error) {
        console.error("Session validation failed:", error);
        logout();
        document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    if (!user) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [user, login, logout, router]);

  // Cargar campañas activas
  useEffect(() => {
    const loadActiveCampaign = async () => {
      try {
        setCampaignLoading(true);
        const campaigns = await getActiveCampaigns();

        // Obtener la primera campaña activa (si existe)
        if (campaigns && campaigns.length > 0) {
          setActiveCampaign(campaigns[0]);
        } else {
          setActiveCampaign(null);
        }
      } catch (error) {
        console.error("Error al cargar campañas activas:", error);
        setActiveCampaign(null);
      } finally {
        setCampaignLoading(false);
      }
    };

    // Solo cargar campañas si el usuario ya está autenticado
    if (user) {
      loadActiveCampaign();
    }
  }, [user]);

  // Datos mock basados en la imagen del dashboard
  const metricsData = {
    ticketsRegistrados: {
      value: 4365,
      change: "+682",
    },
    volumenTotal: {
      value: "69.676",
      change: "+10.460",
    },
    participantesUnicos: {
      value: 3549,
      change: "+167",
    },
  };

  // Datos para la gráfica de registros de tickets diarios
  const ticketsChartData = [
    { name: "01/11", value: 497 },
    { name: "02/11", value: 536 },
    { name: "03/11", value: 450 },
    { name: "04/11", value: 605 },
    { name: "05/11", value: 348 },
    { name: "06/11", value: 628 },
    { name: "07/11", value: 639 },
    { name: "08/11", value: 662 },
  ];

  // Datos para la gráfica de volumen de compras diarias
  const volumeChartData = [
    { name: "01/11", value: 8346 },
    { name: "02/11", value: 9036 },
    { name: "03/11", value: 6898 },
    { name: "04/11", value: 9747 },
    { name: "05/11", value: 6567 },
    { name: "06/11", value: 9634 },
    { name: "07/11", value: 8989 },
    { name: "08/11", value: 10460 },
  ];

  if (loading || campaignLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Mensaje si no hay campaña activa */}
      {!activeCampaign && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-6">
          <p className="font-medium">No hay campañas activas en este momento</p>
          <p className="text-sm mt-1">
            Las métricas que se muestran son datos de ejemplo.
          </p>
        </div>
      )}

      {/* Header del dashboard */}
      <DashboardHeader
        title={activeCampaign ? "Campaña Activa" : "Dashboard"}
        subtitle={activeCampaign ? activeCampaign.nombre : "Sin campaña activa"}
        dateRange={
          activeCampaign
            ? formatCampaignDateRange(
                activeCampaign.fechaInicio,
                activeCampaign.fechaFin
              )
            : "N/A"
        }
      />

      {/* Grid de tarjetas de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <MetricCard
          icon={Ticket}
          title="Tickets registrados"
          value={metricsData.ticketsRegistrados.value}
          change={metricsData.ticketsRegistrados.change}
          iconColor="text-primary"
        />
        <MetricCard
          icon={Euro}
          title="Volumen total registrado"
          value={metricsData.volumenTotal.value}
          change={metricsData.volumenTotal.change}
          iconColor="text-primary"
        />
        <MetricCard
          icon={Users}
          title="Participantes únicos"
          value={metricsData.participantesUnicos.value}
          change={metricsData.participantesUnicos.change}
          iconColor="text-primary"
        />
      </div>

      {/* Gráficas - Una debajo de la otra */}
      <div className="space-y-6 mb-8">
        <LineChart
          title="Registros de tickets diarios"
          data={ticketsChartData}
          dataKey="value"
          xAxisKey="name"
          lineColor="#133D74"
        />
        <LineChart
          title="Volumen de compras diarias (€)"
          data={volumeChartData}
          dataKey="value"
          xAxisKey="name"
          lineColor="#133D74"
          formatValue={(value) => `${value.toLocaleString("es-ES")}€`}
        />
      </div>

      {/* Footer con última actualización */}
      <DashboardFooter lastUpdate="2025-11-08T00:00:00" />
    </div>
  );
}
