import React, { useEffect, useState } from 'react';
import { useHotelStore } from '../../stores/hotelStore';
import { useTranslation } from 'react-i18next';

// Mapeo de ciudad a imagen
const hotelImages = {
  'Azores': 'images/hotels/azores/6046012.jpg',
  'Burdeos': 'images/hotels/burdeos/hotel-le-palais-gallien.jpg',
  'Lisboa': 'images/hotels/lisboa/pestandfvda-palace-lisboa.jpg',
  'Londres': 'images/hotels/londres/Rosewood+London_Entrance_Wrought+Iron+Gates.jpg',
  'Menorca': 'images/hotels/menorca/94167_1720150068.jpg',
  'París': 'images/hotels/paris/entradaparis.jpg',
  'Praga': 'images/hotels/praga/mejoreshotelespraga.jpg',
  'Santander': 'images/hotels/santander/hoteles-con-encanto-cantabria-helguera-palacio-boutique.jpg',
  'Santorini': 'images/hotels/santorini/28.jpg',
  'Split': 'images/hotels/split/ca9da6e1.webp',
  'Venecia': 'images/hotels/venecia/img-boscolo-venezia-hotel-venice-41.JPEG'
};

// Extrae la ciudad del nombre del hotel
function getCityFromHotelName(nombre) {
  if (!nombre) return null;
  const match = nombre.match(/Hotel\s+([A-Za-zÁÉÍÓÚáéíóúñÑ]+)/);
  if (match && match[1]) {
    let ciudad = match[1];
    if (ciudad === 'London') ciudad = 'Londres';
    if (ciudad === 'Paris') ciudad = 'París';
    if (ciudad === 'Prague') ciudad = 'Praga';
    if (ciudad === 'Venice') ciudad = 'Venecia';
    return ciudad.charAt(0).toUpperCase() + ciudad.slice(1);
  }
  return null;
}

const HotelList = () => {
  const { t } = useTranslation();
  const { hotels, loading, error, fetchHotels, filters } = useHotelStore();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    const loadHotels = async () => {
      try {
        setIsInitialLoad(true);
        await fetchHotels(filters);
      } catch (err) {
        console.error('Error al cargar hoteles:', err);
      } finally {
        setIsInitialLoad(false);
      }
    };
    loadHotels();
  }, [fetchHotels, filters]);

  const handleImageError = (hotelId) => {
    setImageErrors(prev => ({ ...prev, [hotelId]: true }));
  };

  if (isInitialLoad) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <p className="font-semibold">{t('common.error')}</p>
        <p>{error}</p>
        <button 
          onClick={() => fetchHotels(filters)} 
          className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
        >
          {t('common.retry')}
        </button>
      </div>
    );
  }

  if (!hotels || !hotels.length) {
    return (
      <div className="text-center text-gray-600 p-4">
        <p className="font-semibold">{t('No hay hoteles disponibles')}</p>
        <button 
          onClick={() => fetchHotels(filters)} 
          className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
        >
          {t('Refrescar')}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 overflow-x-hidden">
      <div className="text-left mb-12">
            <h2 className="font-lorise-sans text-7xl text-gray-900 relative z-10">Hoteles</h2>
            <h2 className="font-alcantera-script text-8xl text-[#f4a574] -mt-8 relative z-20 transform translate-x-12">Disponibles</h2>
          </div>       
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto pb-8" style={{maxWidth: '1100px'}}>
          {hotels.map((hotel) => {
          const ciudad = getCityFromHotelName(hotel.nombre);
          const imgSrc = !imageErrors[hotel.id] && ciudad && hotelImages[ciudad] 
            ? `/${hotelImages[ciudad]}` 
            : '/images/img/hotel-placeholder.jpg';
          
          return (
            <div key={hotel.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative h-48">
                <img
                  src={imgSrc}
                  alt={hotel.nombre}
                  className="w-full h-full object-cover"
                  onError={() => handleImageError(hotel.id)}
                />
                {hotel.calificacion && (
                  <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded">
                    {hotel.calificacion} ★
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 font-helvetica">{hotel.nombre}</h3>
                <p className="text-gray-600 mt-1 font-helvetica">{hotel.ubicacion}</p>
                {hotel.pais && (
                  <p className="text-gray-500 text-sm mt-1 font-helvetica">{hotel.pais}</p>
                )}
                {hotel.estrellas && (
                  <div className="flex flex-row gap-1 mt-2">
                    {Array.from({ length: hotel.estrellas }).map((_, i) => (
                      <span key={i} className="text-yellow-500 text-sm">★</span>
                    ))}
                  </div>
                )}
                <a
                  href={`/hotels/${hotel.id}`}
                  className="mt-4 w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition-colors duration-300 block text-center font-helvetica"
                >
                  Ver detalles
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HotelList; 