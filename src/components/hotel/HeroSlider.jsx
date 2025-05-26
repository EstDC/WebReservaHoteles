import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  {
    category: 'Verano / Inspiración',
    title: {
      first: 'El verano a un',
      second: 'paso de ti'
    },
    subtitle: 'Para los que buscan algo diferente',
    leftImage: '/images/img/shutterstock_19540719667.jpg',
    rightImage: '/images/img/6819717f0791d11ac2d86065_2D1A2199LR.jpg',
    footer: 'Para: HotelFinder',
  },
  {
    category: 'Aventura / Naturaleza',
    title: {
      first: 'Ve el mundo de',
      second: 'otra manera'
    },
    subtitle: 'Descubre destinos únicos',
    leftImage: '/images/img/07626.jpg',
    rightImage: '/images/img/AdobeStock_408810925-1500x1000.jpeg',
    footer: 'Para: HotelFinder',
  },
  {
    category: 'Lujo / Relax',
    title: {
      first: 'Tu escapada',
      second: 'perfecta'
    },
    subtitle: 'Hoteles seleccionados para ti',
    leftImage: '/images/img/boat1.jpg',
    rightImage: '/images/img/BNE Airport_Travelling with a group_Choose the right travel companions_Image by Shutterstock_MAIN.jpg',
    footer: 'Para: HotelFinder',
  },
];

const ANIMATION_DURATION = 1; // segundos
const TEXT_ANIMATION_DURATION = 0.6; // segundos, solo para el texto
const AUTO_SLIDE_INTERVAL = 5000; // ms

