import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../utils/api'

// Función para guardar logs
const saveLog = (message, data = null) => {
  if (typeof window === 'undefined') return;
  
  const logs = JSON.parse(localStorage.getItem('loginLogs') || '[]');
  logs.push({
    message,
    data,
    timestamp: new Date().toISOString()
  });
  localStorage.setItem('loginLogs', JSON.stringify(logs));
};

const useHotelStore = create(
  persist(
    (set, get) => ({
      // Estado inicial
      user: null,
      token: null,
      isInitialized: false,
      hotels: [],
      selectedHotel: null,
      loading: false,
      error: null,

      // Estado de reserva
      currentReservaId: null,

      // Autenticación
      login: async (credentials) => {
        try {
          saveLog('Iniciando proceso de login');
          saveLog('Enviando credenciales', credentials);
          
          const response = await api.post('/usuarios/login', credentials);
          saveLog('Respuesta del servidor', response.data);
          
          const { token, usuario } = response.data;

          if (!usuario || !token) {
            throw new Error('Respuesta inválida del servidor');
          }

          saveLog('Token recibido', token);
          saveLog('Usuario recibido', usuario);

          // Guardar token y configurar headers
          if (typeof window !== 'undefined') {
            localStorage.setItem('token', token);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            saveLog('Token guardado en localStorage y configurado en headers');
          }
          
          // Actualizar estado directamente sin intentar restaurar la sesión
          set({ 
            user: usuario, 
            token, 
            isInitialized: true,
            error: null 
          });
          
          saveLog('Login exitoso');
          return usuario;
        } catch (error) {
          console.error('Error en login:', error);
          saveLog('Error en login', error.message);
          set({ error: error.message });
          throw error;
        }
      },

      register: async (userData) => {
        try {
          saveLog('Iniciando proceso de registro');
          saveLog('Enviando datos de registro', userData);
          
          const response = await api.post('/usuarios/registro', {
            nombre: userData.name,
            apellido: userData.surname || '',
            email: userData.email,
            password: userData.password,
            telefono: userData.phone,
            rol: 'CLIENTE'
          });
          
          saveLog('Registro exitoso', response.data);
          return response.data;
        } catch (error) {
          console.error('Error en registro:', error);
          saveLog('Error en registro', error.message);
          set({ error: error.message });
          throw error;
        }
      },

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          delete api.defaults.headers.common['Authorization'];
          saveLog('Logout: Token eliminado de localStorage y headers');
        }
        set({ 
          user: null, 
          token: null, 
          isInitialized: true,
          error: null,
          currentReservaId: null  // Limpiar también la reserva al logout
        });
      },

      // Inicialización
      initialize: async () => {
        if (typeof window === 'undefined') return;
        
        const token = localStorage.getItem('token');
        saveLog('Inicializando store, token en localStorage:', token ? 'Presente' : 'No presente');
        
        if (token) {
          try {
            // Configurar el token en los headers de axios
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            saveLog('Token configurado en headers para petición de perfil');
            
            // Obtener el ID del usuario del token
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            const userId = decodedToken.id;
            
            // Obtener los datos completos del usuario usando el ID
            const response = await api.get(`/usuarios/${userId}`);
            saveLog('Respuesta de perfil recibida', response.data);
            
            // Actualizar el estado con el token y los datos del usuario
            set({ 
                user: {
                    id: response.data.id,
                    name: response.data.nombre,
                    surname: response.data.apellido,
                    email: response.data.email,
                    phone: response.data.telefono,
                    role: response.data.rol,
                    active: response.data.activo,
                    registrationDate: response.data.fechaRegistro,
                    lastModified: response.data.ultimaModificacion
                }, 
                token, 
                isInitialized: true,
                error: null 
            });
            saveLog('Store inicializado con datos de usuario');
          } catch (error) {
            console.error('Error al restaurar sesión:', error);
            saveLog('Error al restaurar sesión', error.message);
            
            // Si hay un error 401, limpiar el token
            if (error.response?.status === 401) {
              localStorage.removeItem('token');
              delete api.defaults.headers.common['Authorization'];
              set({ 
                user: null, 
                token: null, 
                isInitialized: true,
                error: null 
              });
              saveLog('Token inválido eliminado');
            } else {
              // Para otros errores, mantener el token pero marcar como inicializado
              set({ 
                isInitialized: true,
                error: error.message 
              });
              saveLog('Store inicializado con error', error.message);
            }
          }
        } else {
          set({ 
            user: null, 
            token: null, 
            isInitialized: true,
            error: null 
          });
          saveLog('Store inicializado sin token');
        }
      },

      // Gestión de hoteles
      filters: {},
      setFilters: (filters) => set({ filters }),
      fetchHotels: async (filters = null) => {
        set({ loading: true, error: null });
        try {
          // Convertir los filtros a los nombres que espera el backend
          const params = {};
          if (filters) {
            if (filters.nombre) params.nombre = filters.nombre;
            if (filters.ciudad) params.ciudad = filters.ciudad;
            if (filters.estrellas) params.estrellas = filters.estrellas;
          }
          console.log('Enviando filtros al backend:', params);
          const { data } = await api.get('/hoteles/buscar', { params });
          set({ 
            hotels: Array.isArray(data) ? data : data.content || [], 
            loading: false,
            error: null 
          });
          return data;
        } catch (error) {
          console.error('Error al obtener hoteles:', error);
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      fetchHotelById: async (id) => {
        try {
          set({ loading: true, error: null });
          const { data } = await api.get(`/hoteles/${id}`);
          set({ 
            selectedHotel: data, 
            loading: false,
            error: null 
          });
          return data;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      setSelectedHotel: (hotel) => set({ selectedHotel: hotel }),

      // Gestión de reservas
      setCurrentReservaId: (reservaId) => {
        console.log('Store: setCurrentReservaId llamado con:', reservaId);
        set({ currentReservaId: reservaId });
        console.log('Store: ID guardado, estado actual:', get().currentReservaId);
      },
      getCurrentReservaId: () => get().currentReservaId,
      clearCurrentReservaId: () => set({ currentReservaId: null }),

      // Configuración de la aplicación
      language: 'es',
      currency: 'EUR',
      setLanguage: (lang) => set({ language: lang }),
      setCurrency: (curr) => set({ currency: curr }),

      // Actualización de usuario
      updateUser: (userData) => {
        set((state) => ({
          user: {
            ...state.user,
            ...userData
          }
        }));
      },

      // Utilidades
      showLoginLogs: () => {
        if (typeof window === 'undefined') return;
        const logs = JSON.parse(localStorage.getItem('loginLogs') || '[]');
        console.group('Login Logs');
        logs.forEach(log => {
          console.log(`[${log.timestamp}] ${log.message}:`, log.data);
        });
        console.groupEnd();
      }
    }),
    {
      name: 'hotel-store',
      getStorage: () => localStorage,
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        language: state.language,
        currency: state.currency,
        hotels: state.hotels,
        selectedHotel: state.selectedHotel,
        currentReservaId: state.currentReservaId
      })
    }
  )
);

export { useHotelStore };