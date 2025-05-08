import React, { useState, useEffect } from 'react';
import { useHotelStore } from '../../stores/hotelStore';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const HotelFilters = () => {
  const { t } = useTranslation();
  const { setFilters, fetchHotels } = useHotelStore();
  const [localFilters, setLocalFilters] = useState({
    nombre: '',
    ciudad: '',
    estrellas: ''
  });
  const [ciudades, setCiudades] = useState([]);

  // Obtener ciudades únicas del backend al cargar el componente
  useEffect(() => {
    const fetchCiudades = async () => {
      try {
        // Apuntar al backend real
        const response = await axios.get('http://localhost:8081/api/hoteles');
        const hoteles = response.data;
        // Extraer ciudades únicas
        const uniqueCities = [...new Set(hoteles.map(h => h.ciudad).filter(Boolean))];
        setCiudades(uniqueCities);
      } catch (error) {
        setCiudades([]);
      }
    };
    fetchCiudades();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStarClick = (stars) => {
    setLocalFilters(prev => ({
      ...prev,
      estrellas: prev.estrellas === stars ? '' : stars
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFilters(localFilters);
    await fetchHotels(localFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      nombre: '',
      ciudad: '',
      estrellas: ''
    };
    setLocalFilters(resetFilters);
    setFilters(resetFilters);
    fetchHotels(resetFilters);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">{t('filters.title')}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Ciudad */}
        <div>
          <label htmlFor="ciudad" className="block text-sm font-medium text-gray-700 mb-1">
            {t('filters.location')}
          </label>
          <select
            id="ciudad"
            name="ciudad"
            value={localFilters.ciudad}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">{t('filters.locationPlaceholder')}</option>
            {ciudades.map((ciudad) => (
              <option key={ciudad} value={ciudad}>{ciudad}</option>
            ))}
          </select>
        </div>

        {/* Nombre */}
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
            {t('hotel.searchPlaceholder')}
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={localFilters.nombre}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder={t('hotel.searchPlaceholder')}
          />
        </div>

        {/* Estrellas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('filters.rating')}
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleStarClick(star)}
                className={`px-3 py-1 rounded-md border ${localFilters.estrellas === star ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}
                aria-label={`${star} estrellas`}
              >
                {Array.from({ length: star }).map((_, i) => '★')}
              </button>
            ))}
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-primary text-white py-2 rounded-md hover:bg-primary/90"
          >
            {t('filters.apply')}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300"
          >
            {t('filters.reset')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HotelFilters; 