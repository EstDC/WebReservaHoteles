import { create } from 'zustand';
import api from '../utils/api';

export const useHabitacionStore = create((set, get) => ({
  filtros: {
    fechaInicio: '',
    fechaFin: ''
  },
  habitaciones: [],
  loading: false,
  error: null,
  setFilters: (filtros) => set({ filtros }),
  fetchHabitaciones: async (filtros = null) => {
    set({ loading: true, error: null });
    try {
      const params = filtros || get().filtros;
      const { data } = await api.get('/habitaciones/habitaciones/disponibles-global', { params });
      set({ habitaciones: Array.isArray(data) ? data : [], loading: false, error: null });
      return data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
})); 