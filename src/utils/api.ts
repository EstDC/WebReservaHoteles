import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor para añadir las credenciales del usuario a las peticiones
api.interceptors.request.use(config => {
    const userEmail = localStorage.getItem('userEmail');
    const userPassword = localStorage.getItem('userPassword');
    
    if (userEmail && userPassword) {
        config.headers['X-User-Email'] = userEmail;
        config.headers['X-User-Password'] = userPassword;
    }
    
    return config;
});

export default api; 