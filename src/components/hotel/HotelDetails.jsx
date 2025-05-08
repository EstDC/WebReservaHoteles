import React, { useEffect, useState } from 'react';
import { useHotelStore } from '../../stores/hotelStore';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const HotelDetails = ({ hotelId }) => {
  const { t } = useTranslation();
  const {
    selectedHotel,
    loading,
    error,
    fetchHotelById
  } = useHotelStore();

  const [rooms, setRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [roomsError, setRoomsError] = useState(null);

  useEffect(() => {
    fetchHotelById(hotelId);
  }, [hotelId]);

  useEffect(() => {
    // Cargar habitaciones del hotel usando el endpoint público
    const fetchRooms = async () => {
      setRoomsLoading(true);
      setRoomsError(null);
      try {
        const response = await axios.get(`http://localhost:8081/api/habitaciones/hotel/${hotelId}`);
        setRooms(response.data);
      } catch (err) {
        setRoomsError('Error al cargar las habitaciones');
      } finally {
        setRoomsLoading(false);
      }
    };
    if (hotelId) {
      fetchRooms();
    }
  }, [hotelId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    );
  }

  if (!selectedHotel) {
    return null;
  }

  // Helper to render stars
  const renderStars = (stars) => {
    if (!stars) return null;
    return (
      <span className="text-yellow-500 text-lg">
        {Array.from({ length: stars }).map((_, i) => '★').join('')}
      </span>
    );
  };

  // Helper to render amenities/services
  const renderAmenities = (amenities) => {
    if (!amenities || !amenities.length) return null;
    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {amenities.map((amenity, idx) => (
          <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
            {typeof amenity === 'object' ? amenity.nombre : amenity}
          </span>
        ))}
      </div>
    );
  };

  // Prefer Spanish field names, fallback to English
  const direccion = selectedHotel.direccion || selectedHotel.address;
  const ubicacion = selectedHotel.ubicacion || selectedHotel.location;
  const ciudad = selectedHotel.ciudad || selectedHotel.city;
  const pais = selectedHotel.pais || selectedHotel.country;
  const estrellas = selectedHotel.estrellas || selectedHotel.stars;
  const servicios = selectedHotel.servicios || selectedHotel.amenities;
  const descripcion = selectedHotel.descripcion || selectedHotel.description;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Imagen principal del hotel */}
      <div className="relative h-[400px] mb-8">
        <img
          src={selectedHotel.image}
          alt={selectedHotel.name || selectedHotel.nombre}
          className="w-full h-full object-cover rounded-lg"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
          <h1 className="text-4xl font-bold text-white">{selectedHotel.name || selectedHotel.nombre}</h1>
          <p className="text-white/90 mt-2">{ubicacion}</p>
        </div>
      </div>

      {/* Detalles del hotel */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        {descripcion && <p className="mb-4 text-gray-700">{descripcion}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {direccion && (
            <div>
              <span className="font-semibold text-gray-800">Dirección: </span>
              <span className="text-gray-700">{direccion}</span>
            </div>
          )}
          {ubicacion && (
            <div>
              <span className="font-semibold text-gray-800">Localización: </span>
              <span className="text-gray-700">{ubicacion}</span>
            </div>
          )}
          {ciudad && (
            <div>
              <span className="font-semibold text-gray-800">Ciudad: </span>
              <span className="text-gray-700">{ciudad}</span>
            </div>
          )}
          {pais && (
            <div>
              <span className="font-semibold text-gray-800">País: </span>
              <span className="text-gray-700">{pais}</span>
            </div>
          )}
          {estrellas && (
            <div>
              <span className="font-semibold text-gray-800">Estrellas: </span>
              {renderStars(estrellas)}
            </div>
          )}
          {servicios && servicios.length > 0 && (
            <div className="md:col-span-2">
              <span className="font-semibold text-gray-800">Servicios: </span>
              {renderAmenities(servicios)}
            </div>
          )}
        </div>
      </div>

      {/* Habitaciones del hotel */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">{t('hotel.rooms')}</h2>
        {roomsLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : roomsError ? (
          <div className="text-red-500">{roomsError}</div>
        ) : (
          <div className="space-y-4">
            {rooms.map((room) => (
              <div key={room.id} className="border-b pb-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-lg">{room.tipo}</h3>
                    <p className="text-sm text-gray-600">{room.descripcion}</p>
                    <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-700">
                      <span><strong>Número:</strong> {room.numero}</span>
                      <span><strong>Capacidad:</strong> {room.capacidad}</span>
                      <span><strong>Precio/noche:</strong> {room.precioPorNoche} €</span>
                    </div>
                  </div>
                  <button
                    onClick={() => window.location.href = `/booking/new?roomId=${room.id}`}
                    className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors"
                  >
                    {t('common.bookNow')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelDetails; 