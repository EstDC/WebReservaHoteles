import React, { useState, useEffect } from 'react';
import { FaCreditCard, FaPaypal, FaPlus } from 'react-icons/fa';
import api from '../../utils/api';
import { useHotelStore } from '../../stores/hotelStore';
import { motion } from 'framer-motion';

const PagoReserva = ({ reservaId }) => {
  const [reserva, setReserva] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [metodoPago, setMetodoPago] = useState('tarjeta');
  const [procesandoPago, setProcesandoPago] = useState(false);
  const [tarjetas, setTarjetas] = useState([]);
  const [tarjetaSeleccionada, setTarjetaSeleccionada] = useState(null);
  const [mostrarNuevaTarjeta, setMostrarNuevaTarjeta] = useState(false);
  const [nuevaTarjeta, setNuevaTarjeta] = useState({
    tipoTarjeta: 'VISA',
    numeroTarjeta: '',
    titular: '',
    fechaExpiracion: '',
    cvv: ''
  });
  const user = useHotelStore(state => state.user);
  const currentReservaId = useHotelStore(state => state.currentReservaId);
  const [mostrarModalExtras, setMostrarModalExtras] = useState(false);

  // Debugging
  console.log("PagoReserva - Props reservaId:", reservaId, typeof reservaId);
  console.log("PagoReserva - Store currentReservaId:", currentReservaId, typeof currentReservaId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Usar reservaId de la URL o como fallback el del store
        const idToUse = reservaId || currentReservaId;
        
        console.log("PagoReserva - ID a usar:", idToUse, typeof idToUse);
        
        if (!idToUse) {
          setError('No se encontró ID de reserva');
          setLoading(false);
          return;
        }
        
        // Cargar datos de la reserva
        const reservaResponse = await api.get(`/reservas/${idToUse}`);
        setReserva(reservaResponse.data);

        // Cargar tarjetas del usuario
        if (user?.id) {
          const tarjetasResponse = await api.get(`/datos-bancarios/usuario/${user.id}`);
          const tarjetasActivas = tarjetasResponse.data.filter(t => t.activa);
          setTarjetas(tarjetasActivas);
          
          // Seleccionar la tarjeta predeterminada si existe
          const tarjetaPredeterminada = tarjetasActivas.find(t => t.predeterminada);
          if (tarjetaPredeterminada) {
            setTarjetaSeleccionada(tarjetaPredeterminada);
          }
        }
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError('Error al cargar los datos necesarios');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [reservaId, currentReservaId, user]);

  const handlePago = async (e) => {
    e.preventDefault();
    setProcesandoPago(true);
    setError(null);
    
    try {
      const idToUse = reservaId || currentReservaId;
      
      if (metodoPago === 'tarjeta') {
        // Si se está usando una nueva tarjeta, primero guardarla
        if (mostrarNuevaTarjeta) {
          const tarjetaResponse = await api.post(`/datos-bancarios/usuario/${user.id}`, nuevaTarjeta);
          setTarjetaSeleccionada(tarjetaResponse.data);
        }

        // Crear el pago con estado COMPLETADO
        await api.post(`/pagos`, {
          reserva: { id: idToUse },
          metodoPago: 'TARJETA_CREDITO',
          datosBancarios: { id: tarjetaSeleccionada.id },
          monto: reserva.precioTotal,
          estado: 'COMPLETADO',
          referenciaPago: `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        });
      } else {
        // Pago con PayPal
        await api.post(`/pagos`, {
          reserva: { id: idToUse },
          metodoPago: 'PAYPAL',
          monto: reserva.precioTotal,
          estado: 'COMPLETADO',
          referenciaPago: `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        });
      }
      
      // Actualizar la reserva a CONFIRMADA usando el nuevo endpoint
      await api.put(`/reservas/${idToUse}/estado`, { estado: 'CONFIRMADA' });
      
      alert('¡Pago realizado con éxito!');
      window.location.href = '/account';
    } catch (err) {
      console.error('Error en el pago:', err);
      setError('Error al procesar el pago. Por favor, intenta de nuevo.');
    } finally {
      setProcesandoPago(false);
    }
  };

  // Añadir función utilitaria para parsear fechas
  const parseFecha = (fecha) => {
    if (Array.isArray(fecha)) {
      return new Date(
        fecha[0],
        (fecha[1] || 1) - 1,
        fecha[2] || 1,
        fecha[3] || 0,
        fecha[4] || 0,
        fecha[5] || 0,
        fecha[6] || 0
      );
    }
    return new Date(fecha);
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen text-lg">Cargando datos de la reserva...</div>;
  if (error) return <div className="text-red-600 bg-red-50 p-4 rounded-lg m-4">{error}</div>;
  if (!reserva) return <div className="text-center text-gray-600 mt-8">Reserva no encontrada</div>;

  // Obtener imagen
  const hotelImg = '/images/img/family-vacation.jpg';

  return (
    <>
      {/* RESUMEN HERO */}
      <section className="w-full flex flex-col md:flex-row p-0 m-0 bg-white items-stretch">
        {/* Info de la reserva a la izquierda */}
        <div className="md:w-1/2 w-full flex flex-col justify-center p-8 md:p-16 min-h-[60vh] md:min-h-[80vh]">
          <h1 className="text-7xl font-lorise-sans font-semibold mb-1 text-primary">{reserva.habitacion?.tipo}</h1>
          <div className="text-6xl text-gray-800 mb-1 font-alcantera-script">{reserva.habitacion?.descripcion}</div>
          <div className="flex flex-col gap-2 text-lg text-gray-800 mb-6">
            <div><span className="font-semibold font-sans">Check-in:</span> {parseFecha(reserva.fechaEntrada).toLocaleDateString()}</div>
            <div><span className="font-semibold font-sans">Check-out:</span> {parseFecha(reserva.fechaSalida).toLocaleDateString()}</div>
            <div><span className="font-semibold font-sans">Huéspedes:</span> {reserva.numeroHuespedes}</div>
          </div>
          {reserva.reservaExtras?.length > 0 && (
            <div className="mb-6">
              <div className="font-lhelvetica text-2xl text-primary mb-2">Servicios extra</div>
              <div className="flex items-center gap-4">
                <span className="text-lg text-gray-800 font-sans">
                  {reserva.reservaExtras.length} extra{reserva.reservaExtras.length > 1 ? 's' : ''} seleccionados
                </span>
                <button
                  type="button"
                  onClick={() => setMostrarModalExtras(true)}
                  className="text-primary underline font-sans text-sm hover:text-primary/80"
                >
                  Ver todos
                </button>
              </div>
              <div className="text-lg text-gray-800 font-sans">
                Total extras: <span className="font-bold">€
                  {reserva.reservaExtras.reduce((acc, extra) => acc + extra.precioUnitario, 0)}
                </span>
              </div>
            </div>
          )}
          <div className="mt-4 text-4xl font-bold text-orange-400 font-sans">{reserva.precioTotal}€ <span className="text-xl text-gray-600 font-helvetica">/ total</span></div>
        </div>
        {/* Imagen principal a la derecha */}
        <div className="md:w-1/2 w-full relative flex items-center justify-start h-[60vh] md:h-[80vh]">
          <img
            src={hotelImg}
            alt="Hotel"
            className="absolute inset-0 w-full h-full object-cover object-center z-0"
            style={{ minHeight: '100%', minWidth: '100%', borderRadius: 0 }}
          />
          {/* Overlay degradado */}
          <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-black/40 via-black/0 to-transparent" />
          {/* Texto animado */}
          <div className="absolute left-0 bottom-0 flex flex-col justify-end items-start z-20 h-full w-full pl-8 pb-8 md:pl-16 md:pb-8">
            <motion.span
              initial={{ opacity: 0, x: 200 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.8, 0, 0.2, 1] }}
              className="font-lorise-sans text-6xl md:text-7xl text-white drop-shadow-lg leading-none"
            >
              Tus vacaciones están&nbsp;
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: 240 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.8, 0, 0.2, 1] }}
              className="font-alcantera-script text-8xl md:text-9xl text-white drop-shadow-lg -mt-10 pl-12"
            >
              ¡ a punto de comenzar!
            </motion.span>
          </div>
        </div>
      </section>

      {/* FORMULARIO DE PAGO */}
      <section className="w-full bg-[#f7a16c] py-16 px-0 font-sans">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-12 flex flex-col gap-8">
        <div className="relative">
          <h2 className="font-lorise-sans text-5xl text-gray-800 relative z-10">Elige tu</h2>
          <h2 className="font-alcantera-script text-7xl md:text-8xl text-primary relative z-10 -mt-10 transform translate-x-12">
            método de pago
          </h2>
        </div>
          <form id="pago-form" onSubmit={handlePago} className="flex flex-col md:flex-row gap-8 font-sans">
            {/* Métodos de pago a la izquierda */}
            <div className="flex-1 flex flex-col gap-6">
              <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition hover:bg-gray-50 ${metodoPago === 'tarjeta' ? 'border-primary bg-primary/5' : ''}`}> 
                <input
                  type="radio"
                  value="tarjeta"
                  checked={metodoPago === 'tarjeta'}
                  onChange={(e) => setMetodoPago(e.target.value)}
                  className="mr-3 accent-primary"
                />
                <FaCreditCard className="text-primary mr-3" />
                <span className="font-helvetica text-lg">Tarjeta de Crédito/Débito</span>
              </label>
              <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition hover:bg-gray-50 ${metodoPago === 'paypal' ? 'border-primary bg-primary/5' : ''}`}> 
                <input
                  type="radio"
                  value="paypal"
                  checked={metodoPago === 'paypal'}
                  onChange={(e) => setMetodoPago(e.target.value)}
                  className="mr-3 accent-primary"
                />
                <FaPaypal className="text-primary mr-3" />
                <span className="font-helvetica text-lg">PayPal</span>
              </label>
            </div>
            {/* Formulario a la derecha */}
            <div className="flex-1 flex flex-col gap-6 font-sans">
              {metodoPago === 'tarjeta' && (
                <div className="space-y-4">
                  {!mostrarNuevaTarjeta && tarjetas.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-helvetica text-lg text-gray-600">Selecciona una tarjeta guardada</h4>
                      {tarjetas.map((tarjeta) => (
                        <label
                          key={tarjeta.id}
                          className={`flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition ${tarjetaSeleccionada?.id === tarjeta.id ? 'border-primary bg-primary/10' : ''}`}
                        >
                          <input
                            type="radio"
                            name="tarjeta"
                            checked={tarjetaSeleccionada?.id === tarjeta.id}
                            onChange={() => setTarjetaSeleccionada(tarjeta)}
                            className="mr-3 accent-primary"
                          />
                          <div>
                            <p className="font-medium font-sans">
                              {tarjeta.tipoTarjeta === 'VISA' ? 'Visa' :
                                tarjeta.tipoTarjeta === 'MASTERCARD' ? 'Mastercard' :
                                tarjeta.tipoTarjeta === 'AMERICAN_EXPRESS' ? 'American Express' :
                                tarjeta.tipoTarjeta === 'DINERS_CLUB' ? 'Diners Club' : tarjeta.tipoTarjeta}
                            </p>
                            <p className="text-sm text-gray-600 font-sans">
                              **** **** **** {tarjeta.numeroTarjeta.slice(-4)}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}

                  {(!tarjetas.length || mostrarNuevaTarjeta) && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-helvetica text-lg text-gray-600">Nueva tarjeta</h4>
                        {tarjetas.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setMostrarNuevaTarjeta(false)}
                            className="text-sm text-primary hover:text-primary/80 font-sans"
                          >
                            Usar tarjeta guardada
                          </button>
                        )}
                      </div>
                      <select
                        value={nuevaTarjeta.tipoTarjeta}
                        onChange={(e) => setNuevaTarjeta({ ...nuevaTarjeta, tipoTarjeta: e.target.value })}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50 font-sans"
                        required
                      >
                        <option value="VISA">Visa</option>
                        <option value="MASTERCARD">Mastercard</option>
                        <option value="AMERICAN_EXPRESS">American Express</option>
                        <option value="DINERS_CLUB">Diners Club</option>
                      </select>
                      <input 
                        type="text" 
                        placeholder="Número de tarjeta" 
                        value={nuevaTarjeta.numeroTarjeta}
                        onChange={(e) => setNuevaTarjeta({ ...nuevaTarjeta, numeroTarjeta: e.target.value })}
                        required 
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50 font-sans"
                      />
                      <input 
                        type="text" 
                        placeholder="Nombre en la tarjeta" 
                        value={nuevaTarjeta.titular}
                        onChange={(e) => setNuevaTarjeta({ ...nuevaTarjeta, titular: e.target.value })}
                        required 
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50 font-sans"
                      />
                      <div className="flex gap-4">
                        <input 
                          type="text" 
                          placeholder="MM/AA" 
                          value={nuevaTarjeta.fechaExpiracion}
                          onChange={(e) => setNuevaTarjeta({ ...nuevaTarjeta, fechaExpiracion: e.target.value })}
                          required 
                          className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50 font-sans"
                        />
                        <input 
                          type="text" 
                          placeholder="CVC" 
                          value={nuevaTarjeta.cvv}
                          onChange={(e) => setNuevaTarjeta({ ...nuevaTarjeta, cvv: e.target.value })}
                          required 
                          className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50 font-sans"
                        />
                      </div>
                      {/* Botón para añadir la tarjeta */}
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            // Buscar si ya existe una tarjeta inactiva con el mismo número
                            const tarjetasResponse = await api.get(`/datos-bancarios/usuario/${user.id}`);
                            const tarjetasUsuario = tarjetasResponse.data;
                            const existingCard = tarjetasUsuario.find(
                              card => card.numeroTarjeta === nuevaTarjeta.numeroTarjeta && !card.activa
                            );

                            let tarjetaFinal;
                            if (existingCard) {
                              // Reactivar la tarjeta
                              const reactivada = await api.put(`/datos-bancarios/${existingCard.id}`, {
                                ...existingCard,
                                activa: true,
                                fechaExpiracion: nuevaTarjeta.fechaExpiracion,
                                cvv: nuevaTarjeta.cvv
                              });
                              tarjetaFinal = reactivada.data;
                            } else {
                              // Crear nueva tarjeta
                              const creada = await api.post(`/datos-bancarios/usuario/${user.id}`, nuevaTarjeta);
                              tarjetaFinal = creada.data;
                            }

                            // Recargar tarjetas y seleccionar la nueva
                            const tarjetasActualizadas = await api.get(`/datos-bancarios/usuario/${user.id}`);
                            const tarjetasActivas = tarjetasActualizadas.data.filter(t => t.activa);
                            setTarjetas(tarjetasActivas);
                            setTarjetaSeleccionada(tarjetaFinal);
                            setMostrarNuevaTarjeta(false);
                          } catch (err) {
                            alert('Error al guardar la tarjeta');
                          }
                        }}
                        className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition-colors font-bold"
                      >
                        Añadir tarjeta
                      </button>
                    </div>
                  )}

                  {tarjetas.length > 0 && !mostrarNuevaTarjeta && (
                    <button
                      type="button"
                      onClick={() => setMostrarNuevaTarjeta(true)}
                      className="flex items-center text-primary hover:text-primary/80 font-sans"
                    >
                      <FaPlus className="mr-2" />
                      Añadir nueva tarjeta
                    </button>
                  )}
                </div>
              )}
            </div>
          </form>
            {/* Botón centrado */}
          <div className="flex justify-center">
            <button 
              type="submit" 
              form="pago-form"
              disabled={procesandoPago || (metodoPago === 'tarjeta' && !tarjetaSeleccionada && !mostrarNuevaTarjeta)}
              className={`w-full max-w-md py-4 px-6 rounded-xl text-white font-bold text-lg transition-colors mt-6 shadow-lg font-sans ${
                procesandoPago || (metodoPago === 'tarjeta' && !tarjetaSeleccionada && !mostrarNuevaTarjeta)
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-[#f7a16c] hover:bg-black focus:ring-4 focus:ring-[#f7a16c]/30'
              }`}
            >
              {procesandoPago ? 'Procesando...' : `Pagar €${reserva.precioTotal}`}
            </button>
          </div>
        </div>
      </section>

      {/* MODAL DE EXTRAS */}
      {mostrarModalExtras && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg w-full relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl"
              onClick={() => setMostrarModalExtras(false)}
              aria-label="Cerrar"
            >
              ×
            </button>
            <div className="relative mb-8">
              <h3 className="font-alcantera-script text-5xl text-primary relative z-10">Servicios</h3>
              <h3 className="font-lorise-sans text-4xl text-gray-900 relative z-10 -mt-8 translate-x-16">extra</h3>
            </div>
            <ul className="divide-y max-h-80 overflow-y-auto">
              {reserva.reservaExtras.map((extra, i) => (
                <li key={i} className="flex justify-between py-2">
                  <span>{extra.extra?.nombre}</span>
                  <span className="font-medium font-sans">€{extra.precioUnitario}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 text-right text-lg font-bold">
              Total: €{reserva.reservaExtras.reduce((acc, extra) => acc + extra.precioUnitario, 0)}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PagoReserva;