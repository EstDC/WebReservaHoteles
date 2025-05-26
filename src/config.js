// URL base de la API
export const API_URL = 'http://localhost:8080';

// Configuración de la aplicación
export const APP_CONFIG = {
  // Tiempo máximo de sesión en minutos
  SESSION_TIMEOUT: 30,
  
  // Número de elementos por página en las tablas
  ITEMS_PER_PAGE: 10,
  
  // Formato de fecha por defecto
  DATE_FORMAT: 'DD/MM/YYYY',
  
  // Roles de usuario
  ROLES: {
    ADMIN: 'ADMIN',
    USER: 'USER'
  },
  
  // Estados de reserva
  BOOKING_STATUS: {
    PENDING: 'PENDING',
    CONFIRMED: 'CONFIRMED',
    CANCELLED: 'CANCELLED'
  }
}; 