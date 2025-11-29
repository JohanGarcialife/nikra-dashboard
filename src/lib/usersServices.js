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
export const getUsers = async (page = 1, limit = 10) => {
  try {
    const response = await apiClient.get('/api/users', {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await apiClient.delete(`/api/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar usuario ${id}:`, error);
    throw error;
  }
};