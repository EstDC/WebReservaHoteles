import React, { useState } from 'react';
import { useHotelStore } from '../../stores/hotelStore';
import { useTranslation } from 'react-i18next';

const SearchBar = () => {
  const { t } = useTranslation();
  const { filters, setFilters } = useHotelStore();
  const [localFilters, setLocalFilters] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    priceRange: 'all',
    ...filters
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters(localFilters);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSearch} className="bg-white p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            {t('search.location')}
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={localFilters.location}
            onChange={handleChange}
            placeholder={t('search.locationPlaceholder')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700 mb-1">
            {t('search.checkIn')}
          </label>
          <input
            type="date"
            id="checkIn"
            name="checkIn"
            value={localFilters.checkIn}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700 mb-1">
            {t('search.checkOut')}
          </label>
          <input
            type="date"
            id="checkOut"
            name="checkOut"
            value={localFilters.checkOut}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label htmlFor="priceRange" className="block text-sm font-medium text-gray-700 mb-1">
            {t('search.priceRange')}
          </label>
          <select
            id="priceRange"
            name="priceRange"
            value={localFilters.priceRange}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">{t('search.allPrices')}</option>
            <option value="budget">{t('search.budget')}</option>
            <option value="midrange">{t('search.midrange')}</option>
            <option value="luxury">{t('search.luxury')}</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          {t('search.search')}
        </button>
      </div>
    </form>
  );
};

export default SearchBar; 