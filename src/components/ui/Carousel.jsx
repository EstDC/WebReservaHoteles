import { useState } from 'react';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    title: 'Descubre hoteles únicos',
    subtitle: 'Reserva tu próxima aventura con nosotros',
  },
  {
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80',
    title: 'Escápate a la playa',
    subtitle: 'Ofertas exclusivas en destinos de costa',
  },
  {
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80',
    title: 'Lujo y confort',
    subtitle: 'Hoteles seleccionados para ti',
  },
];

export function Carousel() {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="relative w-full h-72 md:h-96 overflow-hidden rounded-lg shadow-lg mb-8">
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-700 ${idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
            draggable="false"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-start px-8 md:px-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">{slide.title}</h2>
            <p className="text-lg md:text-2xl text-white mb-4 drop-shadow-lg">{slide.subtitle}</p>
          </div>
        </div>
      ))}
      {/* Controles */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 shadow"
        aria-label="Anterior"
      >
        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 shadow"
        aria-label="Siguiente"
      >
        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
      </button>
      {/* Indicadores */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-3 h-3 rounded-full ${idx === current ? 'bg-white' : 'bg-white/50'}`}
            aria-label={`Ir a la diapositiva ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
} 