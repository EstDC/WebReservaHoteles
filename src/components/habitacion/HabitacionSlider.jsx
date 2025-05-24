import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ANIMATION_DURATION = 0.5;
const AUTO_SLIDE_INTERVAL = 5000;

// Datos de ejemplo - Se usarán si no se proporcionan habitaciones
const habitacionesEjemplo = [
  {
    nombre: "Habitación Deluxe",
    descripcion: "Amplia habitación con vista al mar y todas las comodidades",
    precio: 150,
    imagenPrincipal: "/images/hotels/menorca/94167_1720150068.jpg"
  },
  {
    nombre: "Suite Premium",
    descripcion: "Suite de lujo con jacuzzi y terraza privada",
    precio: 250,
    imagenPrincipal: "/images/hotels/menorca/94167_1720150068.jpg"
  },
  {
    nombre: "Habitación Estándar",
    descripcion: "Habitación confortable con todas las necesidades básicas",
    precio: 100,
    imagenPrincipal: "/images/hotels/menorca/94167_1720150068.jpg"
  }
];

export function HabitacionSlider({ habitaciones = habitacionesEjemplo }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [hovering, setHovering] = useState(false);
  const timeoutRef = useRef();

  // Slider automático
  useEffect(() => {
    if (hovering || habitaciones.length <= 1) return;
    timeoutRef.current = setTimeout(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % habitaciones.length);
    }, AUTO_SLIDE_INTERVAL);
    return () => clearTimeout(timeoutRef.current);
  }, [current, hovering, habitaciones.length]);

  const goTo = (idx, dir) => {
    setDirection(dir);
    setCurrent(idx);
  };

  const nextSlide = () => goTo((current + 1) % habitaciones.length, 1);
  const prevSlide = () => goTo((current - 1 + habitaciones.length) % habitaciones.length, -1);

  if (!habitaciones.length) return null;

  return (
    <div
      className="relative w-full h-[500px] bg-white overflow-hidden"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Contenedor principal del slider */}
      <div className="relative w-full h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: direction * 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -direction * 100 }}
            transition={{ duration: ANIMATION_DURATION }}
            className="absolute inset-0"
          >
            <div className="flex h-full">
              {/* Imagen principal */}
              <div className="w-2/3 h-full relative">
                <img
                  src={habitaciones[current].imagenPrincipal}
                  alt={habitaciones[current].nombre}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
              </div>
              
              {/* Información de la habitación */}
              <div className="w-1/3 h-full bg-white p-8 flex flex-col justify-center">
                <h2 className="text-3xl font-bold mb-4">{habitaciones[current].nombre}</h2>
                <p className="text-gray-600 mb-6">{habitaciones[current].descripcion}</p>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <span className="text-primary font-semibold text-xl">€{habitaciones[current].precio}</span>
                    <span className="text-gray-500 ml-2">/ noche</span>
                  </div>
                  <button className="w-full bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors">
                    Ver detalles
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controles de navegación */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
        <button
          onClick={prevSlide}
          className="w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-lg transition-colors"
          aria-label="Anterior"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex space-x-2">
          {habitaciones.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx, idx > current ? 1 : -1)}
              className={`w-2 h-2 rounded-full transition-colors ${
                idx === current ? 'bg-primary' : 'bg-gray-300'
              }`}
              aria-label={`Ir a la diapositiva ${idx + 1}`}
            />
          ))}
        </div>
        <button
          onClick={nextSlide}
          className="w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-lg transition-colors"
          aria-label="Siguiente"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default HabitacionSlider; 