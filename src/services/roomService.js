import { api } from './api';

export const roomService = {
  // Obtener habitaciones de un hotel con filtros
  getRooms: async (hotelId, filters = {}) => {
    const { data } = await api.get('/api/habitaciones', {
      params: { hotel: hotelId, ...filters }
    });
    return data;
  },

  // Obtener una habitación por ID
  getRoomById: async (id) => {
    const { data } = await api.get(`/api/habitaciones/${id}`);
    return data;
  },

  // Crear una nueva habitación (solo admin)
  createRoom: async (roomData) => {
    const { data } = await api.post('/api/habitaciones', roomData);
    return data;
  },

  // Actualizar una habitación (solo admin)
  updateRoom: async (id, roomData) => {
    const { data } = await api.put(`/api/habitaciones/${id}`, roomData);
    return data;
  },

  // Eliminar una habitación (solo admin)
  deleteRoom: async (id) => {
    const { data } = await api.delete(`/api/habitaciones/${id}`);
    return data;
  },

  // Obtener historial de una habitación
  getRoomHistory: async (id, page = 0, size = 10) => {
    const { data } = await api.get(`/api/historial/habitaciones/${id}`, {
      params: { page, size }
    });
    return data;
  }
}; 