import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ExtrasModal from './ExtrasModal';
import api from '../../utils/api';
import { useHotelStore } from '../../stores/hotelStore';

const steps = [
  { 
    key: 'fechas', 
    label: { first: 'busca', second: 'tus fechas' },
    color: 'bg-primary', 
    text: 'text-white' 
  },
  { 
    key: 'extras', 
    label: { first: 'añade', second: 'extras' },
    color: 'bg-black', 
    text: 'text-white' 
  },
  { 
    key: 'resumen', 
    label: { first: 'Total', second: 'de la reserva' },
    color: 'bg-primary', 
    text: 'text-white' 
  },
];

const drawerBackgrounds = {
    fechas: "",
    //extras: "url('/images/img/heidelberg-heidelberg-main-gallery-67.webp')",
    resumen: ""
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
  const [fechasError, setFechasError] = useState('');
  const user = useHotelStore(state => state.user);
  const setCurrentReservaId = useHotelStore(state => state.setCurrentReservaId);

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
    
    // Validar fechas antes de continuar
    if (!fechaEntrada || !fechaSalida) {
      setFechasError('Por favor, selecciona las fechas de entrada y salida');
      return;
    }
    
    try {
      setFechasError('');
      // Calcular noches y totales
      const noches = fechaEntrada && fechaSalida ? 
        Math.ceil((fechaSalida - fechaEntrada) / (1000 * 60 * 60 * 24)) : 0;
      const precioHabitacion = habitacion?.precioPorNoche || 0;
      const totalHabitacion = noches * precioHabitacion;
      const totalExtras = Object.entries(extrasSeleccionados)
        .filter(([id, checked]) => checked)
        .reduce((sum, [id]) => {
          const extra = extras.find(e => e.id === parseInt(id));
          return sum + (extra ? extra.precio : 0);
        }, 0);
      const totalGeneral = totalHabitacion + totalExtras;

      // Construir reservaExtras SOLO con id del extra
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

      // Construir payload SOLO con ids
      const payload = {
        usuario: { id: user.id },
        habitacion: { id: habitacion.id },
        fechaEntrada: fechaEntrada ? fechaEntrada.toISOString() : null,
        fechaSalida: fechaSalida ? fechaSalida.toISOString() : null,
        numeroHuespedes: habitacion?.capacidad || 1,
        reservaExtras,
        precioTotal: totalGeneral,
        estado: "PENDIENTE",
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString()
      };

      // Capturar el response con el ID de la reserva
      const response = await api.post('/reservas', payload);
      
      console.log('=== RESERVA STEPPER DEBUG ===');
      console.log('Response completo:', response);
      console.log('Response.data tipo:', typeof response.data);
      console.log('Response.data:', response.data);
      
      // Asegurar que response.data es un objeto
      let reservaCreada;
      if (typeof response.data === 'string') {
        reservaCreada = JSON.parse(response.data);
        console.log('Data parseado como JSON:', reservaCreada);
      } else {
        reservaCreada = response.data;
      }
      
      console.log('Reserva creada (final):', reservaCreada);
      console.log('ID de reserva:', reservaCreada.id);
      console.log('Tipo del ID:', typeof reservaCreada.id);
      
      // Guardar el ID en el store
      setCurrentReservaId(reservaCreada.id);
      console.log('ID guardado en store:', reservaCreada.id);
      
      // Verificar que se guardó
      const storeState = useHotelStore.getState();
      console.log('Estado actual del store:', storeState.currentReservaId);
      
      if (onReservaCompletada) onReservaCompletada();
      
      // Redirigir a página de pago con el ID de la reserva
      console.log('Redirigiendo a:', `/pago/${reservaCreada.id}`);
      console.log('===========================');
      window.location.href = `/pago/${reservaCreada.id}`;
    } catch (err) {
      console.error('Error en handleSubmit:', err);
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
            className={`w-full ${step.color} ${step.text} text-center py-6 cursor-pointer transition-all relative`}
            onClick={() => setOpenStep(openStep === step.key ? null : step.key)}
            style={{
              borderBottomLeftRadius: openStep === step.key ? '1.5rem' : 0,
              borderBottomRightRadius: openStep === step.key ? '1.5rem' : 0,
              marginBottom: 0
            }}
          >
            <div className="relative inline-block" style={{ minWidth: '220px' }}>
              <span className="font-alcantera-script text-6xl text-white block text-left leading-tight" style={{ position: 'relative', zIndex: 1 }}>
                {step.label.first}
              </span>
              <span className="font-lorise-sans text-5xl text-white block absolute translate-x-6 -bottom-1 leading-none" style={{ zIndex: 2 }}>
                {step.label.second}
              </span>
            </div>
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
                          {fechasError && (
                            <div className="text-red-500 mb-4">{fechasError}</div>
                          )}
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
                      // Calcular noches
                      const noches = fechaEntrada && fechaSalida ? 
                        Math.ceil((fechaSalida - fechaEntrada) / (1000 * 60 * 60 * 24)) : 0;
                      
                      // Validar si las fechas están completas
                      const fechasCompletas = fechaEntrada && fechaSalida;
                      
                      // Calcular precio de habitación
                      const precioHabitacion = habitacion?.precioPorNoche || 0;
                      const totalHabitacion = noches * precioHabitacion;
                      
                      // Calcular extras
                      const totalExtras = Object.entries(extrasSeleccionados)
                        .filter(([id, checked]) => checked)
                        .reduce((sum, [id]) => {
                          const extra = extras.find(e => e.id === parseInt(id));
                          return sum + (extra ? extra.precio : 0);
                        }, 0);
                      
                      const totalGeneral = totalHabitacion + totalExtras;

                      return (
                        <form onSubmit={handleSubmit}>
                          <div className="text-8xl text-primary font-alcantera-script mb-4">Resumen</div>
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
                            <span className="font-semibold">Noches:</span> {noches}
                          </div>
                          <div className="mb-2">
                            <span className="font-semibold">Precio por noche:</span> {precioHabitacion.toFixed(2)} €
                          </div>
                          <div className="mb-2">
                            <span className="font-semibold">Subtotal habitación:</span> {totalHabitacion.toFixed(2)} €
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
                            Total extras: {totalExtras.toFixed(2)} €
                          </div>
                          <div className="font-bold mt-2 border-t pt-2 text-3xl">
                            Total general: {totalGeneral.toFixed(2)} €
                          </div>
                          <button
                            type="submit"
                            disabled={!fechasCompletas}
                            className={`mt-8 w-full px-6 py-3 rounded transition font-bold text-lg ${
                              fechasCompletas 
                                ? 'bg-primary text-white hover:bg-primary-dark' 
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            {fechasCompletas ? 'Reservar' : 'Selecciona las fechas primero'}
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