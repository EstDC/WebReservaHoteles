import React, { useEffect } from 'react';
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
  const { hotels, loading, error, fetchHotels } = useHotelStore();

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        {t('hotels.error')}
      </div>
    );
  }

  if (!hotels.length) {
    return (
      <div className="text-center text-gray-600 p-4">
        {t('hotels.noHotels')}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">{t('hotels.title')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.map((hotel) => {
          const ciudad = getCityFromHotelName(hotel.nombre);
          const imgSrc = ciudad && hotelImages[ciudad] ? `/${hotelImages[ciudad]}` : '/images/img/hotel-placeholder.jpg';
          return (
            <div key={hotel.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-48">
                <img
                  src={imgSrc}
                  alt={hotel.nombre}
                  className="w-full h-full object-cover"
                />
                {hotel.calificacion && (
                  <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded">
                    {hotel.calificacion} ★
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">{hotel.nombre}</h3>
                <p className="text-gray-600 mt-1">{hotel.ubicacion}</p>
                {hotel.pais && (
                  <p className="text-gray-500 text-sm mt-1">{hotel.pais}</p>
                )}
                {hotel.estrellas && (
                  <p className="text-yellow-500 text-sm mt-2">
                    {Array.from({ length: hotel.estrellas }).map((_, i) => '★').join('')}
                  </p>
                )}
                <button
                  onClick={() => window.location.href = `/hotels/${hotel.id}`}
                  className="mt-4 w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90"
                >
                  {t('hotels.viewDetails')}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HotelList; 