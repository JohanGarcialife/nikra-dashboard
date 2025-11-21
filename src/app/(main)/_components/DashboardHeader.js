'use client'

/**
 * Componente DashboardHeader - Encabezado del dashboard con título y fechas
 * @param {Object} props
 * @param {string} props.title - Título de la campaña o sección
 * @param {string} props.subtitle - Subtítulo opcional
 * @param {string} props.dateRange - Rango de fechas de la campaña
 */
export default function DashboardHeader({ 
  title = "Campaña Activa", 
  subtitle,
  dateRange = "01/11/2025 - 25/11/2025"
}) {
  return (
    <div className="mb-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-primary">
          {title}
          {subtitle && (
            <span className="text-3xl font-bold text-primary ml-2">— {subtitle}</span>
          )}
        </h1>
        <p className="text-sm text-gray-500">{dateRange}</p>
      </div>
    </div>
  );
}

