'use client'
import apiClient from './axios';

/**
 * Servicio para manejar todas las operaciones relacionadas con campañas
 */

/**
 * Obtener todas las campañas con paginación
 * @param {number} page - Número de página (default: 1)
 * @param {number} limit - Número de items por página (default: 10)
 * @returns {Promise} - Respuesta con campañas y paginación
 */
export const getCampaigns = async (page = 1, limit = 10) => {
  try {
    const response = await apiClient.get('/api/campaigns', {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener campañas:', error);
    throw error;
  }
};

/**
 * Obtener todas las campañas activas
 * @returns {Promise} - Array de campañas activas
 */
export const getActiveCampaigns = async () => {
  try {
    const response = await apiClient.get('/api/campaigns/active');
    return response.data;
  } catch (error) {
    console.error('Error al obtener campañas activas:', error);
    throw error;
  }
};

/**
 * Obtener una campaña por su ID
 * @param {string} id - ID de la campaña
 * @returns {Promise} - Datos de la campaña
 */
export const getCampaignById = async (id) => {
  try {
    const response = await apiClient.get(`/api/campaigns/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener campaña ${id}:`, error);
    throw error;
  }
};

/**
 * Crear una nueva campaña
 * @param {Object} data - Datos de la campaña
 * @param {string} data.nombre - Nombre de la campaña
 * @param {string} data.descripcion - Descripción de la campaña
 * @param {string} data.imagenUrl - URL de la imagen
 * @param {boolean} data.isActive - Si la campaña está activa
 * @param {string} data.fechaInicio - Fecha de inicio (ISO string)
 * @param {string} data.fechaFin - Fecha de fin (ISO string)
 * @returns {Promise} - Datos de la campaña creada
 */
export const createCampaign = async (data) => {
  try {
    const response = await apiClient.post('/api/campaigns', data);
    return response.data;
  } catch (error) {
    console.error('Error al crear campaña:', error);
    throw error;
  }
};

/**
 * Eliminar una campaña
 * @param {string} id - ID de la campaña a eliminar
 * @returns {Promise}
 */
export const deleteCampaign = async (id) => {
  try {
    const response = await apiClient.delete(`/api/campaigns/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar campaña ${id}:`, error);
    throw error;
  }
};

/**
 * Subir imagen de campaña
 * @param {File} file - Archivo de imagen a subir
 * @returns {Promise} - Respuesta con información del archivo subido
 */
export const uploadCampaignImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/api/upload/campaign', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al subir imagen de campaña:', error);
    throw error;
  }
};

/**
 * Obtener URL completa para una imagen de campaña
 * @param {string} filename - Nombre del archivo
 * @returns {string} - URL completa de la imagen
 */
export const getCampaignImageUrl = (filename) => {
  if (!filename) return null;
  return `${process.env.NEXT_PUBLIC_API_URL}/api/upload/campaign/${filename}`;
};

/**
 * Calcular el estado de una campaña basado en fechas e isActive
 * @param {Object} campaign - Objeto de campaña
 * @returns {string} - Estado: 'Preparada', 'Activa', 'Finalizada', o 'Archivada'
 */
export const calculateCampaignStatus = (campaign) => {
  if (!campaign) return 'Preparada';
  
  const now = new Date();
  const startDate = new Date(campaign.fechaInicio);
  const endDate = new Date(campaign.fechaFin);
  
  // Si está marcada como inactiva, es archivada
  if (!campaign.isActive) {
    return 'Archivada';
  }
  
  // Si la fecha actual es antes del inicio
  if (now < startDate) {
    return 'Preparada';
  }
  
  // Si la fecha actual es después del fin
  if (now > endDate) {
    return 'Finalizada';
  }
  
  // Si está entre las fechas de inicio y fin
  return 'Activa';
};

/**
 * Formatear fecha desde ISO a formato DD/MM/YY
 * @param {string} isoDate - Fecha en formato ISO
 * @returns {string} - Fecha en formato DD/MM/YY
 */
export const formatCampaignDate = (isoDate) => {
  if (!isoDate) return 'N/A';
  const date = new Date(isoDate);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
};

/**
 * Formatear rango de fechas
 * @param {string} startDate - Fecha de inicio (ISO)
 * @param {string} endDate - Fecha de fin (ISO)
 * @returns {string} - Rango de fechas formateado
 */
export const formatCampaignDateRange = (startDate, endDate) => {
  return `${formatCampaignDate(startDate)} - ${formatCampaignDate(endDate)}`;
};

