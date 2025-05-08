import { useState, useEffect } from 'react';
import { FaTimes, FaBars } from 'react-icons/fa';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header
      className={`fixed w-full z-50 transition-colors duration-300 ${
        scrolled
          ? 'bg-black/90 backdrop-blur-sm'
          : 'bg-transparent'
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
                <li><a href="/ofertas" className="text-white hover:text-primary transition-colors">Ofertas</a></li>
                <li><a href="/contacto" className="text-white hover:text-primary transition-colors">Contacto</a></li>
              </ul>
            </nav>
            <a href="#booking" className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 transition-colors">
              Reservar Ahora
            </a>
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
                <li><a href="/destinos" className="block text-white hover:text-primary transition-colors py-2">Destinos</a></li>
                <li><a href="/ofertas" className="block text-white hover:text-primary transition-colors py-2">Ofertas</a></li>
                <li><a href="/contacto" className="block text-white hover:text-primary transition-colors py-2">Contacto</a></li>
                <li>
                  <a href="#booking" className="block bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 transition-colors text-center">
                    Reservar Ahora
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 