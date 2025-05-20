import React, { useEffect, useState } from 'react';
import { useHabitacionStore } from '../../stores/habitacionStore';

const HabitacionFilters = () => {
  const { setFilters, fetchHabitaciones } = useHabitacionStore();
  const [localFilters, setLocalFilters] = useState({
    fechaInicio: '',
    fechaFin: ''
  });

  // Leer parámetros de la URL al montar
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fechaInicio = params.get('fechaInicio') || '';
    const fechaFin = params.get('fechaFin') || '';
    if (fechaInicio && fechaFin) {
      const filtros = { fechaInicio, fechaFin };
      setLocalFilters(filtros);
      setFilters(filtros);
      fetchHabitaciones(filtros);
    }
  }, [setFilters, fetchHabitaciones]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFilters(localFilters);
    await fetchHabitaciones(localFilters);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Buscar habitaciones disponibles</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Fechas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de inicio</label>
          <input
            type="date"
            name="fechaInicio"
            value={localFilters.fechaInicio}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de fin</label>
          <input
            type="date"
            name="fechaFin"
            value={localFilters.fechaFin}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90"
        >
          Buscar
        </button>
      </form>
    </div>
  );
};

export default HabitacionFilters; 