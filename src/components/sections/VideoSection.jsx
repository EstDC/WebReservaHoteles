import React from 'react';

const VideoSection = () => {
  return (
    <section className="relative h-screen overflow-hidden">
      <div className="absolute inset-0">
        <div className="relative w-full h-full">
          <iframe
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh]"
            src="https://www.youtube.com/embed/Adyd8YqbAPg?autoplay=1&mute=1&controls=0&loop=1&playlist=Adyd8YqbAPg&playsinline=1&showinfo=0&rel=0&modestbranding=1"
            title="Background Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className="absolute inset-0 bg-black/30" />
      </div>
      
      <div className="relative z-10 h-full flex items-center justify-center text-center text-white">
        <div className="container mx-auto px-4">
          <small className="block text-lg mb-4 animate-slideInUp">Luxury Hotel Experience</small>
          <h2 className="text-4xl md:text-6xl font-caveat mb-8 animate-slideInUp">
            Enjoy in a very<br />Immersive Relax
          </h2>
        </div>
      </div>
    </section>
  );
};

export default VideoSection; 