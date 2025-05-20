import { useState, useEffect } from 'react';
import { FaCreditCard, FaTrash, FaStar, FaPlus, FaUndo } from 'react-icons/fa';
import api from '../../utils/api';
import { useHotelStore } from '../../stores/hotelStore';

const PaymentMethods = () => {
  const { user } = useHotelStore();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddCard, setShowAddCard] = useState(false);
  const [formData, setFormData] = useState({
    tipoTarjeta: 'VISA',
    numeroTarjeta: '',
    titular: '',
    fechaExpiracion: '',
    cvv: ''
  });

  // Cargar tarjetas al montar el componente
  useEffect(() => {
    if (user?.id) {
      fetchCards();
    }
  }, [user]);

  const fetchCards = async () => {
    try {
      setLoading(true);
      setError(null);
      // Cambiamos la URL para obtener todas las tarjetas
      const response = await api.get(`/datos-bancarios/usuario/${user.id}`);
      setCards(response.data);
    } catch (error) {
      console.error('Error al cargar las tarjetas:', error);
      setError('No se pudieron cargar las tarjetas. Por favor, intenta de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCard = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      // Verificar si ya existe una tarjeta inactiva con el mismo número
      const existingCard = cards.find(card => 
        card.numeroTarjeta === formData.numeroTarjeta && !card.activa
      );

      if (existingCard) {
        // Si existe, reactivarla
        await api.put(`/datos-bancarios/${existingCard.id}`, {
          ...existingCard,
          activa: true,
          fechaExpiracion: formData.fechaExpiracion,
          cvv: formData.cvv
        });
      } else {
        // Si no existe, crear nueva
        await api.post(`/datos-bancarios/usuario/${user.id}`, formData);
      }

      setShowAddCard(false);
      setFormData({
        tipoTarjeta: 'VISA',
        numeroTarjeta: '',
        titular: '',
        fechaExpiracion: '',
        cvv: ''
      });
      fetchCards();
    } catch (error) {
      console.error('Error al añadir la tarjeta:', error);
      setError('No se pudo añadir la tarjeta. Por favor, verifica los datos e intenta de nuevo.');
    }
  };

  const handleSetDefault = async (cardId) => {
    try {
      setError(null);
      await api.put(`/datos-bancarios/${cardId}/predeterminada`);
      fetchCards();
    } catch (error) {
      console.error('Error al establecer tarjeta predeterminada:', error);
      setError('No se pudo establecer la tarjeta como predeterminada.');
    }
  };

  const handleDeleteCard = async (cardId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta tarjeta?')) {
      return;
    }
    try {
      setError(null);
      await api.delete(`/datos-bancarios/${cardId}`);
      fetchCards();
    } catch (error) {
      console.error('Error al eliminar la tarjeta:', error);
      setError('No se pudo eliminar la tarjeta. Por favor, intenta de nuevo más tarde.');
    }
  };

  const handleReactivateCard = async (cardId) => {
    try {
      setError(null);
      const card = cards.find(c => c.id === cardId);
      if (card) {
        await api.put(`/datos-bancarios/${cardId}`, {
          ...card,
          activa: true
        });
        fetchCards();
      }
    } catch (error) {
      console.error('Error al reactivar la tarjeta:', error);
      setError('No se pudo reactivar la tarjeta. Por favor, intenta de nuevo más tarde.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="w-8 h-8 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 p-4 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Lista de tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`bg-white p-4 rounded-lg border ${
              card.activa ? 'border-gray-200' : 'border-gray-300 border-dashed'
            } shadow-sm ${!card.activa && 'opacity-75'}`}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <FaCreditCard className={`w-6 h-6 ${card.activa ? 'text-primary' : 'text-gray-400'}`} />
                <div>
                  <p className="font-medium">
                    {card.tipoTarjeta === 'VISA' ? 'Visa' :
                     card.tipoTarjeta === 'MASTERCARD' ? 'Mastercard' :
                     card.tipoTarjeta === 'AMERICAN_EXPRESS' ? 'American Express' :
                     card.tipoTarjeta === 'DINERS_CLUB' ? 'Diners Club' : card.tipoTarjeta}
                  </p>
                  <p className="text-sm text-gray-600">
                    **** **** **** {card.numeroTarjeta.slice(-4)}
                  </p>
                  {!card.activa && (
                    <p className="text-sm text-red-600 mt-1">Tarjeta inactiva</p>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                {card.activa ? (
                  <>
                    <button
                      onClick={() => handleSetDefault(card.id)}
                      className={`p-2 rounded-full ${
                        card.predeterminada
                          ? 'text-yellow-500'
                          : 'text-gray-400 hover:text-yellow-500'
                      }`}
                      title={card.predeterminada ? 'Tarjeta predeterminada' : 'Establecer como predeterminada'}
                    >
                      <FaStar />
                    </button>
                    <button
                      onClick={() => handleDeleteCard(card.id)}
                      className="p-2 text-gray-400 hover:text-red-500 rounded-full"
                      title="Eliminar tarjeta"
                    >
                      <FaTrash />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleReactivateCard(card.id)}
                    className="p-2 text-gray-400 hover:text-primary rounded-full"
                    title="Reactivar tarjeta"
                  >
                    <FaUndo />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Botón para añadir tarjeta */}
      {!showAddCard && (
        <button
          onClick={() => setShowAddCard(true)}
          className="flex items-center space-x-2 text-primary hover:text-primary/90"
        >
          <FaPlus />
          <span>Añadir nueva tarjeta</span>
        </button>
      )}

      {/* Formulario para añadir tarjeta */}
      {showAddCard && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h4 className="text-lg font-medium mb-4">Añadir nueva tarjeta</h4>
          <form onSubmit={handleAddCard} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de tarjeta
              </label>
              <select
                value={formData.tipoTarjeta}
                onChange={(e) => setFormData({ ...formData, tipoTarjeta: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="VISA">Visa</option>
                <option value="MASTERCARD">Mastercard</option>
                <option value="AMERICAN_EXPRESS">American Express</option>
                <option value="DINERS_CLUB">Diners Club</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de tarjeta
              </label>
              <input
                type="text"
                value={formData.numeroTarjeta}
                onChange={(e) => setFormData({ ...formData, numeroTarjeta: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="1234 5678 9012 3456"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titular
              </label>
              <input
                type="text"
                value={formData.titular}
                onChange={(e) => setFormData({ ...formData, titular: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Nombre del titular"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de expiración
                </label>
                <input
                  type="text"
                  value={formData.fechaExpiracion}
                  onChange={(e) => setFormData({ ...formData, fechaExpiracion: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="MM/AA"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  value={formData.cvv}
                  onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="123"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowAddCard(false)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                Guardar tarjeta
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default PaymentMethods; 