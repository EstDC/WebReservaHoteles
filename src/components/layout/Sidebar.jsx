import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export function Sidebar() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside className={`bg-white shadow-sm rounded-lg p-4 ${isOpen ? 'w-64' : 'w-16'} transition-all duration-300`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">{t('common.filters')}</h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-500 hover:text-primary"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="space-y-6">
          {/* Filtro de ubicación */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">{t('hotel.location')}</h3>
            <input
              type="text"
              placeholder={t('hotel.searchPlaceholder')}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Filtro de fechas */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">{t('booking.checkIn')}</h3>
            <input
              type="date"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">{t('booking.checkOut')}</h3>
            <input
              type="date"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Filtro de huéspedes */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">{t('booking.guests')}</h3>
            <input
              type="number"
              min="1"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Filtro de precio */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">{t('hotel.price')}</h3>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>0€</span>
                <span>1000€</span>
              </div>
            </div>
          </div>

          {/* Filtro de estrellas */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">{t('hotel.rating')}</h3>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => (
                <label key={stars} className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded text-primary" />
                  <span className="text-gray-600">
                    {Array(stars).fill('★').join('')}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Filtro de servicios */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">{t('hotel.amenities')}</h3>
            <div className="space-y-2">
              {['WiFi', 'Piscina', 'Parking', 'Spa', 'Gimnasio'].map((amenity) => (
                <label key={amenity} className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded text-primary" />
                  <span className="text-gray-600">{amenity}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
} 