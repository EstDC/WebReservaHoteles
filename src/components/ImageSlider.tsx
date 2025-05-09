import React, { useState, useCallback } from 'react';

interface ImageSliderProps {
  images: {
    src: string;
    alt: string;
  }[];
  aspectRatio?: number;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ 
  images, 
  aspectRatio = 1.5 // Default aspect ratio similar to Melia's images
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

  return (
    <div className="relative w-full overflow-hidden" style={{ borderRadius: 0 }}>
      <div 
        className="relative w-full"
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
        {/* Flecha izquierda */}
        <button
          type="button"
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-0 m-0 bg-transparent border-none outline-none hover:scale-110 transition-transform"
          onClick={prevSlide}
          aria-label="Anterior"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="12" className="stroke-[#252525]">
            <g fill="none" fillRule="evenodd" strokeLinecap="square">
              <path d="M8 0 2 6 8 12M2 6h28" />
            </g>
          </svg>
        </button>
        {/* Flecha derecha */}
        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-0 m-0 bg-transparent border-none outline-none hover:scale-110 transition-transform"
          onClick={nextSlide}
          aria-label="Siguiente"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="12" className="stroke-[#252525] rotate-180">
            <g fill="none" fillRule="evenodd" strokeLinecap="square">
              <path d="M8 0 2 6 8 12M2 6h28" />
            </g>
          </svg>
        </button>
        {/* Contador en la esquina inferior izquierda */}
        <div className="absolute left-4 bottom-4 z-20">
          <span className="bg-white/90 text-[#252525] text-xs font-light px-3 py-1 rounded-none shadow-none tracking-wide">
            {currentIndex + 1} / {images.length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ImageSlider; 