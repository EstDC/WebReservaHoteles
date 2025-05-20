import { useState, useEffect } from 'react';
import { FaHotel, FaCalendarAlt, FaBed, FaTag, FaTimes, FaUsers, FaHistory } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import api from '../../utils/api';

const BookingList = ({ bookings }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('active');
  const [cancellingId, setCancellingId] = useState(null);
  const [bookingsState, setBookingsState] = useState(bookings);
  const [hotelNames, setHotelNames] = useState({});
  // const [tiposPago, setTiposPago] = useState({});

  useEffect(() => {
    setBookingsState(bookings);
  }, [bookings]);

  // Obtener nombres de hotel para cada habitación
  useEffect(() => {
    const fetchHotelNames = async () => {
      const ids = bookings
        .map(b => b.habitacion?.id)
        .filter((id, idx, arr) => id && arr.indexOf(id) === idx);
      const newHotelNames = { ...hotelNames };
      for (const id of ids) {
        if (!newHotelNames[id]) {
          try {
            const res = await api.get(`/habitaciones/${id}`);
            newHotelNames[id] = res.data.hotel?.nombre || 'Hotel';
          } catch {
            newHotelNames[id] = 'Hotel';
          }
        }
      }
      setHotelNames(newHotelNames);
    };
    if (bookings.length) fetchHotelNames();
    // eslint-disable-next-line
  }, [bookings]);

  // Obtener tipos de pago para cada reserva (comentado temporalmente)
  /*
  useEffect(() => {
    const fetchTiposPago = async () => {
      const ids = bookings
        .map(b => b.id)
        .filter((id, idx, arr) => id && arr.indexOf(id) === idx);
      const newTiposPago = { ...tiposPago };
      for (const id of ids) {
        if (!newTiposPago[id]) {
          try {
            const res = await api.get(`/pagos/reserva/${id}`);
            // Tomar el último pago si hay varios
            const pagos = res.data;
            if (pagos && pagos.length > 0) {
              newTiposPago[id] = pagos[pagos.length - 1].metodoPago || 'N/A';
            } else {
              newTiposPago[id] = 'N/A';
            }
          } catch {
            newTiposPago[id] = 'N/A';
          }
        }
      }
      setTiposPago(newTiposPago);
    };
    if (bookings.length) fetchTiposPago();
    // eslint-disable-next-line
  }, [bookings]);
  */

  // Función para convertir fechas en array o string a Date
  const toDate = (fecha) => Array.isArray(fecha)
    ? new Date(fecha[0], fecha[1] - 1, fecha[2], fecha[3] || 0, fecha[4] || 0, fecha[5] || 0, fecha[6] || 0)
    : new Date(fecha);

  // Separar reservas activas y pasadas
  const now = new Date();
  const activeBookings = bookingsState.filter(booking => toDate(booking.fechaSalida) > now && booking.estado.toUpperCase() !== 'CANCELADA');
  const pastBookings = bookingsState.filter(booking => toDate(booking.fechaSalida) <= now || booking.estado.toUpperCase() === 'CANCELADA');

  // Log de depuración
  console.log('Bookings recibidos:', bookings);
  console.log('Extras de las reservas:', bookings.map(b => ({
    id: b.id,
    extras: b.reservaExtras
  })));

  const handleCancel = async (bookingId) => {
    setCancellingId(bookingId);
    try {
      await api.put(`/reservas/${bookingId}/cancelar`);
      // Actualizar el estado local
      setBookingsState(prev => prev.map(booking =>
        booking.id === bookingId
          ? { ...booking, estado: 'CANCELADA' }
          : booking
      ));
    } catch (error) {
      console.error('Error al cancelar la reserva:', error);
    } finally {
      setCancellingId(null);
    }
  };

  const handlePagar = (bookingId) => {
    window.location.href = `/pago/${bookingId}`;
  };

  const formatDate = (date) => {
    return toDate(date).toLocaleDateString('es-ES', {
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
    const isActive = toDate(booking.fechaSalida) > now;
    const isCancelling = cancellingId === booking.id;
    const canCancel = isActive && booking.estado.toUpperCase() === 'CONFIRMADA';

    return (
      <div key={booking.id} className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Hotel Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <FaHotel className="text-primary" />
                <h3 className="text-lg font-semibold text-gray-900">{hotelNames[booking.habitacion?.id] || 'Hotel'}</h3>
              </div>
              
              {/* Booking Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <FaCalendarAlt />
                  <span>{formatDate(booking.fechaEntrada)} - {formatDate(booking.fechaSalida)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FaBed />
                  <span>{booking.habitacion?.tipo || 'Tipo desconocido'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FaTag />
                  <span>{booking.precioTotal}€</span>
                </div>
                {/*
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="font-medium">Tipo de pago:</span>
                  <span>{tiposPago[booking.id] || 'Cargando...'}</span>
                </div>
                */}
              </div>
              {/* Extras */}
              {booking.reservaExtras && booking.reservaExtras.length > 0 && (
                <div className="mt-4">
                  <span className="font-medium text-gray-700">Extras:</span>
                  <ul className="list-disc list-inside text-gray-600">
                    {booking.reservaExtras.map((extra, idx) => (
                      <li key={idx}>
                        {extra.extra?.nombre || 'Extra'} x{extra.cantidad || 1} ({extra.precioTotal || extra.precioUnitario}€)
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {(!booking.reservaExtras || booking.reservaExtras.length === 0) && (
                <div className="mt-4 text-gray-500 italic">
                  No hay extras seleccionados
                </div>
              )}
            </div>

            {/* Status and Actions */}
            <div className="flex flex-col items-end gap-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(booking.estado)}`}>
                {getStatusText(booking.estado)}
              </span>
              {booking.estado === 'PENDIENTE' && (
                <button
                  onClick={() => handlePagar(booking.id)}
                  className="flex items-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <FaHotel /> Pagar ahora
                </button>
              )}
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