export function SliderRelleno() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1); // 1: next, -1: prev
  const [hovering, setHovering] = useState(false);
  const timeoutRef = useRef();
  const wheelTimeoutRef = useRef();
  const sliderRef = useRef();
  const [wheelLock, setWheelLock] = useState(false);
  const exitDirectionRef = useRef(direction);

  // Slider automático
  useEffect(() => {
    if (hovering) return;
    timeoutRef.current = setTimeout(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % slides.length);
    }, AUTO_SLIDE_INTERVAL);
    return () => clearTimeout(timeoutRef.current);
  }, [current, hovering]);

  // Animaciones para los wrappers
  const variantsWrapper = {
    enter: (dir) => ({ y: dir === 1 ? '-100%' : '100%' }),
    center: { y: '0%', transition: { duration: ANIMATION_DURATION, ease: [0.8, 0, 0.2, 1] } },
    exit: (dir) => ({ y: dir === 1 ? '100%' : '-100%', transition: { duration: ANIMATION_DURATION, ease: [0.8, 0, 0.2, 1] } }),
  };

  // Animación del subrayado
  const underlineVariants = {
    initial: { scaleX: 0 },
    hover: { scaleX: 1, transition: { duration: 0.5, ease: 'easeInOut' } },
  };

  // Animación del + en hover
  const plusVariants = {
    initial: { opacity: 0 },
    hover: { opacity: 1, transition: { duration: 0.4 } },
  };

  const goTo = useCallback((idx, dir) => {
    exitDirectionRef.current = dir;
    setDirection(dir);
    setCurrent(idx);
  }, []);

  const nextSlide = useCallback(() => goTo((current + 1) % slides.length, 1), [current, goTo]);
  const prevSlide = useCallback(() => goTo((current - 1 + slides.length) % slides.length, -1), [current, goTo]);

  
  // Índices sincronizados e invertidos
  const leftIndex = slides.length - 1 - current;
  const rightIndex = current;

  return (
    <div
      ref={sliderRef}
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden mb-8 bg-[#f4a574]"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Container principal: botones izquierda, contenido derecha */}
      <div className="flex w-full max-w-[1600px] mx-auto h-screen min-h-[32rem] items-center px-8">
        {/* Botones/indicadores */}
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
        {/* Contenido visual (izquierda: img+letras, derecha: img derecha) */}
        <div className="flex w-full h-full items-center">
          {/* Wrapper izquierdo: imagen izquierda + letras alineadas */}
          <div className="flex flex-col items-end justify-center h-full w-1/3 ml-8 relative overflow-visible">
            <AnimatePresence mode="wait">
              <motion.div
                key={leftIndex}
                initial={{ y: '-100%' }}
                animate={{ y: 0, transition: { duration: ANIMATION_DURATION, ease: [0.8, 0, 0.2, 1] } }}
                exit={{ y: '100%', transition: { duration: ANIMATION_DURATION, ease: [0.8, 0, 0.2, 1] } }}
                className="absolute top-0 left-0 w-full h-full flex flex-col items-end justify-center"
                style={{ willChange: 'transform' }}
              >
                <div className="flex flex-row items-center h-full relative">
                  <div className="flex flex-col items-center justify-center relative">
                    <div
                      className="bg-gray-300 w-56 h-36 md:w-96 md:h-80 z-10 shadow-lg relative cursor-pointer group"
                      style={{ borderRadius: '0.5rem', overflow: 'hidden' }}
                    >
                      <img src={slides[leftIndex].leftImage} alt="" className="w-full h-full object-cover group-hover:brightness-75 transition duration-300" />
                      {/* Overlay con degradado */}
                      <div className="absolute inset-0 bg-gradient-to-l from-black/40 to-transparent" />
                      {/* Overlay + animación + */}
                      <motion.div
                        variants={plusVariants}
                        initial="initial"
                        whileHover="hover"
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                      >
                        <svg width="48" height="48" viewBox="0 0 48 48">
                          <motion.line x1="24" y1="10" x2="24" y2="38" stroke="#fff" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} />
                          <motion.line x1="10" y1="24" x2="38" y2="24" stroke="#fff" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.2 }} />
                        </svg>
                      </motion.div>
                    </div>
                  </div>
                  {/* Letras animadas con delay, centradas verticalmente respecto a la imagen */}
                  <motion.div
                    key={leftIndex}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{
                      opacity: [0, 0, 0.15, 0.25, 0.5, 1],
                      x: 140,
                      transition: {
                        duration: TEXT_ANIMATION_DURATION,
                        delay: ANIMATION_DURATION * 0.9,
                        times: [0, 0.1, 0.2, 0.3, 0.5, 1],
                        ease: "linear"
                      }
                    }}
                    exit={{ opacity: 0, x: 160, transition: { duration: TEXT_ANIMATION_DURATION, ease: [0.8, 0, 0.2, 1] } }}
                    className="absolute z-10 right-0 bottom-[25%] -translate-y-1/2 w-96 aspect-square flex items-center justify-center"
                  >
                    <div className="relative">
                      <motion.h2
                        className="font-lorise-sans text-9xl md:text-8xl leading-tight text-white break-words text-center relative z-10"
                        style={{ letterSpacing: '-0.05em', transform: 'translateX(-20px)' }}
                      >
                        {slides[leftIndex].title.first}
                      </motion.h2>
                      <motion.h2
                        className="font-alcantera-script text-9xl md:text-9xl leading-tight text-white break-words text-center -mt-8 md:-mt-12 relative z-20 transform translate-x-12 md:translate-x-16">
                        {slides[leftIndex].title.second}
                      </motion.h2>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          {/* Wrapper derecho: imagen derecha centrada verticalmente */}
          <div className="w-2/3 flex items-center justify-end h-full overflow-hidden">
            <div className="relative w-[90%] max-w-[80%] h-80 md:h-[36rem] rounded-lg overflow-hidden shadow-lg">
              <AnimatePresence mode="wait">
                <motion.img
                  key={rightIndex}
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '-100%' }}
                  src={slides[rightIndex].rightImage}
                  alt=""
                  className="w-full h-full object-cover"
                  transition={{ duration: ANIMATION_DURATION, ease: [0.8, 0, 0.2, 1] }}
                  style={{ position: 'absolute' }}
                />
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
      {/* Controles */}
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
  );
}

export default function HeroSlider() {
  return (
    <div className="bg-[#f4a574] w-full py-12">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div>
          <p className="font-semibold text-lg uppercase mb-2">NUESTROS DESTINOS</p>
          <h1 className="font-bold text-5xl md:text-6xl mb-6 leading-tight">
            Encuéntranos en todo el<br />Reino Unido y Europa
          </h1>
          <div className="flex items-center mt-4">
            <button className="w-12 h-12 rounded-full border-2 border-black flex items-center justify-center text-2xl mr-2 bg-transparent hover:bg-black hover:text-white transition">
              &#8592;
            </button>
            <button className="w-12 h-12 rounded-full border-2 border-black flex items-center justify-center text-2xl bg-transparent hover:bg-black hover:text-white transition">
              &#8594;
            </button>
            <span className="ml-4 text-base">*Ver todos</span>
          </div>
        </div>
        <div className="mt-8 md:mt-0 md:ml-8 flex flex-col items-end">
          <img src="/images/hotels/menorca/94167_1720150068.jpg" alt="Menorca" className="rounded-xl w-72 h-96 object-cover" />
          <div className="mt-2 text-right">
            <p className="font-bold text-lg">Menorca</p>
            <p className="uppercase text-sm text-gray-700">ESPAÑA</p>
          </div>
        </div>
      </div>
    </div>
  );
} 