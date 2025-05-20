import { useState } from 'react';

const Hero = () => {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (!fechaInicio || !fechaFin) return;
    const searchParams = new URLSearchParams({
      fechaInicio,
      fechaFin
    });
    window.location.href = `/search?${searchParams.toString()}`;
  };

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <div className="relative w-full h-full">
          <iframe
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh]"
            src="https://www.youtube.com/embed/dYNocze1pdU?autoplay=1&mute=1&controls=0&loop=1&playlist=dYNocze1pdU&playsinline=1&showinfo=0&rel=0&modestbranding=1"
            title="Background Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center text-center text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-lorise-sans mb-8 animate-slideInUp">
            Una experiencia <span className="font-lorise-hand text-primary font-bold text-9xl">única</span><br />donde alojarse
          </h1>

          {/* Booking Form */}
          <div className="max-w-md mx-auto bg-white/10 backdrop-blur-sm p-6 rounded-lg">
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-helvetica text-white mb-1">Fecha de inicio</label>
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={e => setFechaInicio(e.target.value)}
                  className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/70"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-helvetica text-white mb-1">Fecha de fin</label>
                <input
                  type="date"
                  value={fechaFin}
                  onChange={e => setFechaFin(e.target.value)}
                  className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/70"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-helvetica"
                >
                  Buscar
                </button>
              </div>
            </form>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
            <a href="#about" className="block animate-bounce">
              <div className="w-6 h-10 border-2 border-white rounded-full flex items-center justify-center">
                <div className="w-1 h-4 bg-white rounded-full" />
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 