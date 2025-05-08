import React from 'react';

export default function HeroVideo() {
  return (
    <section className="relative w-screen h-[80vh] min-h-[400px] max-h-[900px] flex items-center justify-center overflow-hidden m-0 p-0">
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="/video/polynesia.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
        <h1 className="text-white text-4xl md:text-6xl font-bold text-center">
          Descubre tu próximo destino de ensueño
        </h1>
      </div>
      <div className="absolute inset-0 bg-black/30" aria-hidden="true" />
    </section>
  );
} 