import api from '../utils/api';

export const roomService = {
  // Obtener todas las habitaciones de todos los hoteles
  async getRooms() {
    try {
      // Primero obtenemos todos los hoteles
      const { data: hoteles } = await api.get('/hoteles');
      
      // Luego obtenemos las habitaciones de cada hotel
      const habitacionesPromises = hoteles.map(hotel => 
        api.get(`/habitaciones/hotel/${hotel.id}`)
          .then(response => response.data)
          .catch(error => {
            console.error(`Error obteniendo habitaciones del hotel ${hotel.id}:`, error);
            return []; // Si hay error, devolvemos array vacío para ese hotel
          })
      );

      // Esperamos todas las peticiones
      const habitacionesPorHotel = await Promise.all(habitacionesPromises);
      
      // Aplanamos el array y añadimos la información del hotel a cada habitación
      const todasLasHabitaciones = habitacionesPorHotel.flatMap((habitaciones, index) => 
        habitaciones.map(habitacion => ({
          ...habitacion,
          hotel: hoteles[index]
        }))
      );

      // Obtenemos las fechas ocupadas para cada habitación
      const habitacionesConFechas = await Promise.all(
        todasLasHabitaciones.map(async (habitacion) => {
          try {
            const { data: fechasOcupadas } = await api.get(`/reservas/habitacion/${habitacion.id}/fechas-ocupadas`);
            return {
              ...habitacion,
              fechasOcupadas,
              // Una habitación está disponible si no tiene fechas ocupadas
              disponible: fechasOcupadas.length === 0
            };
          } catch (error) {
            console.error(`Error obteniendo fechas ocupadas para habitación ${habitacion.id}:`, error);
            return {
              ...habitacion,
              fechasOcupadas: [],
              disponible: true // Por defecto asumimos que está disponible si hay error
            };
          }
        })
      );

      return habitacionesConFechas;
    } catch (error) {
      console.error('Error en getRooms:', error);
      throw error;
    }
  },

  // Obtener habitaciones de un hotel específico
  async getRoomsByHotel(hotelId) {
    try {
      const { data } = await api.get(`/habitaciones/hotel/${hotelId}`);
      return data;
    } catch (error) {
      console.error('Error en getRoomsByHotel:', error);
      throw error;
    }
  },

  // Obtener una habitación por ID
  async getRoomById(id) {
    try {
      const { data } = await api.get(`/habitaciones/${id}`);
      return data;
    } catch (error) {
      console.error('Error en getRoomById:', error);
      throw error;
    }
  },

  // Crear una nueva habitación (solo admin)
  async createRoom(roomData) {
    try {
      const { data } = await api.post('/habitaciones', roomData);
      return data;
    } catch (error) {
      console.error('Error en createRoom:', error);
      throw error;
    }
  },

  // Actualizar una habitación (solo admin)
  async updateRoom(id, roomData) {
    try {
      const { data } = await api.put(`/habitaciones/${id}`, roomData);
      return data;
    } catch (error) {
      console.error('Error en updateRoom:', error);
      throw error;
    }
  },

  // Eliminar una habitación (solo admin)
  async deleteRoom(id) {
    try {
      const { data } = await api.delete(`/habitaciones/${id}`);
      return data;
    } catch (error) {
      console.error('Error en deleteRoom:', error);
      throw error;
    }
  },

  // Obtener historial de una habitación
  async getRoomHistory(id, page = 0, size = 10) {
    try {
      const { data } = await api.get(`/historial/habitaciones/${id}`, {
        params: { page, size }
      });
      return data;
    } catch (error) {
      console.error('Error en getRoomHistory:', error);
      throw error;
    }
  },

  // Obtener habitaciones disponibles por fechas
  async getAvailableRooms(hotelId, fechaInicio, fechaFin) {
    try {
      const { data } = await api.get('/habitaciones/disponibles', {
        params: { hotelId, fechaInicio, fechaFin }
      });
      return data;
    } catch (error) {
      console.error('Error en getAvailableRooms:', error);
      throw error;
    }
  },

  // Obtener habitaciones por tipo
  async getRoomsByType(hotelId, tipo) {
    try {
      const { data } = await api.get('/habitaciones/tipo', {
        params: { hotelId, tipo }
      });
      return data;
    } catch (error) {
      console.error('Error en getRoomsByType:', error);
      throw error;
    }
  },

  // Obtener habitaciones por rango de precio
  async getRoomsByPrice(hotelId, precioMinimo, precioMaximo) {
    try {
      const { data } = await api.get('/habitaciones/precio', {
        params: { hotelId, precioMinimo, precioMaximo }
      });
      return data;
    } catch (error) {
      console.error('Error en getRoomsByPrice:', error);
      throw error;
    }
  }
}; 