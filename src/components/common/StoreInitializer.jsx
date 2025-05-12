import { useEffect, useState } from 'react';
import { useHotelStore } from '../../stores/hotelStore';

const StoreInitializer = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);
  const initialize = useHotelStore(state => state.initialize);

  useEffect(() => {
    const initStore = async () => {
      try {
        await initialize();
        setIsInitialized(true);
      } catch (error) {
        console.error('Error al inicializar el store:', error);
        setError(error);
      }
    };

    if (!isInitialized) {
      initStore();
    }
  }, [initialize, isInitialized]);

  if (error) {
    console.error('Error en StoreInitializer:', error);
    return null;
  }

  return null;
};

export default StoreInitializer; 