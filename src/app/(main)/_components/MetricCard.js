"use client";

/**
 * Componente MetricCard - Tarjeta de métrica con icono, valor y cambio
 * @param {Object} props
 * @param {React.Component} props.icon - Componente de icono de lucide-react
 * @param {string} props.title - Título de la métrica
 * @param {string|number} props.value - Valor de la métrica
 * @param {string} props.change - Cambio de la métrica (ej: "+682")
 * @param {string} props.iconColor - Color del icono (por defecto primary)
 */
export default function MetricCard({
  icon: Icon,
  title,
  value,
  change,
  iconColor = "text-primary",
}) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center gap-4">
        {/* Icono */}
        <div className={`${iconColor}`}>
          <Icon className="w-10 h-10" />
        </div>

        {/* Contenido */}
        <div className="flex-1">
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-primary">{value}</span>
            {change && (
              <span
                className={`text-sm font-medium ${
                  change.startsWith("-")
                    ? "text-red-600"
                    : change.startsWith("+")
                    ? "text-green-600"
                    : "text-gray-600"
                }`}
              >
                {change}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

