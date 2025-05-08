import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import HotelManagement from './HotelManagement';
import RoomManagement from './RoomManagement';
import BookingManagement from './BookingManagement';
import UserManagement from './UserManagement';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState('hotels');

  const renderContent = () => {
    switch (activeSection) {
      case 'hotels':
        return <HotelManagement />;
      case 'rooms':
        return <RoomManagement />;
      case 'bookings':
        return <BookingManagement />;
      case 'users':
        return <UserManagement />;
      default:
        return null;
    }
  };

  return (
    <div className="flex gap-6">
      {/* Sidebar */}
      <div className="w-64 bg-white rounded-lg shadow-md p-4">
        <nav className="space-y-2">
          <button
            onClick={() => setActiveSection('hotels')}
            className={`w-full text-left px-4 py-2 rounded-md ${
              activeSection === 'hotels'
                ? 'bg-primary text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {t('admin.hotels')}
          </button>
          <button
            onClick={() => setActiveSection('rooms')}
            className={`w-full text-left px-4 py-2 rounded-md ${
              activeSection === 'rooms'
                ? 'bg-primary text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {t('admin.rooms')}
          </button>
          <button
            onClick={() => setActiveSection('bookings')}
            className={`w-full text-left px-4 py-2 rounded-md ${
              activeSection === 'bookings'
                ? 'bg-primary text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {t('admin.bookings')}
          </button>
          <button
            onClick={() => setActiveSection('users')}
            className={`w-full text-left px-4 py-2 rounded-md ${
              activeSection === 'users'
                ? 'bg-primary text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {t('admin.users')}
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white rounded-lg shadow-md p-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard; 