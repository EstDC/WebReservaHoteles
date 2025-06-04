import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      // Cambia 'PUBLICO' por 'CLIENTE' si ese es el rol correcto en tu backend
      const data = await adminService.getUsersByRole('CLIENTE');
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      setLoading(true);
      const user = users.find(u => u.id === userId);
      if (!user) throw new Error('Usuario no encontrado');

      // Asegura todos los campos requeridos
      const updatedUser = {
        id: user.id,
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        email: user.email || '',
        password: user.password || '', // Si no tienes el password real, pon una cadena vacía o la que acepte el backend
        telefono: user.telefono || '',
        rol: user.rol || 'PUBLICO', // O 'CLIENTE' si corresponde
        activo: newStatus,
        fechaRegistro: user.fechaRegistro || new Date().toISOString(),
        ultimaModificacion: new Date().toISOString(),
        tokenRecuperacion: user.tokenRecuperacion || '',
        tokenExpiracion: user.tokenExpiracion || new Date().toISOString()
      };

      console.log('Enviando usuario actualizado:', updatedUser);

      await adminService.updateUserStatus(userId, updatedUser);
      await loadUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Usuarios</h2>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apellido</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acción</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{user.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.nombre}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.apellido}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${user.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {user.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {!user.activo && (
                        <button
                          onClick={() => handleStatusChange(user.id, true)}
                          className="px-3 py-1 rounded-md text-sm font-medium bg-green-100 text-green-800 hover:bg-green-200"
                        >
                          Reactivar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement; 