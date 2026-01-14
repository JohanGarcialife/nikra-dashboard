"use client";

import { X } from "lucide-react";
import { useState } from "react";
import apiClient from "@/lib/axios";

/**
 * Componente ExportParticipantesModal - Modal para filtrar y exportar participantes
 * @param {Object} props
 * @param {boolean} props.isOpen - Si el modal está abierto
 * @param {Function} props.onClose - Callback para cerrar el modal
 */
export default function ExportParticipantesModal({ isOpen, onClose }) {
  const [filters, setFilters] = useState({
    userId: "",
    associateId: "",
    fechaDesde: "",
    fechaHasta: "",
    numeroTicket: "",
  });
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpiar error al cambiar
    if (error) {
      setError(null);
    }
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      setError(null);

      // Construir parámetros de query (solo incluir los que tienen valor)
      const params = {};
      if (filters.userId.trim()) {
        params.userId = filters.userId.trim();
      }
      if (filters.associateId.trim()) {
        params.associateId = filters.associateId.trim();
      }
      if (filters.fechaDesde.trim()) {
        params.fechaDesde = filters.fechaDesde.trim();
      }
      if (filters.fechaHasta.trim()) {
        params.fechaHasta = filters.fechaHasta.trim();
      }
      if (filters.numeroTicket.trim()) {
        params.numeroTicket = filters.numeroTicket.trim();
      }

      // Hacer la petición GET para descargar el archivo Excel
      const response = await apiClient.get("/api/export/participations/excel", {
        params,
        responseType: "blob", // Importante para descargar archivos binarios
      });

      // Crear un blob del archivo descargado
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Crear una URL temporal para el blob
      const url = window.URL.createObjectURL(blob);

      // Crear un elemento <a> para descargar el archivo
      const link = document.createElement("a");
      link.href = url;
      link.download = "participaciones.xlsx";
      document.body.appendChild(link);
      link.click();

      // Limpiar
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Cerrar el modal después de la descarga exitosa
      onClose();
    } catch (err) {
      console.error("Error al exportar participantes:", err);
      setError(
        err.response?.data?.message ||
          "Error al exportar participantes. Por favor, intenta de nuevo."
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleReset = () => {
    setFilters({
      userId: "",
      associateId: "",
      fechaDesde: "",
      fechaHasta: "",
      numeroTicket: "",
    });
    setError(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop con blur */}
      <div
        className="absolute inset-0 backdrop-blur-sm bg-black/30"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-primary">
            Exportar Participantes
          </h2>
          <button
            onClick={onClose}
            className="text-primary hover:text-primary/80 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6">
          <p className="text-gray-600 mb-6">
            Configura los filtros para exportar las participaciones a Excel.
            Todos los campos son opcionales.
          </p>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {/* Formulario de filtros */}
          <div className="space-y-4">
            {/* User ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID del Usuario
              </label>
              <input
                type="text"
                name="userId"
                value={filters.userId}
                onChange={handleChange}
                placeholder="123e4567-e89b-12d3-a456-426614174000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <p className="mt-1 text-xs text-gray-500">
                ID del usuario para filtrar participaciones específicas
              </p>
            </div>

            {/* Associate ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID del Comercio
              </label>
              <input
                type="text"
                name="associateId"
                value={filters.associateId}
                onChange={handleChange}
                placeholder="123e4567-e89b-12d3-a456-426614174000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <p className="mt-1 text-xs text-gray-500">
                ID del comercio para filtrar participaciones específicas
              </p>
            </div>

            {/* Fecha Desde */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha Desde
              </label>
              <input
                type="date"
                name="fechaDesde"
                value={filters.fechaDesde}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <p className="mt-1 text-xs text-gray-500">
                Fecha desde para filtrar participaciones (formato YYYY-MM-DD)
              </p>
            </div>

            {/* Fecha Hasta */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha Hasta
              </label>
              <input
                type="date"
                name="fechaHasta"
                value={filters.fechaHasta}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <p className="mt-1 text-xs text-gray-500">
                Fecha hasta para filtrar participaciones (formato YYYY-MM-DD)
              </p>
            </div>

            {/* Número de Ticket */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Ticket
              </label>
              <input
                type="text"
                name="numeroTicket"
                value={filters.numeroTicket}
                onChange={handleChange}
                placeholder="T-2025-"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <p className="mt-1 text-xs text-gray-500">
                Filtrar por número de ticket
              </p>
            </div>
          </div>
        </div>

        {/* Footer con botones */}
        <div className="flex items-center justify-end gap-4 p-6 border-t border-gray-200">
          <button
            onClick={handleReset}
            disabled={isExporting}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Limpiar
          </button>
          <button
            onClick={onClose}
            disabled={isExporting}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Exportando...
              </>
            ) : (
              "Exportar a Excel"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
