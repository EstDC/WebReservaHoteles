import { FaInstagram, FaWhatsapp, FaTwitter, FaXTwitter } from 'react-icons/fa6';

const Footer = () => {
  return (
    <footer
      className="relative text-white pt-16 pb-8 overflow-hidden"
      style={{
        backgroundImage: "linear-gradient(to bottom, rgba(44, 43, 50, 0.85), #23232a), url('/images/portugal1.jpg')",
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
            <h3 className="text-xl font-bold mb-4">Contacts</h3>
            <p>Baker Street 567, Los Angeles 11023<br />California - US</p>
            <p className="mt-4 font-semibold text-[#e6cfa7]">info@Paradisehotel.com<br />+434 43242232</p>
            <div className="flex gap-4 mt-6 text-2xl">
              <a href="#" className="hover:text-[#b6a179]" aria-label="Instagram"><FaInstagram /></a>
              <a href="#" className="hover:text-[#b6a179]" aria-label="Whatsapp"><FaWhatsapp /></a>
              <a href="#" className="hover:text-[#b6a179]" aria-label="Twitter"><FaTwitter /></a>
              <a href="#" className="hover:text-[#b6a179]" aria-label="X"><FaXTwitter /></a>
            </div>
          </div>
          {/* Enlaces */}
          <div className="md:w-1/3">
            <h3 className="text-xl font-bold mb-4">Explore</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-[#b6a179]">Home</a></li>
              <li><a href="#" className="hover:text-[#b6a179]">About Us</a></li>
              <li><a href="#" className="hover:text-[#b6a179]">Rooms & Suites</a></li>
              <li><a href="#" className="hover:text-[#b6a179]">News & Events</a></li>
              <li><a href="#" className="hover:text-[#b6a179]">Contacts</a></li>
              <li><a href="#" className="hover:text-[#b6a179]">Terms and Conditions</a></li>
            </ul>
          </div>
          {/* Newsletter */}
          <div className="md:w-1/3">
            <h3 className="text-xl font-bold mb-4">Newsletter</h3>
            <form className="flex items-center bg-[#23232a] rounded-lg overflow-hidden mb-3">
              <input
                type="email"
                placeholder="Your email"
                className="bg-transparent px-4 py-3 text-white outline-none flex-1"
              />
              <button type="submit" className="px-4 py-3 text-[#b6a179] hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4l16 8-16 8V4z" />
                </svg>
              </button>
            </form>
            <p className="text-sm text-gray-300">Receive latest offers and promos without spam. You can cancel anytime.</p>
          </div>
        </div>
        <div className="border-t border-[#44434a] pt-6 text-center text-gray-300 text-sm">
          
        </div>
      </div>
      {/* Botón scroll top */}
      <a href="#top" className="fixed bottom-6 right-6 w-12 h-12 rounded-full border-2 border-[#b6a179] flex items-center justify-center bg-[#23232a] text-[#b6a179] hover:bg-[#b6a179] hover:text-[#23232a] transition-colors z-50">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
        </svg>
      </a>
    </footer>
  );
};

export default Footer; 