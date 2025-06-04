import React from 'react';

const VideoSection = () => {
  return (
    <section className="relative h-[480px] sm:h-[500px] md:h-[580px] lg:h-[600px] xl:h-[700px] overflow-hidden">
      <div className="absolute inset-0">
        <div className="relative w-full h-full">
          {/* Fallback image */}
          <img 
            src="/images/img/mountain_index.jpg" 
            alt="Video Background"
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] object-cover"
          />
          <iframe
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh]"
            src="https://www.youtube.com/embed/Adyd8YqbAPg?autoplay=1&mute=1&controls=0&loop=1&playlist=Adyd8YqbAPg&playsinline=1&showinfo=0&rel=0&modestbranding=1&enablejsapi=1&origin=tu-dominio.com"
            title="Background Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </div>
        <div className="absolute inset-0 bg-black/30" />
      </div>
      
      <div className="relative z-10 h-full flex items-center justify-center text-center text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl md:text-7xl font-lorise-sans mb-8 animate-slideInUp font-alcantera-serif">
            Sumérgete en la <span className="font-lorise-hand text-primary font-bold text-6xl md:text-8xl lg:text-9xl">exclusividad</span><br />de nuevos destinos
          </h2>
        </div>
      </div>
    </section>
  );
};

export default VideoSection; 