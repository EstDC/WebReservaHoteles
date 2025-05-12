import api from '../../../utils/api';

export default async function handler(req, res) {
    const { id } = req.query;
    const token = req.headers.authorization;

    console.group('API Route Handler - /api/users/[id]');
    console.log('Method:', req.method);
    console.log('User ID:', id);
    console.log('Token:', token ? 'Presente' : 'No presente');
    console.log('Headers:', req.headers);

    try {
        if (req.method === 'GET') {
            console.log('Realizando petición GET a /api/usuarios/' + id);
            const response = await api.get(`/usuarios/${id}`, {
                headers: {
                    Authorization: token
                }
            });
            
            console.log('Respuesta del servidor:', {
                status: response.status,
                data: response.data
            });

            // Transformar los datos al formato esperado por el frontend
            const userData = {
                id: response.data.id,
                name: response.data.nombre,
                surname: response.data.apellido,
                email: response.data.email,
                phone: response.data.telefono,
                role: response.data.rol,
                active: response.data.activo,
                registrationDate: response.data.fechaRegistro,
                lastModified: response.data.ultimaModificacion
            };

            res.status(200).json(userData);
        } else if (req.method === 'PUT') {
            console.log('Realizando petición PUT a /api/usuarios/' + id);
            
            // Transformar los datos al formato esperado por el backend
            const backendData = {};

            // Solo incluir los campos que vienen en la petición
            if (req.body.name) backendData.nombre = req.body.name;
            if (req.body.surname) backendData.apellido = req.body.surname;
            if (req.body.email) backendData.email = req.body.email;
            if (req.body.phone) backendData.telefono = req.body.phone;
            if (req.body.password) backendData.password = req.body.password;

            console.log('Datos a enviar al backend:', backendData);

            const response = await api.put(`/usuarios/${id}`, backendData, {
                headers: {
                    Authorization: token
                }
            });
            
            console.log('Respuesta del servidor:', {
                status: response.status,
                data: response.data
            });

            res.status(200).json(response.data);
        } else {
            res.setHeader('Allow', ['GET', 'PUT']);
            res.status(405).json({ error: `Método ${req.method} no permitido` });
        }
    } catch (error) {
        console.error('Error en el manejador de ruta:', error);
        console.log('Detalles del error:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });

        if (error.response?.status === 401) {
            res.status(401).json({ error: 'Token inválido o expirado' });
        } else if (error.response?.status === 404) {
            res.status(404).json({ error: 'Usuario no encontrado' });
        } else {
            res.status(error.response?.status || 500).json({
                error: error.response?.data?.error || 'Error interno del servidor'
            });
        }
    } finally {
        console.groupEnd();
    }
} 