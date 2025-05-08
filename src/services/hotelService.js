import { api } from './api';

export const hotelService = {
  // Obtener lista de hoteles con filtros
  getHotels: async (filters = {}) => {
    const { data } = await api.get('/hoteles', { params: filters });
    return data;
  },

  // Obtener un hotel por ID
  getHotelById: async (id) => {
    const { data } = await api.get(`/hoteles/${id}`);
    return data;
  },

  // Crear un nuevo hotel (solo admin)
  createHotel: async (hotelData) => {
    const { data } = await api.post('/hoteles', hotelData);
    return data;
  },

  // Actualizar un hotel (solo admin)
  updateHotel: async (id, hotelData) => {
    const { data } = await api.put(`/hoteles/${id}`, hotelData);
    return data;
  },

  // Eliminar un hotel (solo admin)
  deleteHotel: async (id) => {
    const { data } = await api.delete(`/hoteles/${id}`);
    return data;
  }
};

export async function fetchHoteles() {
  const response = await fetch('http://localhost:8081/api/hoteles');
  if (!response.ok) {
    throw new Error('Error al obtener los hoteles');
  }
  return await response.json();
} 