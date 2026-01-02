'use client'
import apiClient from './axios';

export const getTickets = async (page = 1, limit = 10) => {
  try {
    const response = await apiClient.get('/api/tickets', {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener tickets:', error); // Corrected error message
    throw error;
  }
};

export const deleteTicket = async (id) => {
  try {
    const response = await apiClient.delete(`/api/tickets/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar ticket ${id}:`, error);
    throw error;
  }
};

/**
 * Actualiza el estado de validación de un ticket.
 * @param {string} id - ID del ticket
 * @param {boolean} validated - Nuevo estado de validación
 * @returns {Promise} - Datos del ticket actualizado
 */
export const updateTicketStatus = async (id, validated) => {
  try {
    const response = await apiClient.patch(`/api/tickets/${id}/status`, { validated });
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar estado del ticket ${id}:`, error);
    throw error;
  }
};

/**
 * Formatea una fecha ISO a DD/MM/AAAA
 * @param {string} isoDate - Fecha en formato ISO
 * @returns {string} - Fecha formateada
 */
export const formatTicketDate = (isoDate) => {
  if (!isoDate) return 'N/A';
  const date = new Date(isoDate);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Formatea un importe a formato de moneda (EUR)
 * @param {number} amount - Importe numérico
 * @returns {string} - Importe formateado con símbolo de moneda
 */
export const formatTicketAmount = (amount) => {
  if (typeof amount !== 'number') return 'N/A';
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
};

/**
 * Obtiene el badge de estado para un ticket (Validado / Pendiente)
 * @param {boolean} isValidated - Si el ticket está validado
 * @returns {Object} - Objeto con estilos y etiqueta del badge
 */
export const getTicketStatusBadge = (isValidated) => {
  if (isValidated) {
    return {
      bg: "bg-green-100",
      text: "text-green-800",
      label: "Validado",
    };
  } else {
    return {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      label: "Pendiente",
    };
  }
};