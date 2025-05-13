import axios from 'axios';

// Usamos el proxy de Vite en lugar de la URL completa
const API_URL = '/api';
console.log('API: URL base configurada como:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000 // 10 segundos de timeout
});

// Función para obtener el token
const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

// Función para configurar el token en los headers
const setAuthHeader = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Configurar el token inicial si existe
const initialToken = getToken();
if (initialToken) {
  setAuthHeader(initialToken);
}

// Interceptor de peticiones
api.interceptors.request.use(
  (config) => {
    console.log('API Request Interceptor');
    console.log('URL:', config.url);
    console.log('Method:', config.method);
    console.log('Base URL:', config.baseURL);
    console.log('Full URL:', config.baseURL + config.url);
    console.log('Data:', config.data);
    console.log('Original Headers:', config.headers);

    // Obtener el token del localStorage
    const token = getToken();
    console.log('Token en localStorage:', token ? 'Presente' : 'No presente');

    // Si hay token, añadirlo a los headers
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('Token añadido a los headers:', config.headers['Authorization']);
    } else {
      console.log('No se añadió token a los headers');
    }

    return config;
  },
  (error) => {
    console.error('Error en interceptor de peticiones:', error);
    return Promise.reject(error);
  }
);

// Interceptor de respuestas
api.interceptors.response.use(
  (response) => {
    console.log('API Response Interceptor');
    console.log('URL:', response.config.url);
    console.log('Status:', response.status);
    console.log('Data:', response.data);
    console.log('Headers:', response.headers);

    // Si hay un token en los headers de la respuesta, guardarlo
    const token = response.headers['authorization'];
    if (token) {
      localStorage.setItem('token', token);
      setAuthHeader(token);
      console.log('Token guardado desde headers de respuesta');
    }

    return response;
  },
  (error) => {
    console.log('API Error Interceptor');
    console.log('URL:', error.config?.url);
    console.log('Status:', error.response?.status);
    console.log('Status Text:', error.response?.statusText);
    console.log('Headers:', error.response?.headers);
    console.log('Data:', error.response?.data);
    console.log('Message:', error.message);
    console.log('Config:', error.config);

    // Si el error es 401, limpiar el token
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      setAuthHeader(null);
      console.log('Token eliminado por error 401');
      
      // Si estamos en el cliente y no estamos en la página de login, redirigir
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth/login')) {
        const event = new CustomEvent('navigate', {
          detail: { url: '/auth/login?redirect=' + window.location.pathname }
        });
        window.dispatchEvent(event);
      }
    }

    return Promise.reject(error);
  }
);

export default api; 