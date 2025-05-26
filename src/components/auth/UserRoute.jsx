import { useEffect } from 'react';
import { useHotelStore } from '../../stores/hotelStore';

const UserRoute = ({ children }) => {
  const { user, isInitialized, initialize } = useHotelStore();

  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [isInitialized, initialize]);

  if (!isInitialized) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    window.location.href = '/auth/login?redirect=/account';
    return null;
  }

  // Si el usuario es administrador, redirigir al panel de administración
  if (user.role === 'ADMIN') {
    window.location.href = '/admin';
    return null;
  }

  return children;
};

export default UserRoute; 