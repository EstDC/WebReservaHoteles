import axios from 'axios';

// Usamos el proxy de Vite en lugar de la URL completa
const API_URL = '/api';
console.log('API: URL base configurada como:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor para añadir el token de autenticación
api.interceptors.request.use(
  (config) => {
    console.group('API Request Interceptor');
    console.log('URL:', config.url);
    console.log('Method:', config.method);
    console.log('Base URL:', config.baseURL);
    console.log('Full URL:', `${config.baseURL}${config.url}`);
    console.log('Data:', config.data);
    console.log('Original Headers:', config.headers);
    
    const token = localStorage.getItem('token');
    console.log('Token en localStorage:', token ? 'Presente' : 'No presente');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Headers después de añadir token:', config.headers);
    } else {
      console.log('No se añadió token a los headers');
    }
    
    console.groupEnd();
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor para manejar errores
api.interceptors.response.use(
  (response) => {
    console.group('API Response Interceptor');
    console.log('URL:', response.config.url);
    console.log('Status:', response.status);
    console.log('Data:', response.data);
    console.log('Headers:', response.headers);
    console.groupEnd();
    return response;
  },
  (error) => {
    console.group('API Error Interceptor');
    console.log('URL:', error.config?.url);
    console.log('Status:', error.response?.status);
    console.log('Status Text:', error.response?.statusText);
    console.log('Headers:', error.response?.headers);
    console.log('Data:', error.response?.data);
    console.log('Message:', error.message);
    console.log('Config:', {
      baseURL: error.config?.baseURL,
      headers: error.config?.headers,
      method: error.config?.method
    });
    console.groupEnd();

    if (error.response?.status === 401) {
      console.log('Error 401 - Token inválido o expirado');
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      window.location.href = '/auth/login';
    } else if (error.code === 'ERR_NETWORK') {
      console.log('Error de red - Verificar conexión con el servidor');
    } else if (error.response?.status === 403) {
      console.log('Error 403 - Acceso denegado');
      // Manejar error de acceso denegado
    } else if (error.response?.status === 404) {
      console.log('Error 404 - Recurso no encontrado');
      // Manejar error de recurso no encontrado
    } else if (error.response?.status >= 500) {
      console.log('Error del servidor - Contactar con soporte');
      // Manejar error del servidor
    }

    return Promise.reject(error);
  }
);

export default api; 