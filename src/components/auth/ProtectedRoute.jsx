import { useEffect } from 'react';
import { useHotelStore } from '../../stores/hotelStore';

const ProtectedRoute = ({ children }) => {
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
    window.location.href = `/auth/login?redirect=${window.location.pathname}`;
    return null;
  }

  return children;
};

export default ProtectedRoute; 