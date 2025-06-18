import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { roomService } from '../../services/roomService';
import { adminService } from '../../services/adminService';

const carpetasPorId = {
  1: "azores",
  2: "burdeos",
  3: "lisboa",
  4: "londres",
  5: "menorca",
  6: "paris",
  7: "praga",
  8: "santander",
  9: "santorini",
  10: "split",
  11: "venecia"
};

function getMainImage(habitacion) {
  const hotelId = habitacion.hotel?.id;
  if (!hotelId) return '/images/hotels/default-room.jpg';
  const carpeta = carpetasPorId[hotelId];
  if (!carpeta) return '/images/hotels/default-room.jpg';
  const tipoKey = habitacion.tipo?.toLowerCase().replace(/\s/g, '');
  if (!tipoKey) return '/images/hotels/default-room.jpg';
  return `/images/hotels/${carpeta}/${tipoKey}-1.jpg`;
}

function renderStars(estrellas) {
  if (!estrellas || isNaN(estrellas)) return null;
  return (
    <div className="flex items-center mb-2">
      {Array.from({ length: estrellas }).map((_, i) => (
        <span key={i} className="text-yellow-400 text-lg">★</span>
      ))}
    </div>
  );
}

const RoomManagement = () => {
  const { t } = useTranslation();
  const [rooms, setRooms] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [formData, setFormData] = useState({
    tipo: '',
    descripcion: '',
    capacidad: '',
    precioPorNoche: '',
    hotelId: '',
    vista: '',
    tipoCama: '',
    metrosCuadrados: ''
  });

  // Estadísticas
  const [stats, setStats] = useState({
    totalRooms: 0,
    availableRooms: 0,
    roomTypes: {},
    averagePrices: {},
    occupancyByType: {},
    totalValue: 0,
    totalCapacity: 0
  });

  useEffect(() => {
    loadHotels();
    loadRooms();
  }, []);

  const loadHotels = async () => {
    try {
      const data = await adminService.getAllHotels();
      setHotels(data);
    } catch (err) {
      console.error('Error loading hotels:', err);
      setError(err.message);
    }
  };

  const loadRooms = async () => {
    try {
      setLoading(true);
      const data = await roomService.getRooms();
      setRooms(data);
      
      // Calcular estadísticas
      const roomTypes = {};
      const averagePrices = {};
      const occupancyByType = {};
      let totalValue = 0;
      let totalCapacity = 0;

      data.forEach(room => {
        // Contar tipos de habitación
        roomTypes[room.tipo] = (roomTypes[room.tipo] || 0) + 1;
        
        // Calcular precios promedio por tipo
        if (!averagePrices[room.tipo]) {
          averagePrices[room.tipo] = {
            sum: 0,
            count: 0
          };
        }
        averagePrices[room.tipo].sum += parseFloat(room.precioPorNoche);
        averagePrices[room.tipo].count += 1;

        // Calcular ocupación por tipo
        if (!occupancyByType[room.tipo]) {
          occupancyByType[room.tipo] = {
            total: 0,
            available: 0
          };
        }
        occupancyByType[room.tipo].total += 1;
        if (room.disponible) {
          occupancyByType[room.tipo].available += 1;
        }

        // Sumar al valor total y capacidad
        totalValue += parseFloat(room.precioPorNoche);
        totalCapacity += parseInt(room.capacidad);
      });

      // Calcular promedios finales
      Object.keys(averagePrices).forEach(type => {
        averagePrices[type] = (averagePrices[type].sum / averagePrices[type].count).toFixed(2);
      });

      setStats({
        totalRooms: data.length,
        availableRooms: data.filter(room => room.disponible).length,
        roomTypes,
        averagePrices,
        occupancyByType,
        totalValue: totalValue.toFixed(2),
        totalCapacity
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (room = null) => {
    if (room) {
      setSelectedRoom(room);
      setFormData({
        tipo: room.tipo,
        descripcion: room.descripcion,
        capacidad: room.capacidad,
        precioPorNoche: room.precioPorNoche,
        hotelId: room.hotelId,
        vista: room.vista,
        tipoCama: room.tipoCama,
        metrosCuadrados: room.metrosCuadrados
      });
    } else {
      setSelectedRoom(null);
      setFormData({
        tipo: '',
        descripcion: '',
        capacidad: '',
        precioPorNoche: '',
        hotelId: '',
        vista: '',
        tipoCama: '',
        metrosCuadrados: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRoom(null);
    setFormData({
      tipo: '',
      descripcion: '',
      capacidad: '',
      precioPorNoche: '',
      hotelId: '',
      vista: '',
      tipoCama: '',
      metrosCuadrados: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (selectedRoom) {
        await roomService.updateRoom(selectedRoom.id, formData);
      } else {
        await roomService.createRoom(formData);
      }
      await loadRooms();
      handleCloseModal();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('admin.confirmDelete'))) {
      return;
    }

    try {
      setLoading(true);
      await roomService.deleteRoom(id);
      await loadRooms();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Panel de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total de Habitaciones</h3>
          <p className="text-2xl font-bold text-primary">{stats.totalRooms}</p>
          <p className="text-sm text-gray-500 mt-1">Capacidad total: {stats.totalCapacity}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Habitaciones Disponibles</h3>
          <p className="text-2xl font-bold text-green-600">{stats.availableRooms}</p>
          <p className="text-sm text-gray-500 mt-1">Valor total: {stats.totalValue}€</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Tipos de Habitación</h3>
          <div className="mt-2 space-y-2">
            {Object.entries(stats.roomTypes).map(([type, count]) => (
              <div key={type} className="border-b border-gray-100 pb-2 last:border-0">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{type}</span>
                  <span>{count}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Precio medio: {stats.averagePrices[type]}€</span>
                  <span>
                    Disponibles: {stats.occupancyByType[type].available}/{stats.occupancyByType[type].total}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lista de habitaciones */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Habitaciones</h2>
        <button
          onClick={() => handleOpenModal()}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
        >
          Añadir Habitación
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => {
            const imagePath = getMainImage(room);
            const hotel = room.hotel || {};
            return (
              <div key={room.id} className="bg-white rounded-lg shadow-md flex flex-col overflow-hidden">
                <div className="relative">
                  <img
                    src={imagePath}
                    alt={room.tipo}
                    className="w-full h-48 object-cover rounded-t-lg"
                    onError={e => { e.target.src = '/images/hotels/default-room.jpg'; }}
                  />
                  <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-sm font-medium ${
                    room.disponible 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {room.disponible ? 'Disponible' : 'No disponible'}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-2xl font-bold mb-1 text-gray-900">{hotel.nombre || 'Hotel desconocido'}</h3>
                  <div className="text-gray-600 mb-1">{hotel.ciudad}{hotel.ciudad && hotel.pais ? ', ' : ''}{hotel.pais}</div>
                  {renderStars(hotel.estrellas)}
                  <div className="text-base text-primary font-semibold mb-1">{room.tipo}</div>
                  <p className="text-gray-700 mb-2 flex-1">{room.descripcion}</p>
                  <div className="text-gray-600 mb-1">Capacidad: {room.capacidad}</div>
                  <div className="text-lg font-bold text-primary mb-2">{room.precioPorNoche}€ / noche</div>
                  
                  {room.fechasOcupadas && room.fechasOcupadas.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-1">Fechas ocupadas:</p>
                      <div className="text-sm text-gray-600">
                        {room.fechasOcupadas.map((fecha, index) => (
                          <div key={index} className="flex items-center">
                            <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                            {new Date(fecha).toLocaleDateString()}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end space-x-2 mt-4">
                    <button
                      onClick={() => handleOpenModal(room)}
                      className="bg-primary text-white py-2 px-4 rounded hover:bg-primary/90 transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(room.id)}
                      className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de edición/creación */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">
              {selectedRoom ? 'Editar Habitación' : 'Añadir Habitación'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="hotelId" className="block text-sm font-medium text-gray-700">
                  Hotel
                </label>
                <select
                  id="hotelId"
                  name="hotelId"
                  value={formData.hotelId}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Seleccionar Hotel</option>
                  {hotels.map(hotel => (
                    <option key={hotel.id} value={hotel.id}>
                      {hotel.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="tipo" className="block text-sm font-medium text-gray-700">
                  Tipo
                </label>
                <input
                  type="text"
                  id="tipo"
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
                  Descripción
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  required
                  rows="3"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="capacidad" className="block text-sm font-medium text-gray-700">
                    Capacidad
                  </label>
                  <input
                    type="number"
                    id="capacidad"
                    name="capacidad"
                    value={formData.capacidad}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label htmlFor="precioPorNoche" className="block text-sm font-medium text-gray-700">
                    Precio por Noche
                  </label>
                  <input
                    type="number"
                    id="precioPorNoche"
                    name="precioPorNoche"
                    value={formData.precioPorNoche}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="vista" className="block text-sm font-medium text-gray-700">
                    Vista
                  </label>
                  <input
                    type="text"
                    id="vista"
                    name="vista"
                    value={formData.vista}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label htmlFor="tipoCama" className="block text-sm font-medium text-gray-700">
                    Tipo de Cama
                  </label>
                  <input
                    type="text"
                    id="tipoCama"
                    name="tipoCama"
                    value={formData.tipoCama}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="metrosCuadrados" className="block text-sm font-medium text-gray-700">
                  Metros Cuadrados
                </label>
                <input
                  type="number"
                  id="metrosCuadrados"
                  name="metrosCuadrados"
                  value={formData.metrosCuadrados}
                  onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                >
                  {selectedRoom ? 'Guardar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomManagement; 