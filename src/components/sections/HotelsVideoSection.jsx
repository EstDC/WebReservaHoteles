import React from 'react';

const HotelsVideoSection = () => {
  return (
    <section className="relative w-full h-[400px] overflow-hidden">
      <div className="absolute inset-0">
        <iframe
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh]"
          src="https://www.youtube.com/embed/LBADZm8XJCI?autoplay=1&mute=1&controls=0&loop=1&playlist=LBADZm8XJCI&playsinline=1&showinfo=0&rel=0&modestbranding=1"
          title="Background Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <div className="absolute inset-0 bg-black/30" />

      {/* Contenido */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-4">
        <h2 className="text-8xl md:text-7xl font-lorise-sans mb-6 text-center">
          Descubre el <span className="font-lorise-hand text-primary text-9xl">lujo</span> de viajar
        </h2>
      </div>
    </section>
  );
};

export default HotelsVideoSection; 