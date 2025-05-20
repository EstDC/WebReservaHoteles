import React, { useState, useEffect } from 'react';
import { useHotelStore } from '../../stores/hotelStore';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { FiMapPin, FiSearch, FiStar } from 'react-icons/fi';

const HotelFilters = () => {
  const { t } = useTranslation();
  const { fetchHotels, setFilters } = useHotelStore();
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
    console.log('Filtros locales antes de enviar:', localFilters);
    setFilters(localFilters);
    await fetchHotels(localFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      nombre: '',
      ciudad: '',
      estrellas: ''
    };
    console.log('Reseteando filtros a:', resetFilters);
    setLocalFilters(resetFilters);
    setFilters(resetFilters);
    fetchHotels(resetFilters);
  };

  return (
    <aside className="bg-[#f8fafc] p-6 rounded-none w-full lg:w-80 flex flex-col gap-8 min-h-[400px] sticky top-4 left-0 z-10 h-fit">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 font-helvetica">Filtrar por</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Ciudad */}
        <div className="flex items-center gap-3">
          <FiMapPin className="text-xl text-primary" />
          <div className="flex-1">
            <label htmlFor="ciudad" className="block text-sm font-semibold text-gray-700 mb-1 font-helvetica">
              Ubicación
            </label>
            <select
              id="ciudad"
              name="ciudad"
              value={localFilters.ciudad}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white font-helvetica"
            >
              <option value="">Selecciona una ciudad</option>
              {ciudades.map((ciudad) => (
                <option key={ciudad} value={ciudad}>{ciudad}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Nombre */}
        <div className="flex items-center gap-3">
          <FiSearch className="text-xl text-primary" />
          <div className="flex-1">
            <label htmlFor="nombre" className="block text-sm font-semibold text-gray-700 mb-1 font-helvetica">
              Buscar hotel
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={localFilters.nombre}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white"
              placeholder="Escribe el nombre del hotel"
            />
          </div>
        </div>

        {/* Estrellas */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FiStar className="text-xl text-primary" />
            <label className="text-sm font-semibold text-gray-700 font-helvetica">Categoría</label>
          </div>
          <div className="flex flex-col items-start gap-2 ml-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleStarClick(star)}
                className={`inline-flex items-center gap-1 px-1 py-1 rounded-md border-2 transition-colors duration-200 text-base font-medium ${localFilters.estrellas === star ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-200 hover:bg-primary/10'}`}
                aria-label={`${star} estrellas`}
              >
                {Array.from({ length: star }).map((_, i) => (
                  <FiStar key={i} className="text-base" />
                ))}
              </button>
            ))}
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-2 mt-2">
          <button
            type="submit"
            className="flex-1 bg-primary text-white py-3 rounded-md text-base font-semibold hover:bg-primary/90 transition-colors font-helvetica"
          >
            Aplicar
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-md text-base font-semibold hover:bg-gray-300 transition-colors font-helvetica"
          >
            Limpiar
          </button>
        </div>
      </form>
    </aside>
  );
};

export default HotelFilters; 