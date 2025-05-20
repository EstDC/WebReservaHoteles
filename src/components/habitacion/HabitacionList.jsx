import React from 'react';
import { useHabitacionStore } from '../../stores/habitacionStore';

const carpetasPorId = {
  1: "azores",
  2: "burdeos",
  3: "lisboa",
  4: "londres",
  5: "menorca",
  6: "paris",
  7: "praga",
  8: "santander",
  9: "santorini",
  10: "split",
  11: "venecia"
};

function getMainImage(habitacion) {
  const hotelId = habitacion.hotel?.id;
  if (!hotelId) return '/images/hotels/default-room.jpg';
  const carpeta = carpetasPorId[hotelId];
  if (!carpeta) return '/images/hotels/default-room.jpg';
  const tipoKey = habitacion.tipo?.toLowerCase().replace(/\s/g, '');
  if (!tipoKey) return '/images/hotels/default-room.jpg';
  return `/images/hotels/${carpeta}/${tipoKey}-1.jpg`;
}

function renderStars(estrellas) {
  if (!estrellas || isNaN(estrellas)) return null;
  return (
    <div className="flex items-center mb-2">
      {Array.from({ length: estrellas }).map((_, i) => (
        <span key={i} className="text-yellow-400 text-lg">★</span>
      ))}
    </div>
  );
}

const HabitacionList = () => {
  const { habitaciones, loading, error } = useHabitacionStore();

  // Obtener fechas de la URL para mantener el contexto al navegar
  const searchParams = new URLSearchParams(window.location.search);
  const fechaInicio = searchParams.get('fechaInicio');
  const fechaFin = searchParams.get('fechaFin');
  const fechasQuery = fechaInicio && fechaFin ? `?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}` : '';

  if (loading) return <div>Cargando habitaciones...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!habitaciones || habitaciones.length === 0) return <div>No hay habitaciones disponibles para los filtros seleccionados.</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {habitaciones.map((habitacion) => {
        const imagePath = getMainImage(habitacion);
        const hotel = habitacion.hotel || {};
        return (
          <div key={habitacion.id} className="bg-white rounded-lg shadow-md flex flex-col overflow-hidden">
            <img
              src={imagePath}
              alt={habitacion.tipo}
              className="w-full h-48 object-cover rounded-t-lg"
              onError={e => { e.target.src = '/images/hotels/default-room.jpg'; }}
            />
            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-2xl font-bold mb-1 text-gray-900">{hotel.nombre || 'Hotel desconocido'}</h3>
              <div className="text-gray-600 mb-1">{hotel.ciudad}{hotel.ciudad && hotel.pais ? ', ' : ''}{hotel.pais}</div>
              {renderStars(hotel.estrellas)}
              <div className="text-base text-primary font-semibold mb-1">{habitacion.tipo}</div>
              <p className="text-gray-700 mb-2 flex-1">{habitacion.descripcion}</p>
              <div className="text-gray-600 mb-1">Capacidad: {habitacion.capacidad}</div>
              <div className="text-lg font-bold text-primary mb-2">{habitacion.precioPorNoche}€ / noche</div>
              <button
                className="mt-4 bg-primary text-white py-2 px-4 rounded hover:bg-primary/90 transition"
                onClick={() => window.location.href = `/hotels/${hotel.id}${fechasQuery}`}
              >
                Ver detalles
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HabitacionList; 