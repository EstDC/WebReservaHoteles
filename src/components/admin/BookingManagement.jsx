import React, { useState, useEffect } from 'react';
import { bookingService } from '../../services/bookingService';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    loadBookings();
  }, []);

  // Carga todas las reservas y calcula las estadísticas
  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getAllBookings();
      setBookings(data);

      // Calcular estadísticas
      const now = new Date();
      const stats = {
        totalBookings: data.length,
        activeBookings: data.filter(booking => {
          const checkIn = new Date(booking.fechaEntrada);
          const checkOut = new Date(booking.fechaSalida);
          return checkIn <= now && now <= checkOut;
        }).length,
        completedBookings: data.filter(booking => {
          const checkOut = new Date(booking.fechaSalida);
          return checkOut < now;
        }).length,
        cancelledBookings: data.filter(booking => booking.estado === 'CANCELLED').length,
        totalRevenue: data.reduce((sum, booking) => sum + booking.precioTotal, 0)
      };

      setStats(stats);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Actualiza el estado de una reserva
  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      setLoading(true);
      await bookingService.updateBookingStatus(bookingId, newStatus);
      await loadBookings();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Formatea la fecha en formato español
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div>
      {/* Panel de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total de Reservas</h3>
          <p className="text-2xl font-bold text-primary">{stats.totalBookings}</p>
          <p className="text-sm text-gray-500 mt-1">Ingresos totales: {stats.totalRevenue}€</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Reservas Activas</h3>
          <p className="text-2xl font-bold text-green-600">{stats.activeBookings}</p>
          <p className="text-sm text-gray-500 mt-1">Reservas completadas: {stats.completedBookings}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Reservas Canceladas</h3>
          <p className="text-2xl font-bold text-red-600">{stats.cancelledBookings}</p>
        </div>
      </div>

      {/* Tabla de reservas */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Reservas</h2>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hotel
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entrada
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Salida
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      #{booking.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.usuario?.email || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.hotel?.nombre || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(booking.fechaEntrada)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(booking.fechaSalida)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${booking.estado === 'CONFIRMED' ? 'bg-green-100 text-green-800' : 
                          booking.estado === 'CANCELLED' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                        {booking.estado === 'CONFIRMED' ? 'Confirmada' : 
                         booking.estado === 'CANCELLED' ? 'Cancelada' : 
                         'Pendiente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.precioTotal}€
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <select
                        value={booking.estado}
                        onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                        className="text-sm border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                      >
                        <option value="PENDING">Pendiente</option>
                        <option value="CONFIRMED">Confirmada</option>
                        <option value="CANCELLED">Cancelada</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingManagement; 