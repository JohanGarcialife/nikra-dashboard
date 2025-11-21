'use client'

import { useEffect, useState } from 'react';

/**
 * Componente DashboardFooter - Pie del dashboard con última actualización
 * @param {Object} props
 * @param {string} props.lastUpdate - Timestamp de última actualización (opcional)
 */
export default function DashboardFooter({ lastUpdate }) {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    // Función para formatear la fecha
    const formatDate = (date) => {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      
      return `${day}/${month}/${year} - ${hours}:${minutes}h (Europe/Madrid)`;
    };

    // Establecer la hora inicial
    if (lastUpdate) {
      setCurrentTime(formatDate(new Date(lastUpdate)));
    } else {
      setCurrentTime(formatDate(new Date()));
    }

    // Actualizar cada minuto si no hay lastUpdate específico
    if (!lastUpdate) {
      const interval = setInterval(() => {
        setCurrentTime(formatDate(new Date()));
      }, 60000); // 60 segundos

      return () => clearInterval(interval);
    }
  }, [lastUpdate]);

  return (
    <footer className="mt-8 py-4 border-t border-gray-200">
      <p className="text-sm text-gray-500 text-center">
        Última actualización: <span className="font-medium text-gray-700">{currentTime}</span>
      </p>
    </footer>
  );
}

