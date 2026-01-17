'use client'
import apiClient from './axios';

/**
 * Servicio para manejar todas las operaciones relacionadas con estadísticas del dashboard
 */

/**
 * Obtener estadísticas del dashboard
 * @param {Object} params - Parámetros de filtrado
 * @param {string} params.fechaDesde - Fecha desde para el análisis (formato YYYY-MM-DD)
 * @param {string} params.fechaHasta - Fecha hasta para el análisis (formato YYYY-MM-DD)
 * @param {string} params.campaignId - Filtrar estadísticas por una campaña específica
 * @param {string} params.associateId - Filtrar estadísticas por un comercio específico
 * @param {boolean} params.includeTopUsers - Incluir top usuarios en las estadísticas
 * @param {boolean} params.includeTopAssociates - Incluir top comercios en las estadísticas
 * @param {number} params.topLimit - Límite de resultados para tops (usuarios, comercios)
 * @returns {Promise} - Respuesta con todas las estadísticas del dashboard
 */
export const getDashboardStats = async (params = {}) => {
  try {
    // Construir los parámetros de consulta, excluyendo valores undefined/null/vacíos
    const queryParams = {};
    
    // Solo agregar parámetros si tienen valores válidos (no vacíos, no null, no undefined)
    if (params.fechaDesde && typeof params.fechaDesde === 'string' && params.fechaDesde.trim() !== '') {
      queryParams.fechaDesde = params.fechaDesde.trim();
    }
    if (params.fechaHasta && typeof params.fechaHasta === 'string' && params.fechaHasta.trim() !== '') {
      queryParams.fechaHasta = params.fechaHasta.trim();
    }
    if (params.campaignId && typeof params.campaignId === 'string' && params.campaignId.trim() !== '') {
      const campaignId = params.campaignId.trim();
      // Validar que el campaignId tenga formato válido (UUID o string no vacío)
      if (campaignId.length > 0) {
        queryParams.campaignId = campaignId;
        // Log para debugging (solo en desarrollo)
        if (process.env.NODE_ENV === 'development') {
          console.log('📊 Enviando campaignId a la API:', campaignId);
        }
      }
    }
    if (params.associateId && typeof params.associateId === 'string' && params.associateId.trim() !== '') {
      queryParams.associateId = params.associateId.trim();
    }
    // Los booleanos se envían como strings "true" o "false" para que el servidor los interprete correctamente
    if (params.includeTopUsers !== undefined && params.includeTopUsers !== null) {
      queryParams.includeTopUsers = String(params.includeTopUsers === true || params.includeTopUsers === 'true');
    }
    if (params.includeTopAssociates !== undefined && params.includeTopAssociates !== null) {
      queryParams.includeTopAssociates = String(params.includeTopAssociates === true || params.includeTopAssociates === 'true');
    }
    // Solo enviar topLimit si es un número válido mayor a 0
    if (params.topLimit !== undefined && params.topLimit !== null) {
      const limit = Number(params.topLimit);
      if (!isNaN(limit) && limit > 0) {
        queryParams.topLimit = limit;
      }
    }

    const response = await apiClient.get('/api/stats/dashboard', {
      params: queryParams
    });
    
    // Log de la respuesta completa para debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Respuesta completa de la API de estadísticas:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        paramsEnviados: queryParams
      });
    }
    
    return response.data;
  } catch (error) {
    console.error('Error al obtener estadísticas del dashboard:', error);
    // Log adicional para debugging
    if (error.response) {
      console.error('Respuesta del servidor:', error.response.data);
      console.error('Status:', error.response.status);
      console.error('Parámetros enviados:', error.config?.params);
    }
    throw error;
  }
};

/**
 * Formatear número con separadores de miles
 * @param {number} value - Valor numérico
 * @returns {string} - Valor formateado
 */
export const formatNumber = (value) => {
  if (value === null || value === undefined) return '0';
  return value.toLocaleString('es-ES');
};

/**
 * Formatear cambio porcentual o absoluto
 * @param {number} change - Valor del cambio
 * @param {boolean} isPercentage - Si es porcentaje (default: false)
 * @returns {string} - Cambio formateado con signo
 */
export const formatChange = (change, isPercentage = false) => {
  if (change === null || change === undefined || change === 0) return null;
  const sign = change > 0 ? '+' : '';
  const formattedValue = isPercentage 
    ? `${sign}${change.toFixed(2)}%`
    : `${sign}${formatNumber(change)}`;
  return formattedValue;
};

/**
 * Formatear fecha ISO a formato DD/MM/YY para gráficas
 * @param {string} isoDate - Fecha en formato ISO
 * @returns {string} - Fecha en formato DD/MM/YY
 */
export const formatDateForChart = (isoDate) => {
  if (!isoDate) return '';
  const date = new Date(isoDate);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
};

/**
 * Obtener rango de fechas por defecto (últimos 30 días)
 * @returns {Object} - Objeto con fechaDesde y fechaHasta
 */
export const getDefaultDateRange = () => {
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);

  return {
    fechaDesde: thirtyDaysAgo.toISOString().split('T')[0],
    fechaHasta: today.toISOString().split('T')[0]
  };
};
