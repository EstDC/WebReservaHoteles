import React, { useState, useCallback, useEffect } from 'react';

const ImageSlider = ({ 
  images, 
  aspectRatio = 1.5,
  autoPlay = false,
  interval = 5000
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  }, [images.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  }, [images.length]);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(nextSlide, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, nextSlide]);

  // Pause auto-play on hover
  const [isPaused, setIsPaused] = useState(false);
  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      if (!isPaused) {
        nextSlide();
      }
    }, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, nextSlide, isPaused]);

  if (!images.length) return null;

  return (
    <div 
      className="relative w-full overflow-hidden" 
      style={{ borderRadius: 0 }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div 
        className="relative w-full h-full"
        style={{ paddingTop: `${(1 / aspectRatio) * 100}%` }}
      >
        {images.map((image, index) => (
          <div 
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-500 ease-in-out ${
              index === currentIndex ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
          >
            <div className="relative w-full h-full">
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover object-center"
                loading="lazy"
                style={{ borderRadius: 0 }}
              />
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          type="button"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 m-0 bg-white/80 hover:bg-white rounded-full shadow-md hover:scale-110 transition-all"
          onClick={prevSlide}
          aria-label="Anterior"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" className="stroke-[#252525]">
            <g fill="none" fillRule="evenodd" strokeLinecap="square" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </g>
          </svg>
        </button>
        <button
          type="button"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 m-0 bg-white/80 hover:bg-white rounded-full shadow-md hover:scale-110 transition-all"
          onClick={nextSlide}
          aria-label="Siguiente"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" className="stroke-[#252525]">
            <g fill="none" fillRule="evenodd" strokeLinecap="square" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </g>
          </svg>
        </button>

        {/* Image Counter */}
        <div className="absolute left-4 bottom-4 z-20">
          <span className="bg-white/90 text-[#252525] text-xs font-light px-3 py-1 rounded-none shadow-none tracking-wide">
            {currentIndex + 1} / {images.length}
          </span>
        </div>

        {/* Dots Navigation */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-white scale-125' : 'bg-white/50'
              }`}
              aria-label={`Ir a imagen ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageSlider;