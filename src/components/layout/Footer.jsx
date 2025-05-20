import { FaInstagram, FaWhatsapp, FaTwitter, FaXTwitter } from 'react-icons/fa6';

const Footer = () => {
  return (
    <footer
      className="relative text-white pt-16 pb-8 overflow-hidden"
      style={{
        backgroundImage: "linear-gradient(to bottom, rgb(55, 54, 61), black)",
        backgroundBlendMode: "overlay",
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row md:justify-between gap-12 md:gap-0 mb-12">
          {/* Contacto */}
          <div className="md:w-1/3">
            <h3 className="text-5xl mb-4 font-alcantera-script text-primary">Contacto</h3>
            <p>Calle de Alcalá, 123, 28009 Madrid<br />España - EU</p>
            <p className="mt-4 font-semibold text-primary font-helvetica">info@habitahub.es<br />+34 91 789 45 12</p>
            <div className="flex gap-4 mt-6 text-2xl">
              <a href="#" className="hover:text-primary" aria-label="Instagram"><FaInstagram /></a>
              <a href="#" className="hover:text-primary" aria-label="Whatsapp"><FaWhatsapp /></a>
              <a href="#" className="hover:text-primary" aria-label="Twitter"><FaTwitter /></a>
              <a href="#" className="hover:text-primary" aria-label="X"><FaXTwitter /></a>
            </div>
          </div>
          {/* Enlaces */}
          <div className="md:w-1/3">
            <h3 className="text-5xl font-alcantera-script text-primary mb-4">Explora</h3>
            <ul className="space-y-2 font-helvetica">
              <li><a href="#" className="hover:text-primary">Inicio</a></li>
              <li><a href="/#about" className="hover:text-primary">Sobre nosotros</a></li>
              <li><a href="/hotels" className="hover:text-primary">Destinos</a></li>
              <li><a href="/contact" className="hover:text-primary">Contacto</a></li>
              <li><a href="#" className="hover:text-primary">Términos y condiciones</a></li>
            </ul>
          </div>
          {/* Newsletter */}
          <div className="md:w-1/3">
            <h3 className="text-5xl font-alcantera-script text-primary mb-4">Newsletter</h3>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const email = e.target.querySelector('input[type="email"]').value;
                if (email) {
                  alert('¡Gracias por suscribirte! Recibirás nuestras mejores ofertas y promociones.');
                  e.target.reset();
                }
              }} 
              className="flex items-center bg-[#23232a] rounded-lg overflow-hidden mb-3 font-helvetica"
            >
              <input
                type="email"
                placeholder="Tú e-mail"
                className="bg-transparent px-4 py-3 text-white outline-none flex-1"
                required
              />
              <button type="submit" className="px-4 py-3 text-primary hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4l16 8-16 8V4z" />
                </svg>
              </button>
            </form>
            <p className="text-sm text-gray-300 font-helvetica">Recibe las últimas ofertas y promociones sin spam. Puedes darte de baja en cualquier momento.</p>
          </div>
        </div>
        <div className="border-t border-[#44434a] pt-6 text-center text-gray-300 text-sm">
          
        </div>
      </div>
      {/* Botón scroll top */}
      <a href="#top" className="fixed bottom-6 right-6 w-12 h-12 rounded-full border-2 border-primary flex items-center justify-center bg-[#23232a] text-primary hover:bg-primary hover:text-[#23232a] transition-colors z-50">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
        </svg>
      </a>
    </footer>
  );
};

export default Footer; 