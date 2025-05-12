import { useState } from 'react';
import { FaHotel, FaCalendarAlt, FaBed, FaTag, FaTimes, FaUsers, FaHistory } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const BookingList = ({ bookings }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('active');
  const [cancellingId, setCancellingId] = useState(null);

  // Separar reservas activas y pasadas
  const now = new Date();
  const activeBookings = bookings.filter(booking => new Date(booking.checkOut) > now && booking.status.toUpperCase() !== 'CANCELADA');
  const pastBookings = bookings.filter(booking => new Date(booking.checkOut) <= now || booking.status.toUpperCase() === 'CANCELADA');

  const handleCancel = async (bookingId) => {
    setCancellingId(bookingId);
    try {
      // TODO: Implementar llamada a la API para cancelar
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulación
      // Actualizar el estado local
      const updatedBookings = bookings.map(booking =>
        booking.id === bookingId
          ? { ...booking, status: 'CANCELADA' }
          : booking
      );
      // TODO: Actualizar el estado en el componente padre
    } catch (error) {
      console.error('Error al cancelar la reserva:', error);
    } finally {
      setCancellingId(null);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status.toUpperCase()) {
      case 'CONFIRMADA':
        return 'bg-green-100 text-green-800';
      case 'PENDIENTE':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELADA':
        return 'bg-red-100 text-red-800';
      case 'COMPLETADA':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status.toUpperCase()) {
      case 'CONFIRMADA':
        return 'Confirmada';
      case 'PENDIENTE':
        return 'Pendiente';
      case 'CANCELADA':
        return 'Cancelada';
      case 'COMPLETADA':
        return 'Completada';
      default:
        return status;
    }
  };

  const EmptyState = () => (
    <div className="bg-gray-50 rounded-lg p-8 text-center">
      <FaHistory className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <p className="text-gray-600">{t('bookings.noActive')} {activeTab === 'active' ? 'activas' : 'en el historial'}</p>
    </div>
  );

  const renderBookingCard = (booking) => {
    const isActive = new Date(booking.checkOut) > now;
    const isCancelling = cancellingId === booking.id;
    const canCancel = isActive && booking.status.toUpperCase() === 'CONFIRMADA';

    return (
      <div key={booking.id} className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Hotel Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <FaHotel className="text-primary" />
                <h3 className="text-lg font-semibold text-gray-900">{booking.hotelName}</h3>
              </div>
              
              {/* Booking Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <FaCalendarAlt />
                  <span>{formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FaBed />
                  <span>{booking.roomType}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FaTag />
                  <span>{booking.totalPrice}€</span>
                </div>
              </div>
            </div>

            {/* Status and Actions */}
            <div className="flex flex-col items-end gap-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(booking.status)}`}>
                {getStatusText(booking.status)}
              </span>
              
              {canCancel && (
                <button
                  onClick={() => handleCancel(booking.id)}
                  disabled={isCancelling}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isCancelling ? (
                    <>
                      <div className="w-4 h-4 border-t-2 border-red-600 rounded-full animate-spin"></div>
                      Cancelando...
                    </>
                  ) : (
                    <>
                      <FaTimes />
                      Cancelar
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'active'
              ? 'bg-primary text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          {t('bookings.active')} ({activeBookings.length})
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'past'
              ? 'bg-primary text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          {t('bookings.past')} ({pastBookings.length})
        </button>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {activeTab === 'active' ? (
          activeBookings.length > 0 ? (
            activeBookings.map(renderBookingCard)
          ) : (
            <EmptyState />
          )
        ) : (
          pastBookings.length > 0 ? (
            pastBookings.map(renderBookingCard)
          ) : (
            <EmptyState />
          )
        )}
      </div>
    </div>
  );
};

export default BookingList; 