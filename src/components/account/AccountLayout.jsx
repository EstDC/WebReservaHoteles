import { useEffect, useState } from 'react';
import { useHotelStore } from '../../stores/hotelStore';
import { FaUser, FaHistory, FaCreditCard, FaCog, FaSignOutAlt } from 'react-icons/fa';
import BookingList from './BookingList';
import api from '../../utils/api';

const AccountLayout = () => {
  const { user, logout, initialize, updateUser, token } = useHotelStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    phone: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Efecto para limpiar errores al cambiar de pestaña
  useEffect(() => {
    if (activeTab !== 'bookings') {
      setError(null);
    }
    if (activeTab !== 'profile') {
      setProfileError(null);
      setProfileSuccess(false);
    }
  }, [activeTab]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Intentar inicializar el store si no está inicializado
        if (!user || !token) {
          await initialize();
        }
        
        if (!user || !token) {
          const event = new CustomEvent('navigate', {
            detail: { url: '/auth/login?redirect=/account' }
          });
          window.dispatchEvent(event);
          return;
        }

        // Obtener los datos completos del usuario desde la API
        const response = await api.get('/usuarios/perfil');
        const userData = response.data;
        
        setFormData({
          name: userData.nombre || '',
          surname: userData.apellido || '',
          email: userData.email || '',
          phone: userData.telefono || ''
        });

      } catch (error) {
        console.error('Error al inicializar:', error);
        if (error.response?.status === 401) {
          // Si no está autorizado, redirigir al login
          const event = new CustomEvent('navigate', {
            detail: { url: '/auth/login?redirect=/account' }
          });
          window.dispatchEvent(event);
          return;
        }
        setError('Error al cargar la página. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [user, token, initialize]);

  // Efecto para cargar las reservas cuando se selecciona la pestaña
  useEffect(() => {
    const loadBookings = async () => {
      if (activeTab === 'bookings' && user && token) {
        try {
          setLoadingBookings(true);
          setError(null);
          const response = await api.get(`/reservas/usuario/${user.id}`);
          setBookings(response.data || []); // Aseguramos que siempre sea un array
        } catch (error) {
          console.error('Error al cargar las reservas:', error);
          if (error.response?.status === 401) {
            // Si no está autorizado, redirigir al login
            const event = new CustomEvent('navigate', {
              detail: { url: '/auth/login?redirect=/account' }
            });
            window.dispatchEvent(event);
            return;
          }
          // Si es un 404, significa que no hay reservas, no es un error
          if (error.response?.status === 404) {
            setBookings([]);
            return;
          }
          setError('No se pudieron cargar las reservas. Por favor, intenta de nuevo más tarde.');
        } finally {
          setLoadingBookings(false);
        }
      }
    };

    loadBookings();
  }, [activeTab, user, token]);

  // Validar formato de teléfono
  const validatePhone = (phone) => {
    if (!phone) return true; // El teléfono es opcional
    // Validar que sea un número de teléfono válido (puedes ajustar el regex según tus necesidades)
    const phoneRegex = /^\+?[0-9]{9,15}$/;
    return phoneRegex.test(phone);
  };

  const handleLogout = async () => {
    // Mostrar confirmación antes de cerrar sesión
    if (!window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      return;
    }

    try {
      await logout();
      const event = new CustomEvent('navigate', {
        detail: { url: '/' }
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      setError('Error al cerrar sesión. Por favor, intenta de nuevo.');
    }
  };

  const handleCancelEdit = () => {
    // Restaurar los valores originales del formulario
    setFormData({
      name: user.name || '',
      surname: user.surname || '',
      email: user.email || '',
      phone: user.phone || ''
    });
    setProfileError(null);
    setProfileSuccess(false);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUpdatingProfile(true);
    setProfileError(null);
    setProfileSuccess(false);

    // Guardar los valores actuales antes de intentar la actualización
    const originalFormData = { ...formData };

    const formDataToUpdate = new FormData(e.target);

    // Validar teléfono
    if (!validatePhone(formDataToUpdate.get('phone'))) {
      setProfileError('El formato del teléfono no es válido. Debe ser un número de 9 a 15 dígitos, opcionalmente precedido por +');
      setUpdatingProfile(false);
      return;
    }

    try {
      const response = await api.put(`/usuarios/${user.id}`, {
        nombre: formDataToUpdate.get('name'),
        apellido: formDataToUpdate.get('surname'),
        email: formDataToUpdate.get('email'),
        telefono: formDataToUpdate.get('phone')
      });

      const updatedUser = response.data;
      
      // Actualizar el store con los nuevos datos
      updateUser({
        ...user,
        name: updatedUser.nombre,
        surname: updatedUser.apellido,
        phone: updatedUser.telefono
      });

      setFormData({
        name: updatedUser.nombre,
        surname: updatedUser.apellido,
        email: updatedUser.email,
        phone: updatedUser.telefono
      });

      setProfileSuccess(true);
      
      // Ocultar el mensaje de éxito después de 3 segundos
      setTimeout(() => {
        setProfileSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      setProfileError(error.response?.data?.error || 'Error al actualizar el perfil. Por favor, intenta de nuevo.');
      // Restaurar los valores originales en caso de error
      setFormData(originalFormData);
    } finally {
      setUpdatingProfile(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error && activeTab !== 'bookings') {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 text-red-600 hover:text-red-700 underline"
        >
          Intentar de nuevo
        </button>
      </div>
    );
  }

  if (!user) return null;

  const tabs = [
    { id: 'profile', label: 'Mi Perfil', icon: <FaUser /> },
    { id: 'bookings', label: 'Mis Reservas', icon: <FaHistory /> },
    { id: 'payment', label: 'Métodos de Pago', icon: <FaCreditCard /> },
    { id: 'settings', label: 'Configuración', icon: <FaCog /> },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-[80vh] md:min-h-[600px] bg-white w-full" style={{marginTop: '48px'}}>
      {/* Sidebar/Topbar Responsive */}
      <div className="flex md:hidden w-full bg-gray-50 px-2 py-3 border-b justify-center">
        <nav className="w-full">
          <ul className="flex flex-row justify-around items-center w-full">
            {tabs.map((tab) => (
              <li key={tab.id} className="flex-1">
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-colors text-xs
                    ${activeTab === tab.id ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="hidden md:flex w-64 bg-gray-50 border-r min-h-[80vh] md:min-h-[600px]">
        <div className="flex flex-col p-8 justify-start items-start w-full mt-16">
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <FaUser className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{formData.name || 'Usuario'}</h2>
              <p className="text-sm text-gray-600">{formData.email}</p>
            </div>
          </div>
        </div>

        <nav>
          <ul className="space-y-1">
            {tabs.map((tab) => (
              <li key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              >
                <FaSignOutAlt />
                <span>Cerrar Sesión</span>
              </button>
            </li>
          </ul>
        </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 flex flex-col justify-start min-h-[80vh] md:min-h-[600px] mt-16">
        {activeTab === 'profile' && (
          <div>
            <h3 className="text-2xl font-semibold mb-6">Mi Perfil</h3>
            {profileSuccess && (
              <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg">
                Perfil actualizado correctamente
              </div>
            )}
            {profileError && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
                {profileError}
              </div>
            )}
            <form className="space-y-6" onSubmit={handleProfileUpdate}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apellidos
                  </label>
                  <input
                    type="text"
                    name="surname"
                    required
                    value={formData.surname}
                    onChange={(e) => setFormData(prev => ({ ...prev, surname: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+34 123 456 789"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Formato: +34 123 456 789 (opcional)
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={updatingProfile}
                  className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updatingProfile ? (
                    <span className="flex items-center">
                      <div className="w-4 h-4 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                      Actualizando...
                    </span>
                  ) : (
                    'Guardar Cambios'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div>
            <h3 className="text-2xl font-semibold mb-6">Mis Reservas</h3>
            {loadingBookings ? (
              <div className="flex items-center justify-center min-h-[200px]">
                <div className="w-8 h-8 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-red-600">{error}</p>
                <button 
                  onClick={() => setActiveTab('bookings')} 
                  className="mt-4 text-red-600 hover:text-red-700 underline"
                >
                  Intentar de nuevo
                </button>
              </div>
            ) : bookings.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-8 text-center mt-8">
                <FaHistory className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No tienes reservas en tu historial</p>
                <button 
                  onClick={() => { window.location.href = '/hotels'; }}
                  className="mt-4 text-primary hover:text-primary/90 underline"
                >
                  Explorar hoteles
                </button>
              </div>
            ) : (
              <BookingList bookings={bookings} />
            )}
          </div>
        )}

        {activeTab === 'payment' && (
          <div>
            <h3 className="text-2xl font-semibold mb-6">Métodos de Pago</h3>
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <FaCreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No tienes métodos de pago guardados</p>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h3 className="text-2xl font-semibold mb-6">Configuración</h3>
            <form className="space-y-6" onSubmit={async (e) => {
              e.preventDefault();
              setPasswordError('');
              setPasswordSuccess(false);
              const newPassword = e.target.newPassword.value;
              const confirmPassword = e.target.confirmPassword.value;
              if (!newPassword || !confirmPassword) {
                setPasswordError('Por favor, completa ambos campos de contraseña.');
                return;
              }
              if (newPassword !== confirmPassword) {
                setPasswordError('Las contraseñas no coinciden.');
                return;
              }
              if (newPassword.length < 6) {
                setPasswordError('La nueva contraseña debe tener al menos 6 caracteres.');
                return;
              }
              try {
                // Primero obtenemos el usuario actual para asegurarnos de tener todos los datos
                const currentUserResponse = await api.get(`/usuarios/${user.id}`);
                const currentUser = currentUserResponse.data;
                
                const userData = {
                  ...currentUser,  // Mantenemos todos los datos actuales
                  nombre: user.name,
                  apellido: user.surname,
                  email: user.email,
                  telefono: user.phone,
                  rol: user.role || 'CLIENTE',
                  password: newPassword,  // Nueva contraseña
                  activo: true
                };
                
                console.log('Usuario actual:', currentUser);
                console.log('Enviando datos de actualización:', userData);
                const response = await api.put(`/usuarios/${user.id}`, userData);
                console.log('Respuesta del servidor:', response.data);
                
                // Actualizar el store con los nuevos datos
                updateUser({
                  ...user,
                  password: newPassword
                });
                
                setPasswordSuccess(true);
                e.target.newPassword.value = '';
                e.target.confirmPassword.value = '';
              } catch (error) {
                console.error('Error completo:', error);
                console.error('Detalles del error:', error.response?.data);
                setPasswordError(error.response?.data?.message || error.response?.data?.error || 'Error al cambiar la contraseña');
              }
            }}>
              <div>
                <h4 className="text-lg font-medium mb-4">Cambiar Contraseña</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nueva Contraseña
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmar Nueva Contraseña
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
              {typeof passwordError !== 'undefined' && passwordError && (
                <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">{passwordError}</div>
              )}
              {typeof passwordSuccess !== 'undefined' && passwordSuccess && (
                <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg">Contraseña cambiada correctamente</div>
              )}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Actualizar Contraseña
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountLayout; 