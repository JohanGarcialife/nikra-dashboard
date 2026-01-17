"use client";

import { useMemo } from "react";
import LineChart from "./LineChart";
import { formatDateForChart } from "@/lib/statsService";

/**
 * Componente TimeSeriesCharts - Muestra las gráficas de series temporales
 * @param {Object} props
 * @param {Object} props.timeSeries - Objeto con las series temporales
 */
export default function TimeSeriesCharts({ timeSeries }) {
  // Transformar datos usando useMemo para optimizar y asegurar actualizaciones
  const ticketsChartData = useMemo(() => {
    if (!timeSeries?.dailyTickets || !Array.isArray(timeSeries.dailyTickets)) {
      return [];
    }
    
    const transformed = timeSeries.dailyTickets.map((item) => ({
      name: formatDateForChart(item.date),
      value: item.count || 0, // Usar count como campo correcto según la API
    }));
    
    // Log para debugging en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log('📈 Datos de tickets transformados:', {
        totalDias: transformed.length,
        primerDia: transformed[0],
        ultimoDia: transformed[transformed.length - 1],
        datosOriginales: timeSeries.dailyTickets.slice(0, 3)
      });
    }
    
    return transformed;
  }, [timeSeries?.dailyTickets]);

  const volumeChartData = useMemo(() => {
    if (!timeSeries?.dailyAmount || !Array.isArray(timeSeries.dailyAmount)) {
      return [];
    }
    
    const transformed = timeSeries.dailyAmount.map((item) => ({
      name: formatDateForChart(item.date),
      value: item.amount || 0,
    }));
    
    // Log para debugging en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log('💰 Datos de volumen transformados:', {
        totalDias: transformed.length,
        primerDia: transformed[0],
        ultimoDia: transformed[transformed.length - 1],
        datosOriginales: timeSeries.dailyAmount.slice(0, 3)
      });
    }
    
    return transformed;
  }, [timeSeries?.dailyAmount]);

  // Generar una key única basada en los datos para forzar re-renderizado cuando cambian
  const ticketsKey = useMemo(() => {
    return ticketsChartData.length > 0 
      ? `tickets-${ticketsChartData[0]?.name}-${ticketsChartData.length}` 
      : 'tickets-empty';
  }, [ticketsChartData]);

  const volumeKey = useMemo(() => {
    return volumeChartData.length > 0 
      ? `volume-${volumeChartData[0]?.name}-${volumeChartData.length}` 
      : 'volume-empty';
  }, [volumeChartData]);

  if (!timeSeries) {
    return (
      <div className="space-y-6 mb-8">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-md p-6 animate-pulse"
          >
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 mb-8">
      <LineChart
        key={ticketsKey}
        title="Registros de tickets diarios"
        data={ticketsChartData}
        dataKey="value"
        xAxisKey="name"
        lineColor="#133D74"
      />
      <LineChart
        key={volumeKey}
        title="Volumen de compras diarias (€)"
        data={volumeChartData}
        dataKey="value"
        xAxisKey="name"
        lineColor="#133D74"
        formatValue={(value) => `${value.toLocaleString("es-ES")}€`}
      />
    </div>
  );
}
