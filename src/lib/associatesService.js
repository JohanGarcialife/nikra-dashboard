import apiClient from '@/lib/axios';

export const getAssociates = async (page = 1, limit = 10) => {
  try {
    const response = await apiClient.get('/api/associates', {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  }
};

/**
 * Obtener un asociado por su ID
 * @param {string} id - ID del asociado
 * @returns {Promise} - Datos del asociado
 */
export const getAssociateById = async (id) => {
  try {
    const response = await apiClient.get(`/api/associates/${id}`);
    console.log(response.data);
    return response.data;
    
  } catch (error) {
    console.error(`Error al obtener asociado ${id}:`, error);
    throw error;
  }
};

/**
 * Crear un nuevo asociado
 * @param {Object} data - Datos del asociado
 * @returns {Promise} - Datos del asociado creado
 */
export const createAssociate = async (data) => {
  try {
    const response = await apiClient.post('/api/associates', data);
    return response.data;
  } catch (error) {
    console.error('Error al crear asociado:', error);
    throw error;
  }
};

/**
 * Actualizar un asociado existente
 * @param {string} id - ID del asociado
 * @param {Object} data - Datos a actualizar
 * @returns {Promise} - Datos del asociado actualizado
 */
export const updateAssociate = async (id, data) => {
  try {
    const response = await apiClient.patch(`/api/associates/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar asociado ${id}:`, error);
    throw error;
  }
};

/**
 * Subir imagen de asociado
 * @param {File} file - Archivo de imagen a subir
 * @returns {Promise} - Respuesta con información del archivo subido
 */
export const uploadAssociateImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/api/upload/associate', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al subir imagen de asociado:', error);
    throw error;
  }
};