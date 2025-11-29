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