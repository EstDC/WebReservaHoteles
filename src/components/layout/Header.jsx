import { useState, useEffect } from 'react';
import { FaTimes, FaBars, FaUser } from 'react-icons/fa';
import { useHotelStore } from '../../stores/hotelStore';

const Header = ({ transparent = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useHotelStore();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-black/90 backdrop-blur-sm'
          : (transparent ? 'bg-transparent' : 'bg-black/20 backdrop-blur-sm')
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="w-32">
            <a href="/" className="block">
              <img src="/img/logo.png" alt="Hotel Logo" className="h-12" />
            </a>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <nav>
              <ul className="flex space-x-8">
                <li><a href="/" className="text-white hover:text-primary transition-colors">Inicio</a></li>
                <li><a href="/hotels" className="text-white hover:text-primary transition-colors">Destinos</a></li>
                <li><a href="/contact" className="text-white hover:text-primary transition-colors">Contacto</a></li>
              </ul>
            </nav>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <div className="flex items-center space-x-2 text-white">
                    <FaUser className="text-primary" />
                    <span>{user.email}</span>
                  </div>
                  <a href="/account" className="text-white hover:text-primary transition-colors">
                    Mi Cuenta
                  </a>
                  <button
                    onClick={handleLogout}
                    className="text-white hover:text-primary transition-colors"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <>
                  <a 
                    href="/auth/login" 
                    className="text-white hover:text-primary transition-colors"
                  >
                    Iniciar Sesión
                  </a>
                  <a 
                    href="/auth/register" 
                    className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 transition-colors"
                  >
                    Registrarse
                  </a>
                </>
              )}
            </div>
          </div>

          <button
            className="md:hidden text-white"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-black/95 z-50 pt-20">
            <nav className="container mx-auto px-4">
              <ul className="space-y-4">
                <li><a href="/" className="block text-white hover:text-primary transition-colors py-2">Inicio</a></li>
                <li><a href="/hotels" className="block text-white hover:text-primary transition-colors py-2">Destinos</a></li>
                <li><a href="/contacto" className="block text-white hover:text-primary transition-colors py-2">Contacto</a></li>
                {user ? (
                  <>
                    <li className="border-t border-gray-700 pt-4">
                      <div className="flex items-center space-x-2 text-white py-2">
                        <FaUser className="text-primary" />
                        <span>{user.email}</span>
                      </div>
                    </li>
                    <li>
                      <a href="/account" className="block text-white hover:text-primary transition-colors py-2">
                        Mi Cuenta
                      </a>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left text-white hover:text-primary transition-colors py-2"
                      >
                        Cerrar Sesión
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <a href="/auth/login" className="block text-white hover:text-primary transition-colors py-2">
                        Iniciar Sesión
                      </a>
                    </li>
                    <li>
                      <a href="/auth/register" className="block bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 transition-colors text-center">
                        Registrarse
                      </a>
                    </li>
                  </>
                )}
              </ul>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 