import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ExtrasModal from './ExtrasModal';

const ReservaForm = ({ habitacionId, onReservaCompletada }) => {
  const [habitacion, setHabitacion] = useState(null);
  const [extras, setExtras] = useState([]);
  const [fechasOcupadas, setFechasOcupadas] = useState([]);
  const [fechaEntrada, setFechaEntrada] = useState(null);
  const [fechaSalida, setFechaSalida] = useState(null);
  const [showExtrasModal, setShowExtrasModal] = useState(false);
  const [extrasSeleccionados, setExtrasSeleccionados] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const habRes = await api.get(`/habitaciones/${habitacionId}`);
        setHabitacion(habRes.data);

        const extrasRes = await api.get('/extras');
        setExtras(extrasRes.data);

        const fechasRes = await api.get(`/reservas/habitacion/${habitacionId}/fechas-ocupadas`);
        const fechasOcupadasDate = fechasRes.data.map(f => new Date(f));
        setFechasOcupadas(fechasOcupadasDate);

        setError(null);
      } catch (err) {
        setError('Error al cargar los datos de la reserva');
      } finally {
        setLoading(false);
      }
    };
    if (habitacionId) fetchData();
  }, [habitacionId]);

  const handleExtraChange = (extraId, cantidad) => {
    setExtrasSeleccionados(prev => {
      if (cantidad > 0) {
        return { ...prev, [extraId]: cantidad };
      } else {
        const { [extraId]: _, ...rest } = prev;
        return rest;
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const reservaExtras = Object.entries(extrasSeleccionados)
        .filter(([id, checked]) => checked)
        .map(([extraId]) => {
          const extra = extras.find(e => e.id === parseInt(extraId));
          return {
            extra: { id: extra.id },
            cantidad: 1,
            precioUnitario: extra.precio
          };
        });
      const payload = {
        habitacion: { id: habitacionId },
        fechaEntrada: fechaEntrada ? fechaEntrada.toISOString().split('T')[0] : null,
        fechaSalida: fechaSalida ? fechaSalida.toISOString().split('T')[0] : null,
        reservaExtras,
      };
      await api.post('/reservas', payload);
      if (onReservaCompletada) onReservaCompletada();
      alert('¡Reserva realizada con éxito!');
    } catch (err) {
      setError('Error al realizar la reserva');
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="w-full flex justify-center mt-12 mb-16">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg max-w-2xl w-full px-8 py-10 space-y-10"
      >
        {/* Fechas */}
        <div>
          <div className="uppercase text-xs text-gray-600 font-semibold mb-4 tracking-widest">FECHAS</div>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <label className="block font-semibold mb-1">Fecha de entrada:</label>
              <DatePicker
                selected={fechaEntrada}
                onChange={date => setFechaEntrada(date)}
                excludeDates={fechasOcupadas}
                minDate={new Date()}
                dateFormat="yyyy-MM-dd"
                placeholderText="Selecciona fecha de entrada"
                className="border px-3 py-2 rounded w-full"
              />
            </div>
            <div className="flex-1">
              <label className="block font-semibold mb-1">Fecha de salida:</label>
              <DatePicker
                selected={fechaSalida}
                onChange={date => setFechaSalida(date)}
                excludeDates={fechasOcupadas}
                minDate={fechaEntrada || new Date()}
                dateFormat="yyyy-MM-dd"
                placeholderText="Selecciona fecha de salida"
                className="border px-3 py-2 rounded w-full"
              />
            </div>
          </div>
        </div>
  
        {/* Extras */}
        <div>
          <div className="uppercase text-xs text-gray-600 font-semibold mb-4 tracking-widest">EXTRAS</div>
          <ul className="mb-4">
            {extras.slice(0, 3).map(extra => (
              <li key={extra.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                <span className="font-medium">{extra.nombre}</span>
                <span className="text-gray-700">{extra.precio.toFixed(2)} €</span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="bg-primary text-white px-6 py-2 rounded hover:bg-primary/90 transition w-full font-semibold"
            onClick={() => setShowExtrasModal(true)}
          >
            Ver todos los extras
          </button>
        </div>
  
        {/* Resumen */}
        <div>
          <div className="uppercase text-xs text-gray-600 font-semibold mb-4 tracking-widest">RESUMEN</div>
          <div className="mb-2">
            <span className="font-semibold">Habitación:</span> {habitacion?.tipo}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Entrada:</span> {fechaEntrada ? fechaEntrada.toLocaleDateString() : '-'}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Salida:</span> {fechaSalida ? fechaSalida.toLocaleDateString() : '-'}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Extras:</span>
            <ul>
              {Object.entries(extrasSeleccionados)
                .filter(([id, checked]) => checked)
                .map(([id]) => {
                  const extra = extras.find(e => e.id === parseInt(id));
                  return (
                    <li key={id}>
                      {extra?.nombre} - {extra?.precio?.toFixed(2)} €
                    </li>
                  );
                })}
            </ul>
          </div>
          <div className="font-bold mt-2 text-lg">
            Total extras: {Object.entries(extrasSeleccionados)
              .filter(([id, checked]) => checked)
              .reduce((sum, [id]) => {
                const extra = extras.find(e => e.id === parseInt(id));
                return sum + (extra ? extra.precio : 0);
              }, 0).toFixed(2)} €
          </div>
        </div>
  
        <button
          type="submit"
          className="w-full bg-primary text-white px-6 py-3 rounded hover:bg-primary-dark transition font-bold text-lg"
        >
          Reservar
        </button>
  
        {/* Modal de extras */}
        <ExtrasModal
          extras={extras}
          open={showExtrasModal}
          onClose={() => setShowExtrasModal(false)}
          onConfirm={(selected) => {
            setExtrasSeleccionados(selected);
            setShowExtrasModal(false);
          }}
          initialSelected={extrasSeleccionados}
        />
      </form>
    </div>
  );
};

export default ReservaForm;