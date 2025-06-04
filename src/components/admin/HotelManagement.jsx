import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { adminService } from '../../services/adminService';
import { hotelService } from '../../services/hotelService';

const HotelManagement = () => {
  const { t } = useTranslation();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalHotels: 0,
    activeHotels: 0,
    totalRooms: 0,
    averageRating: 0
  });

  useEffect(() => {
    const loadHotels = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await hotelService.getAllHotelsAdmin();
        setHotels(data || []);

        if (data && data.length > 0) {
          const stats = {
            totalHotels: data.length,
            activeHotels: data.filter(hotel => hotel.activo).length,
            totalRooms: data.reduce((sum, hotel) => sum + (hotel.habitaciones?.length || 0), 0),
            averageRating: data.reduce((sum, hotel) => sum + (hotel.estrellas || 0), 0) / data.length
          };
          setStats(stats);
        }
      } catch (err) {
        console.error('Error loading hotels:', err);
        setError(err.message || 'Error al cargar los hoteles');
        setHotels([]);
      } finally {
        setLoading(false);
      }
    };

    loadHotels();
  }, []);

  const handleStatusChange = async (hotelId, newStatus) => {
    try {
      setLoading(true);
      setError(null);
      // Obtener el hotel completo
      const hotel = hotels.find(h => h.id === hotelId);
      if (!hotel) throw new Error('Hotel no encontrado');
      // Crear el objeto actualizado con todos los campos requeridos
      console.log('Hotel original:', hotel);
      console.log('Habitaciones originales:', hotel.habitaciones);
      
      const habitacionesActualizadas = Array.isArray(hotel.habitaciones) 
        ? hotel.habitaciones.map(habitacion => {
            console.log('Procesando habitación:', habitacion);
            const habitacionActualizada = {
              id: habitacion.id,
              numero: habitacion.numero,
              tipo: habitacion.tipo,
              descripcion: habitacion.descripcion,
              capacidad: habitacion.capacidad,
              precio_por_noche: habitacion.precioPorNoche,
              activa: habitacion.activa,
              hotel_id: hotel.id,
              extras: habitacion.extras || []
            };
            console.log('Habitación actualizada:', habitacionActualizada);
            return habitacionActualizada;
          })
        : [];
      
      const updatedHotel = {
        id: hotel.id,
        nombre: hotel.nombre || '',
        direccion: hotel.direccion || '',
        ciudad: hotel.ciudad || '',
        pais: hotel.pais || '',
        estrellas: hotel.estrellas || 0,
        descripcion: hotel.descripcion || '',
        activo: !!newStatus,
        telefono: hotel.telefono || '',
        email: hotel.email || '',
        sitioWeb: hotel.sitioWeb || '',
        latitud: hotel.latitud || 0,
        longitud: hotel.longitud || 0,
        habitaciones: habitacionesActualizadas,
        servicios: Array.isArray(hotel.servicios) ? hotel.servicios : [],
      };
      console.log('Enviando hotel actualizado:', JSON.stringify(updatedHotel, null, 2));
      // Llama al servicio con el objeto completo
      await adminService.updateHotelStatus(hotelId, updatedHotel);
      const updatedHotels = hotels.map(h =>
        h.id === hotelId ? updatedHotel : h
      );
      setHotels(updatedHotels);
      // Actualizar estadísticas
      const stats = {
        totalHotels: updatedHotels.length,
        activeHotels: updatedHotels.filter(h => h.activo).length,
        totalRooms: updatedHotels.reduce((sum, h) => sum + (h.habitaciones?.length || 0), 0),
        averageRating: updatedHotels.reduce((sum, h) => sum + (h.estrellas || 0), 0) / updatedHotels.length
      };
      setStats(stats);
    } catch (err) {
      console.error('Error updating hotel status:', err);
      setError(err.message || 'Error al actualizar el estado del hotel');
    } finally {
      setLoading(false);
    }
  };

  if (loading && hotels.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">{t('admin.totalHotels')}</h3>
          <p className="text-2xl font-bold text-primary">{stats.totalHotels}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">{t('admin.activeHotels')}</h3>
          <p className="text-2xl font-bold text-green-600">{stats.activeHotels}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">{t('admin.totalRooms')}</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.totalRooms}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">{t('admin.averageRating')}</h3>
          <p className="text-2xl font-bold text-yellow-600">{stats.averageRating.toFixed(1)}</p>
        </div>
      </div>

      {/* Lista de hoteles */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">{t('admin.hotels')}</h2>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('hotel.id')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('hotel.name')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('hotel.location')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('hotel.rooms')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('hotel.rating')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('hotel.status')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {hotels.map((hotel) => (
                <tr key={hotel.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    #{hotel.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {hotel.nombre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {hotel.ciudad}, {hotel.pais}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {hotel.habitaciones?.length || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {hotel.estrellas || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${hotel.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {hotel.activo ? t('hotel.status.active') : t('hotel.status.inactive')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleStatusChange(hotel.id, !hotel.activo)}
                      disabled={loading}
                      className={`px-3 py-1 rounded-md text-sm font-medium
                        ${hotel.activo 
                          ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                          : 'bg-green-100 text-green-800 hover:bg-green-200'}
                        ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {hotel.activo ? t('admin.deactivate') : t('admin.activate')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HotelManagement; 