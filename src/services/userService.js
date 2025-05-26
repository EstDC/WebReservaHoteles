import { API_URL } from '../config';

const userService = {
  async getAllUsers() {
    try {
      const response = await fetch(`${API_URL}/usuarios`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener usuarios');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en getAllUsers:', error);
      throw error;
    }
  },

  async updateUserRole(userId, newRole) {
    try {
      const response = await fetch(`${API_URL}/usuarios/${userId}/rol`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ rol: newRole })
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el rol del usuario');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en updateUserRole:', error);
      throw error;
    }
  },

  async updateUserStatus(userId, newStatus) {
    try {
      const response = await fetch(`${API_URL}/usuarios/${userId}/estado`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ activo: newStatus })
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el estado del usuario');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en updateUserStatus:', error);
      throw error;
    }
  },

  async getUserById(userId) {
    try {
      const response = await fetch(`${API_URL}/usuarios/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener el usuario');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en getUserById:', error);
      throw error;
    }
  }
};

export { userService }; 