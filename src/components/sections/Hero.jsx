import { useState } from 'react';

const Hero = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

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
          <small className="block text-lg mb-4 animate-slideInUp">Luxury Hotel Experience</small>
          <h1 className="text-4xl md:text-6xl font-caveat mb-8 animate-slideInUp">
            A unique Experience<br />where to stay
          </h1>

          {/* Booking Form */}
          <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm p-6 rounded-lg">
            <form className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/70"
                  placeholder="Check in"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/70 mt-2"
                  placeholder="Check out"
                />
              </div>
              
              <div className="flex items-center space-x-2 bg-white/20 p-3 rounded-lg">
                <button
                  type="button"
                  onClick={() => setAdults(Math.max(1, adults - 1))}
                  className="text-white"
                >
                  -
                </button>
                <input
                  type="text"
                  value={adults}
                  readOnly
                  className="w-8 text-center bg-transparent text-white"
                />
                <button
                  type="button"
                  onClick={() => setAdults(adults + 1)}
                  className="text-white"
                >
                  +
                </button>
                <span className="text-white">Adults</span>
              </div>

              <div className="flex items-center space-x-2 bg-white/20 p-3 rounded-lg">
                <button
                  type="button"
                  onClick={() => setChildren(Math.max(0, children - 1))}
                  className="text-white"
                >
                  -
                </button>
                <input
                  type="text"
                  value={children}
                  readOnly
                  className="w-8 text-center bg-transparent text-white"
                />
                <button
                  type="button"
                  onClick={() => setChildren(children + 1)}
                  className="text-white"
                >
                  +
                </button>
                <span className="text-white">Children</span>
              </div>

              <button
                type="submit"
                className="bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Search
              </button>
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