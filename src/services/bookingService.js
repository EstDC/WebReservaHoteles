import { api } from './api';

export const bookingService = {
  // Obtener reservas con filtros
  getBookings: async (filters = {}) => {
    const { data } = await api.get('/api/reservas', { params: filters });
    return data;
  },

  // Obtener una reserva por ID
  getBookingById: async (id) => {
    const { data } = await api.get(`/api/reservas/${id}`);
    return data;
  },

  // Crear una nueva reserva
  createBooking: async (bookingData) => {
    const { data } = await api.post('/api/reservas', bookingData);
    return data;
  },

  // Actualizar una reserva
  updateBooking: async (id, bookingData) => {
    const { data } = await api.put(`/api/reservas/${id}`, bookingData);
    return data;
  },

  // Cancelar una reserva
  cancelBooking: async (id) => {
    const { data } = await api.put(`/api/reservas/${id}/cancelar`);
    return data;
  },

  // Archivar una reserva (solo admin)
  archiveBooking: async (id) => {
    const { data } = await api.put(`/api/reservas/${id}/archivar`);
    return data;
  },

  // Eliminar una reserva
  deleteBooking: async (id) => {
    const { data } = await api.delete(`/api/reservas/${id}`);
    return data;
  },

  // Obtener historial de reservas
  getBookingHistory: async (filters = {}) => {
    const { data } = await api.get('/api/historial/reservas', { params: filters });
    return data;
  }
}; 