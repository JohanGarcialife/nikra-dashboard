'use client'

import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

/**
 * Componente LineChart - Gráfica de línea reutilizable
 * @param {Object} props
 * @param {string} props.title - Título de la gráfica
 * @param {Array} props.data - Datos de la gráfica en formato [{name: '01/11', value: 497}, ...]
 * @param {string} props.dataKey - Key del valor a graficar (default: 'value')
 * @param {string} props.xAxisKey - Key del eje X (default: 'name')
 * @param {string} props.lineColor - Color de la línea (default: '#133D74')
 * @param {string} props.yAxisLabel - Label opcional para el eje Y
 * @param {Function} props.formatValue - Función para formatear el valor en el tooltip
 */
export default function LineChart({ 
  title, 
  data = [], 
  dataKey = 'value',
  xAxisKey = 'name',
  lineColor = '#133D74',
  yAxisLabel,
  formatValue = (value) => value.toLocaleString('es-ES')
}) {
  
  // Tooltip personalizado
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
          <p className="text-lg font-bold text-primary">
            {formatValue(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
      {/* Encabezado de la gráfica */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-primary">{title}</h3>
        {/* Icono opcional para acciones */}
        <button
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Opciones de gráfica"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-400"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>

      {/* Gráfica */}
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart 
            data={data}
            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey={xAxisKey}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              stroke="#E5E7EB"
            />
            <YAxis
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              stroke="#E5E7EB"
              label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft', fill: '#9CA3AF' } : undefined}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={lineColor}
              strokeWidth={3}
              dot={{ fill: lineColor, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
              label={{
                position: 'top',
                fill: '#1F2937',
                fontSize: 12,
                fontWeight: 'bold',
                formatter: (value) => value.toLocaleString('es-ES')
              }}
            />
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

