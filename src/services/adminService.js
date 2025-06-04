import api from '../utils/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json'
  };
};

const getPublicHeaders = () => {
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
};

const handleResponse = async (response) => {
  if (response.status === 401) {
    // Si el token no es válido, redirigir al login
    localStorage.removeItem('token');
    window.location.href = '/login';
    throw new Error('Sesión expirada');
  }
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

const adminService = {
  // Gestión de Hoteles
  async getAllHotels() {
    try {
      const { data } = await api.get('/hoteles');
      return data;
    } catch (error) {
      console.error('Error en getAllHotels:', error);
      throw error;
    }
  },

  async updateHotelStatus(hotelId, hotelData) {
    try {
      const { data } = await api.put(`/hoteles/${hotelId}`, hotelData);
      return data;
    } catch (error) {
      console.error('Error en updateHotelStatus:', error);
      throw error;
    }
  },

  // Gestión de Habitaciones
  async getRoomsByHotel(hotelId, filters = {}) {
    try {
      const { data } = await api.get('/habitaciones/habitaciones/disponibles-global', {
        params: { hotelId, ...filters }
      });
      return data;
    } catch (error) {
      console.error('Error en getRoomsByHotel:', error);
      throw error;
    }
  },

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
  },

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

  async createRoom(roomData) {
    try {
      const { data } = await api.post('/habitaciones', roomData);
      return data;
    } catch (error) {
      console.error('Error en createRoom:', error);
      throw error;
    }
  },

  async updateRoom(roomId, roomData) {
    try {
      const { data } = await api.put(`/habitaciones/${roomId}`, roomData);
      return data;
    } catch (error) {
      console.error('Error en updateRoom:', error);
      throw error;
    }
  },

  async deleteRoom(roomId) {
    try {
      const { data } = await api.delete(`/habitaciones/${roomId}`);
      return data;
    } catch (error) {
      console.error('Error en deleteRoom:', error);
      throw error;
    }
  },

  // Gestión de Usuarios
  async getUsersByRole(role) {
    try {
      const { data } = await api.get(`/usuarios/rol/${role}`);
      return data;
    } catch (error) {
      console.error('Error en getUsersByRole:', error);
      throw error;
    }
  },

  async updateUserStatus(userId, userData) {
    try {
      const { data } = await api.put(`/usuarios/${userId}`, userData);
      return data;
    } catch (error) {
      console.error('Error en updateUserStatus:', error);
      throw error;
    }
  },

  // Gestión de Reservas
  async getAllBookings(filters = {}) {
    try {
      const { data } = await api.get('/reservas', { params: filters });
      return data;
    } catch (error) {
      console.error('Error en getAllBookings:', error);
      throw error;
    }
  },

  async getBookingById(bookingId) {
    try {
      const { data } = await api.get(`/reservas/${bookingId}`);
      return data;
    } catch (error) {
      console.error('Error en getBookingById:', error);
      throw error;
    }
  },

  async updateBookingStatus(bookingId, status) {
    try {
      const { data } = await api.put(`/reservas/${bookingId}/estado`, { estado: status });
      return data;
    } catch (error) {
      console.error('Error en updateBookingStatus:', error);
      throw error;
    }
  },

  async archiveBooking(bookingId) {
    try {
      const { data } = await api.put(`/reservas/${bookingId}/archivar`);
      return data;
    } catch (error) {
      console.error('Error en archiveBooking:', error);
      throw error;
    }
  },

  async getBookingHistory(filters = {}) {
    try {
      const { data } = await api.get('/historial/reservas', { params: filters });
      return data;
    } catch (error) {
      console.error('Error en getBookingHistory:', error);
      throw error;
    }
  }
};

export { adminService }; 