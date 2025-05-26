import React, { useState } from "react";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from "react-icons/fa";


const ContactInfo = () => {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    e.target.reset();
  };

  return (
    <>
      {/* Primera fila: Info de contacto, centrada y fondo blanco */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 mt-8 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200 bg-white rounded-none">
          {/* Contacto */}
          <div className="flex flex-col items-center md:items-start py-8 px-6">
            <div className="font-alcantera-script text-5xl text-primary mb-6">Contacto</div>
            <a href="mailto:info@habitahub.es" className="flex items-center gap-2 mb-3 text-gray-800 hover:underline font-helvetica">
              <FaEnvelope className="w-5 h-5 text-[#252525]" />
              <span>info@habitahub.es</span>
            </a>
            <a href="tel:+34917894512" className="flex items-center gap-2 mb-3 text-gray-800 hover:underline font-helvetica">
              <FaPhone className="w-5 h-5 text-[#252525]" />
              <span>+34 91 789 45 12</span>
            </a>
            <div className="text-sm text-gray-600 mb-1 font-helvetica">Check-in <span className="text-primary">15:00</span></div>
            <div className="text-sm text-gray-600 font-helvetica">Check-out <span className="text-primary">12:00</span></div>
          </div>
          {/* Dirección */}
          <div className="flex flex-col items-center md:items-start py-8 px-6">
            <div className="font-alcantera-script text-5xl text-primary mb-6">Dirección</div>
            <div className="text-base text-gray-800 mb-2 text-center md:text-left font-helvetica">
              Calle de Alcalá, 123, 28009 Madrid<br />
              España - EU
            </div>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Calle%20de%20Alcal%C3%A1%2C%20123%2C%2028009%20Madrid"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-primary hover:underline mb-3 font-helvetica"
            >
              <FaMapMarkerAlt className="w-5 h-5" />
              Ver en mapa
            </a>
          </div>
          {/* Mapa pequeño */}
          <div className="flex flex-col items-center md:items-start py-8 px-6">
            <div className="font-alcantera-script text-5xl text-primary mb-6">Ubicación</div>
            <div className="w-full h-48 rounded-lg overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3037.5231006472023!2d-3.7031048239421724!3d40.41669615400453!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd42287d6da3df33%3A0x6e6dd5baad28c098!2sCalle%20de%20Alcal%C3%A1%2C%20Madrid%2C%20Spain!5e0!3m2!1sen!2ses!4v1690000000000!5m2!1sen!2ses"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      {/* Segunda fila: Formulario, fondo primario y ocupa todo el ancho */}
      <div className="w-full bg-primary py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            {sent ? (
              <div className="flex flex-col items-center justify-center py-16">
                <h2 className="font-alcantera-script text-5xl text-primary mb-4">¡Gracias por tu mensaje!</h2>
                <p className="text-lg text-gray-700 text-center max-w-xl">
                  Nos pondremos en contacto contigo lo antes posible.
                </p>
              </div>
            ) : (
              <form className="grid grid-cols-1 md:grid-cols-2 gap-8" onSubmit={handleSubmit}>
                {/* Columna izquierda */}
                <div>
                  <div className="relative">
                    <h2 className="font-lorise-sans text-5xl text-gray-900 relative z-10">Mándanos un</h2>
                    <h2 className="font-alcantera-script text-9xl text-primary relative z-10 -mt-16 transform translate-x-28">mensaje</h2>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-helvetica text-gray-700 mb-1">
                      Nombre
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-helvetica text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-helvetica text-gray-700 mb-1">
                      Asunto
                    </label>
                    <input
                      type="text"
                      id="subject"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                      required
                    />
                  </div>
                </div>
                {/* Columna derecha */}
                <div className="flex flex-col h-full">
                  <label htmlFor="message" className="block text-sm font-helvetica text-gray-700 mb-1">
                    Mensaje
                  </label>
                  <textarea
                    id="message"
                    rows="7"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none mb-4 flex-1 resize-none"
                    required
                  ></textarea>
                  <button
                    type="submit"
                    className="w-full bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors mt-auto"
                  >
                    Enviar mensaje
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactInfo;