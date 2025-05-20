import React, { useState, useEffect } from 'react';
import { FaCreditCard, FaPaypal, FaPlus } from 'react-icons/fa';
import api from '../../utils/api';
import { useHotelStore } from '../../stores/hotelStore';

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

  return (
    <div className="max-w-2xl mx-auto p-6 min-h-screen bg-gray-50">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Resumen de tu Reserva</h2>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Detalles de la Habitación</h3>
        <div className="space-y-2">
          <p><span className="font-medium">Tipo:</span> {reserva.habitacion?.tipo}</p>
          <p><span className="font-medium">Check-in:</span> {parseFecha(reserva.fechaEntrada).toLocaleDateString()}</p>
          <p><span className="font-medium">Check-out:</span> {parseFecha(reserva.fechaSalida).toLocaleDateString()}</p>
          <p><span className="font-medium">Huéspedes:</span> {reserva.numeroHuespedes}</p>
        </div>
        
        {reserva.reservaExtras && reserva.reservaExtras.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-3">Servicios Extra</h3>
            <div className="space-y-1">
              {reserva.reservaExtras.map((extra, index) => (
                <p key={index} className="flex justify-between">
                  <span>{extra.extra?.nombre}</span>
                  <span className="font-medium">€{extra.precioUnitario}</span>
                </p>
              ))}
            </div>
          </div>
        )}
        
        <div className="border-t-2 pt-4 mt-6">
          <h3 className="text-2xl font-bold text-red-600">Total: €{reserva.precioTotal}</h3>
        </div>
      </div>

      <form onSubmit={handlePago} className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Método de Pago</h3>
        
        <div className="space-y-4 mb-6">
          <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              value="tarjeta"
              checked={metodoPago === 'tarjeta'}
              onChange={(e) => setMetodoPago(e.target.value)}
              className="mr-3 text-blue-600"
            />
            <FaCreditCard className="text-gray-600 mr-3" />
            <span>Tarjeta de Crédito/Débito</span>
          </label>
          
          <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              value="paypal"
              checked={metodoPago === 'paypal'}
              onChange={(e) => setMetodoPago(e.target.value)}
              className="mr-3 text-blue-600"
            />
            <FaPaypal className="text-gray-600 mr-3" />
            <span>PayPal</span>
          </label>
        </div>

        {metodoPago === 'tarjeta' && (
          <div className="space-y-4">
            {!mostrarNuevaTarjeta && tarjetas.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700">Selecciona una tarjeta guardada</h4>
                {tarjetas.map((tarjeta) => (
                  <label
                    key={tarjeta.id}
                    className={`flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                      tarjetaSeleccionada?.id === tarjeta.id ? 'border-blue-500 bg-blue-50' : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="tarjeta"
                      checked={tarjetaSeleccionada?.id === tarjeta.id}
                      onChange={() => setTarjetaSeleccionada(tarjeta)}
                      className="mr-3 text-blue-600"
                    />
                    <div>
                      <p className="font-medium">
                        {tarjeta.tipoTarjeta === 'VISA' ? 'Visa' :
                         tarjeta.tipoTarjeta === 'MASTERCARD' ? 'Mastercard' :
                         tarjeta.tipoTarjeta === 'AMERICAN_EXPRESS' ? 'American Express' :
                         tarjeta.tipoTarjeta === 'DINERS_CLUB' ? 'Diners Club' : tarjeta.tipoTarjeta}
                      </p>
                      <p className="text-sm text-gray-600">
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
                  <h4 className="font-medium text-gray-700">Nueva tarjeta</h4>
                  {tarjetas.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setMostrarNuevaTarjeta(false)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Usar tarjeta guardada
                    </button>
                  )}
                </div>
                <select
                  value={nuevaTarjeta.tipoTarjeta}
                  onChange={(e) => setNuevaTarjeta({ ...nuevaTarjeta, tipoTarjeta: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input 
                  type="text" 
                  placeholder="Nombre en la tarjeta" 
                  value={nuevaTarjeta.titular}
                  onChange={(e) => setNuevaTarjeta({ ...nuevaTarjeta, titular: e.target.value })}
                  required 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="flex gap-4">
                  <input 
                    type="text" 
                    placeholder="MM/AA" 
                    value={nuevaTarjeta.fechaExpiracion}
                    onChange={(e) => setNuevaTarjeta({ ...nuevaTarjeta, fechaExpiracion: e.target.value })}
                    required 
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input 
                    type="text" 
                    placeholder="CVC" 
                    value={nuevaTarjeta.cvv}
                    onChange={(e) => setNuevaTarjeta({ ...nuevaTarjeta, cvv: e.target.value })}
                    required 
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {tarjetas.length > 0 && !mostrarNuevaTarjeta && (
              <button
                type="button"
                onClick={() => setMostrarNuevaTarjeta(true)}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <FaPlus className="mr-2" />
                Añadir nueva tarjeta
              </button>
            )}
          </div>
        )}

        <button 
          type="submit" 
          disabled={procesandoPago || (metodoPago === 'tarjeta' && !tarjetaSeleccionada && !mostrarNuevaTarjeta)}
          className={`w-full py-4 px-6 rounded-lg text-white font-bold text-lg transition-colors mt-6 ${
            procesandoPago || (metodoPago === 'tarjeta' && !tarjetaSeleccionada && !mostrarNuevaTarjeta)
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300'
          }`}
        >
          {procesandoPago ? 'Procesando...' : `Pagar €${reserva.precioTotal}`}
        </button>
      </form>
    </div>
  );
};

export default PagoReserva;