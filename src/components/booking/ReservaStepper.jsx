import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ExtrasModal from './ExtrasModal';
import api from '../../utils/api';

const steps = [
  { key: 'fechas', label: 'busca tus fecha', color: 'bg-primary', text: 'text-white' },
  { key: 'extras', label: 'añade extras', color: 'bg-black', text: 'text-white' },
  { key: 'resumen', label: 'desglose final', color: 'bg-primary', text: 'text-white' },
];

const drawerBackgrounds = {
    fechas: "url('/images/img/GettyImages-1322424997.jpg')",
    extras: "url('/images/img/heidelberg-heidelberg-main-gallery-67.webp')",
    resumen: "url('/images/img/SieteLugares_Italia_03.jpg')"
};

const ReservaStepper = ({ habitacionId, onReservaCompletada }) => {
  // Estados principales
  const [openStep, setOpenStep] = useState('fechas');
  const [habitacion, setHabitacion] = useState(null);
  const [extras, setExtras] = useState([]);
  const [fechasOcupadas, setFechasOcupadas] = useState([]);
  const [fechaEntrada, setFechaEntrada] = useState(null);
  const [fechaSalida, setFechaSalida] = useState(null);
  const [showExtrasModal, setShowExtrasModal] = useState(false);
  const [extrasSeleccionados, setExtrasSeleccionados] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch de datos
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

  // Enviar reserva
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

  if (loading) return <div className="text-center py-12">Cargando...</div>;
  if (error) return <div className="text-center text-red-500 py-12">{error}</div>;

  return (
    <div className="w-full">
      {/* Barra de pasos y drawers en flujo normal */}
      {steps.map(step => (
        <div key={step.key} className="relative w-full">
          {/* Bloque de color */}
          <div
            className={`w-full ${step.color} ${step.text} text-center py-6 cursor-pointer font-semibold text-lg transition-all`}
            onClick={() => setOpenStep(openStep === step.key ? null : step.key)}
            style={{
              borderBottomLeftRadius: openStep === step.key ? '1.5rem' : 0,
              borderBottomRightRadius: openStep === step.key ? '1.5rem' : 0,
              marginBottom: 0
            }}
          >
            {step.label}
          </div>
          {/* Drawer debajo del bloque si está abierto */}
          {openStep === step.key && (
            <div
              className="w-full p-0 bg-white relative"
              style={{
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                borderBottomLeftRadius: '1.5rem',
                borderBottomRightRadius: '1.5rem',
                boxShadow: 'none',
                marginTop: 0
              }}
            >
              {/* Imagen de fondo a opacidad 100% */}
              <div
                className="absolute inset-0 w-full h-full z-0"
                style={{
                  backgroundImage: drawerBackgrounds[step.key],
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: 1
                }}
              />
              {/* Overlay centrado y más estrecho */}
              <div
                className="absolute left-1/2 top-0 -translate-x-1/2 h-full z-10 pointer-events-none"
                style={{
                  width: '100%',
                  maxWidth: '56rem', // más ancho, igual que max-w-4xl
                  paddingLeft: '2rem',
                  paddingRight: '2rem',
                  background: 'rgba(255,255,255,0.85)'
                }}
              />
              <div className="relative z-20 p-8">
                <div className="max-w-3xl mx-auto">
                  {(() => {
                    if (step.key === 'fechas') {
                      return (
                        <>
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
                                popperPlacement="top-start"
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
                                popperPlacement="top-start"
                              />
                            </div>
                          </div>
                        </>
                      );
                    }
                    if (step.key === 'extras') {
                      const extrasMarcados = Object.entries(extrasSeleccionados).filter(([id, checked]) => checked);
                      return (
                        <>
                          <div className="uppercase text-xs text-gray-600 font-semibold mb-4 tracking-widest">EXTRAS</div>
                          <ul className="mb-4">
                            {extrasMarcados.length === 0 ? (
                              <li className="text-gray-500 italic py-2">No hay servicios extra añadidos</li>
                            ) : (
                              extrasMarcados.map(([id]) => {
                                const extra = extras.find(e => e.id === parseInt(id));
                                return (
                                  <li key={id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                                    <span className="font-medium">{extra?.nombre}</span>
                                    <span className="text-gray-700">{extra?.precio?.toFixed(2)} €</span>
                                  </li>
                                );
                              })
                            )}
                          </ul>
                          <button
                            type="button"
                            className="bg-primary text-white px-6 py-2 rounded hover:bg-primary/90 transition w-full font-semibold"
                            onClick={() => setShowExtrasModal(true)}
                          >
                            Ver todos los extras
                          </button>
                        </>
                      );
                    }
                    if (step.key === 'resumen') {
                      return (
                        <form onSubmit={handleSubmit}>
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
                          <button
                            type="submit"
                            className="mt-8 w-full bg-primary text-white px-6 py-3 rounded hover:bg-primary-dark transition font-bold text-lg"
                          >
                            Reservar
                          </button>
                        </form>
                      );
                    }
                    return null;
                  })()}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
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
    </div>
  );
};

export default ReservaStepper;