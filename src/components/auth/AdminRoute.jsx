import { useEffect } from 'react';
import { useHotelStore } from '../../stores/hotelStore';

const AdminRoute = ({ children }) => {
  const { user, isInitialized, initialize } = useHotelStore();

  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [isInitialized, initialize]);

  if (!isInitialized) {
    return <div>Cargando...</div>;
  }

  if (!user || user.role !== 'ADMIN') {
    window.location.href = '/auth/login?redirect=/admin';
    return null;
  }

  return children;
};

export default AdminRoute; 