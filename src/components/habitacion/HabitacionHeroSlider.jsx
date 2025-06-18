import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  {
    title: {
      first: 'Hoteles',
      second: 'seleccionados para ti',
    },
    subtitle: 'Para los que buscan algo diferente',
    leftImage: '/images/img/paris23.jpg',
    rightImage: '/images/img/caption.jpg',
  },
  {
    title: {
      first: 'Disfruta',
      second: 'cada instante inolvidable',
    },
    subtitle: 'Descubre destinos únicos',
    leftImage: '/images/img/moto1.jpg',
    rightImage: '/images/img/childresn_20travelling.jpg',
  },
  {
    title: {
      first: 'Siente',
      second: 'la auténtica aventura',
    },
    subtitle: 'Hoteles seleccionados para ti',
    leftImage: '/images/img/yZofQgKMSSxi9Gj6kJYi3a.jpg',
    rightImage: '/images/img/istockphoto-533346433-612x612.jpg',
  },
];

const ANIMATION_DURATION = 1; // segundos
const TEXT_ANIMATION_DURATION = 0.7;
const AUTO_SLIDE_INTERVAL = 6000; // ms

export default function HabitacionHeroSlider() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1); // 1: next, -1: prev
  const [hovering, setHovering] = useState(false);
  const timeoutRef = useRef();
  const exitDirectionRef = useRef(direction);

  useEffect(() => {
    if (hovering) return;
    timeoutRef.current = setTimeout(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % slides.length);
    }, AUTO_SLIDE_INTERVAL);
    return () => clearTimeout(timeoutRef.current);
  }, [current, hovering]);

  const goTo = useCallback((idx, dir) => {
    exitDirectionRef.current = dir;
    setDirection(dir);
    setCurrent(idx);
  }, []);

  const nextSlide = useCallback(() => goTo((current + 1) % slides.length, 1), [current, goTo]);
  const prevSlide = useCallback(() => goTo((current - 1 + slides.length) % slides.length, -1), [current, goTo]);

  return (
    <>
      {/* Layout original SOLO para desktop/tablet */}
      <div className="hidden sm:block">
    <div
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden mb-8 bg-[#f4a574]"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Container principal: botones izquierda, contenido derecha */}
      <div className="flex w-full max-w-[1600px] mx-auto h-screen min-h-[32rem] items-center px-8">
        {/* Dots/indicadores */}
        <div className="flex flex-col items-center justify-center w-24 h-full">
          <div className="flex flex-col space-y-4">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goTo(idx, idx > current ? 1 : -1)}
                className={`w-5 h-5 flex items-center justify-center rounded-full border-2 border-black transition-colors duration-200 ${idx === current ? 'bg-black border-black ring-2 ring-black' : 'bg-transparent border-black'}`}
                aria-label={`Ir a la diapositiva ${idx + 1}`}
              />
            ))}
          </div>
        </div>
         {/* Bloque de imágenes centrado horizontalmente */}
      <div className="w-full flex items-center justify-center h-[80vh] max-h-[700px]">
        <div className="relative flex items-center justify-center" style={{ width: '1100px', height: '500px', maxWidth: '90vw', maxHeight: '60vh' }}>
          {/* Texto animado y estilizado por encima de ambas imágenes */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${current}`}
              initial={{ opacity: 0, y: -60 }}
              animate={{ opacity: 1, y: 0, transition: { duration: TEXT_ANIMATION_DURATION, ease: [0.8, 0, 0.2, 1] } }}
              exit={{ opacity: 0, y: -60, transition: { duration: TEXT_ANIMATION_DURATION, ease: [0.8, 0, 0.2, 1] } }}
              className="absolute top-0 w-full flex flex-col z-30 pt-4"
              style={{ pointerEvents: 'none' }}
            >
              <h2
                className="font-lorise-sans text-6xl md:text-7xl lg:text-8xl leading-tight text-white break-words relative z-10 pl-[15%]"
                style={{ letterSpacing: '-0.05em' }}
              >
                {slides[current].title.first}
              </h2>
              <h2
                className="font-alcantera-script text-6xl md:text-7xl lg:text-8xl leading-tight text-white break-words relative z-20 pl-[20%] -mt-2 md:-mt-10"
              >
                {slides[current].title.second}
              </h2>
            </motion.div>
          </AnimatePresence>
          <AnimatePresence mode="wait" custom={direction}>
            {/* Imagen grande (derecha, arriba) */}
            <motion.div
              key={`right-${current}`}
              custom={direction}
              initial={{ x: direction === 1 ? '100%' : 0, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction === 1 ? 0 : '100%', opacity: 0 }}
              transition={{ duration: ANIMATION_DURATION, ease: [0.8, 0, 0.2, 1] }}
              className="absolute z-10 shadow-2xl rounded-2xl overflow-hidden"
              style={{
                width: '700px',
                height: '420px',
                right: 0,
                top: 0,
                boxShadow: '0 8px 40px 0 rgba(0,0,0,0.18)'
              }}
            >
              <img src={slides[current].rightImage} alt="" className="w-full h-full object-cover" />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(to right, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 60%)'
                }}/>
            </motion.div>
            {/* Imagen pequeña (izquierda, abajo) */}
            <motion.div
              key={`left-${current}`}
              custom={direction}
              initial={{ x: direction === 1 ? '-100%' : 0, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction === 1 ? 0 : '-100%', opacity: 0 }}
              transition={{ duration: ANIMATION_DURATION, ease: [0.8, 0, 0.2, 1] }}
              className="absolute z-20 shadow-2xl rounded-2xl overflow-hidden flex items-end"
              style={{
                width: '480px',
                height: '280px',
                left: 0,
                bottom: 0,
                boxShadow: '0 8px 40px 0 rgba(0,0,0,0.18)',
                // Solapamiento con la imagen grande
                transform: 'translate(80px, 60px)',
              }}
            >
              <img src={slides[current].leftImage} alt="" className="w-full h-full object-cover" />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
        {/* Botones de navegación */}
        <button
          onClick={prevSlide}
          className="absolute left-16 bottom-8 w-12 h-12 rounded-full border-2 border-black flex items-center justify-center text-2xl bg-transparent hover:bg-black hover:text-white transition z-20"
          aria-label="Anterior"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute left-32 bottom-8 w-12 h-12 rounded-full border-2 border-black flex items-center justify-center text-2xl bg-transparent hover:bg-black hover:text-white transition z-20"
          aria-label="Siguiente"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
        </div>
      </div>
      {/* Layout SOLO para móvil */}
      <div className="block sm:hidden">
        <div className="relative w-full min-h-[60vh] flex flex-col items-center justify-center overflow-hidden mb-8 bg-[#f4a574]">
          {/* Texto arriba */}
          <div className="w-full text-center mb-2">
            <h2 className="font-lorise-sans text-2xl leading-tight text-white break-words relative z-10" style={{ letterSpacing: '-0.05em' }}>{slides[current].title.first}</h2>
            <h2 className="font-alcantera-script text-2xl leading-tight text-white break-words relative z-20 -mt-1">{slides[current].title.second}</h2>
          </div>
          {/* Imagen grande */}
          <div className="w-11/12 max-w-xs h-28 rounded-2xl overflow-hidden mb-2">
            <img src={slides[current].rightImage} alt="" className="w-full h-full object-cover" />
          </div>
          {/* Imagen pequeña */}
          <div className="w-8/12 max-w-[120px] h-16 rounded-2xl overflow-hidden -mt-4">
            <img src={slides[current].leftImage} alt="" className="w-full h-full object-cover" />
          </div>
          {/* Dots y botones */}
          <div className="flex flex-col items-center mt-2">
            <div className="flex space-x-2 mb-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx, idx > current ? 1 : -1)}
                  className={`w-3 h-3 flex items-center justify-center rounded-full border-2 border-black transition-colors duration-200 ${idx === current ? 'bg-black border-black ring-2 ring-black' : 'bg-transparent border-black'}`}
              aria-label={`Ir a la diapositiva ${idx + 1}`}
            />
          ))}
        </div>
            <div className="flex space-x-4">
          <button
            onClick={prevSlide}
                className="w-8 h-8 rounded-full border-2 border-black flex items-center justify-center text-xl bg-transparent hover:bg-black hover:text-white transition"
            aria-label="Anterior"
          >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button
            onClick={nextSlide}
                className="w-8 h-8 rounded-full border-2 border-black flex items-center justify-center text-xl bg-transparent hover:bg-black hover:text-white transition"
            aria-label="Siguiente"
          >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
    </div>
      </div>
    </>
  );
} 