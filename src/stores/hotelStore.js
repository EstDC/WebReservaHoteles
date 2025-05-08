import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { hotelService } from '../services/hotelService'
import { roomService } from '../services/roomService'
import { bookingService } from '../services/bookingService'
import { api } from '../services/api'

/**
 * @typedef {import('../types/api').User} User
 * @typedef {import('../types/api').Hotel} Hotel
 * @typedef {import('../types/api').Booking} Booking
 * @typedef {import('../types/api').SearchFilters} SearchFilters
 */

/**
 * @typedef {Object} HotelState
 * @property {User | null} user
 * @property {(user: User) => void} login
 * @property {() => void} logout
 * @property {'es' | 'en'} language
 * @property {'EUR' | 'USD'} currency
 * @property {(lang: 'es' | 'en') => void} setLanguage
 * @property {(curr: 'EUR' | 'USD') => void} setCurrency
 * @property {Hotel[]} hotels
 * @property {string} searchQuery
 * @property {Hotel | null} selectedHotel
 * @property {boolean} loading
 * @property {string | null} error
 * @property {SearchFilters} filters
 * @property {Booking[]} bookings
 * @property {(query: string) => void} setSearchQuery
 * @property {(hotel: Hotel | null) => void} setSelectedHotel
 * @property {(hotels: Hotel[]) => void} setHotels
 * @property {(loading: boolean) => void} setLoading
 * @property {(error: string | null) => void} setError
 * @property {(filters: Partial<SearchFilters>) => void} setFilters
 * @property {(booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>) => void} addBooking
 * @property {(bookingId: number) => void} cancelBooking
 * @property {(email: string, newPassword: string) => void} recoverPassword
 */

export const useHotelStore = create(
  persist(
    (set, get) => ({
      // Estado inicial de autenticación
      user: null,
      login: (user) => set({ user }),
      logout: () => set({ user: null }),

      // Configuración inicial
      language: 'es',
      currency: 'EUR',
      setLanguage: (lang) => set({ language: lang }),
      setCurrency: (curr) => set({ currency: curr }),

      // Estado inicial de hoteles
      hotels: [],
      searchQuery: '',
      selectedHotel: null,
      loading: false,
      error: null,
      filters: {},
      bookings: [],

      // Acciones
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedHotel: (hotel) => set({ selectedHotel: hotel }),
      setHotels: (hotels) => set({ hotels }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        })),

      // Acciones de API
      fetchHotels: async (filters = {}) => {
        try {
          set({ loading: true, error: null });
          // Log de los filtros enviados
          console.log('Enviando filtros a /hoteles/buscar:', filters);
          // Construir query params solo con los filtros no vacíos
          const params = Object.fromEntries(
            Object.entries(filters).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
          );
          const { data } = await api.get('/hoteles/buscar', { params });
          set({ hotels: data, loading: false });
          return data;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      fetchHotelById: async (id) => {
        try {
          set({ loading: true, error: null });
          const data = await hotelService.getHotelById(id);
          set({ selectedHotel: data, loading: false });
          return data;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      fetchRooms: async (hotelId, filters = {}) => {
        try {
          set({ loading: true, error: null });
          const data = await roomService.getRooms(hotelId, filters);
          return data;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      createBooking: async (bookingData) => {
        try {
          set({ loading: true, error: null });
          const data = await bookingService.createBooking(bookingData);
          set((state) => ({
            bookings: [...state.bookings, data],
            loading: false
          }));
          return data;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      cancelBooking: async (bookingId) => {
        try {
          set({ loading: true, error: null });
          const data = await bookingService.cancelBooking(bookingId);
          set((state) => ({
            bookings: state.bookings.map((booking) =>
              booking.id === bookingId ? data : booking
            ),
            loading: false
          }));
          return data;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      fetchBookings: async (filters = {}) => {
        try {
          set({ loading: true, error: null });
          const data = await bookingService.getBookings(filters);
          set({ bookings: data.content, loading: false });
          return data;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      recoverPassword: async (email, newPassword) => {
        try {
          const response = await api.post('/auth/recover-password', {
            email,
            newPassword
          });
          return response.data;
        } catch (error) {
          throw new Error(error.response?.data?.message || 'Error al recuperar la contraseña');
        }
      }
    }),
    {
      name: 'hotel-store',
      partialize: (state) => ({
        user: state.user,
        language: state.language,
        currency: state.currency,
        bookings: state.bookings,
      }),
    }
  )
) 