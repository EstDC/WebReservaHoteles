import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { useHotelStore } from '../../stores/hotelStore';
import { FaCreditCard, FaCheckCircle, FaTimesCircle, FaHistory } from 'react-icons/fa';

const estadoLabels = {
  PENDIENTE: 'Pendiente de pago',
  CONFIRMADA: 'Confirmada',
  EN_CURSO: 'En curso',
  COMPLETADA: 'Completada',
  CANCELADA: 'Cancelada',
  NO_SHOW: 'No presentado',
};

const estadoColors = {
  PENDIENTE: 'bg-yellow-100 text-yellow-800',
  CONFIRMADA: 'bg-green-100 text-green-800',
  EN_CURSO: 'bg-blue-100 text-blue-800',
  COMPLETADA: 'bg-gray-100 text-gray-800',
  CANCELADA: 'bg-red-100 text-red-800',
  NO_SHOW: 'bg-orange-100 text-orange-800',
};

const HistorialReservas = () => {
  const user = useHotelStore(state => state.user);
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = (url) => { window.location.href = url; };

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/reservas/usuario/${user.id}`);
        setReservas(res.data);
      } catch (err) {
        setError('Error al cargar el historial de reservas');
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) fetchReservas();
  }, [user]);

  const handlePagar = (reservaId) => {
    navigate(`/pago/${reservaId}`);
  };

  if (loading) return <div className="text-center py-8">Cargando historial...</div>;
  if (error) return <div className="text-red-600 bg-red-50 p-4 rounded-lg m-4">{error}</div>;
  if (!reservas.length) return <div className="text-center text-gray-600 mt-8">No tienes reservas registradas.</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><FaHistory /> Historial de Reservas</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-4 text-left">Habitación</th>
              <th className="py-3 px-4 text-left">Check-in</th>
              <th className="py-3 px-4 text-left">Check-out</th>
              <th className="py-3 px-4 text-left">Estado</th>
              <th className="py-3 px-4 text-left">Total</th>
              <th className="py-3 px-4 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reservas.map((reserva) => (
              <tr key={reserva.id} className="border-b last:border-b-0">
                <td className="py-2 px-4">{reserva.habitacion?.tipo}</td>
                <td className="py-2 px-4">{Array.isArray(reserva.fechaEntrada) ? new Date(reserva.fechaEntrada[0], reserva.fechaEntrada[1] - 1, reserva.fechaEntrada[2]).toLocaleDateString() : new Date(reserva.fechaEntrada).toLocaleDateString()}</td>
                <td className="py-2 px-4">{Array.isArray(reserva.fechaSalida) ? new Date(reserva.fechaSalida[0], reserva.fechaSalida[1] - 1, reserva.fechaSalida[2]).toLocaleDateString() : new Date(reserva.fechaSalida).toLocaleDateString()}</td>
                <td className="py-2 px-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${estadoColors[reserva.estado] || 'bg-gray-200 text-gray-800'}`}>
                    {estadoLabels[reserva.estado] || reserva.estado}
                  </span>
                </td>
                <td className="py-2 px-4 font-bold">€{reserva.precioTotal}</td>
                <td className="py-2 px-4">
                  {reserva.estado === 'PENDIENTE' && (
                    <button
                      onClick={() => handlePagar(reserva.id)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FaCreditCard /> Pagar ahora
                    </button>
                  )}
                  {reserva.estado === 'CONFIRMADA' && (
                    <span className="inline-flex items-center gap-2 text-green-600"><FaCheckCircle /> Pagada</span>
                  )}
                  {reserva.estado === 'CANCELADA' && (
                    <span className="inline-flex items-center gap-2 text-red-600"><FaTimesCircle /> Cancelada</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistorialReservas; 