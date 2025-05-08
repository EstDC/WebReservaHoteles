import { useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';

const cityToHotelId = {
  'Azores': 1,
  'Burdeos': 2,
  'Lisboa': 3,
  'Londres': 4,
  'Menorca': 5, // Menorca (card) -> Mahón (BD)
  'París': 6,
  'Praga': 7,
  'Santander': 8,
  'Santorini': 9, // Santorini (card) -> Oia (BD)
  'Split': 10,
  'Venecia': 11
};

const cities = [
  {
    name: 'Menorca',
    country: 'España',
    image: '/images/img/menorca.webp',
  },
  {
    name: 'Azores',
    country: 'Portugal',
    image: '/images/img/lagoa-do-fogo.jpg',
  },
  {
    name: 'Venecia',
    country: 'Italia',
    image: '/images/img/venecia.jpg',
  },
  {
    name: 'París',
    country: 'Francia',
    image: '/images/img/Parisgallery_51.webp',
  },
  {
    name: 'Londres',
    country: 'Inglaterra',
    image: '/images/img/GettyImages-538093045.jpg',
  },
  {
    name: 'Santorini',
    country: 'Grecia',
    image: '/images/img/grecia-5.jpg',
  },
  {
    name: 'Santander',
    country: 'España',
    image: '/images/img/5816-cantabria-sunrise.jpg',
  },
  {
    name: 'Split',
    country: 'Croacia',
    image: '/images/img/Pesca-en-Croacia.jpg',
  },
  {
    name: 'Burdeos',
    country: 'Francia',
    image: '/images/img/burdeos-plaza-de-la-bolsa-hd.jpg',
  },
  {
    name: 'Lisboa',
    country: 'Portugal',
    image: '/images/img/lisboa.jpg',
  },
  {
    name: 'Praga',
    country: 'República Checa',
    image: '/images/img/praga.jpg',
  },
];

const CitiesCarousel = () => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return;
    const cardWidth = container.querySelector('.city-card')?.offsetWidth || 300;
    const gap = 34;
    const scrollAmount = cardWidth + gap;
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 bg-[#f89c6b]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Título y flechas */}
          <div className="lg:w-[45%] w-full flex flex-col justify-between gap-8 mb-8 lg:mb-0">
            <div>
              <p className="uppercase text-[#3d2c1e] text-lg font-semibold mb-2">Nuestros destinos</p>
              <h2 className="text-4xl md:text-5xl font-bold text-[#2d2320] mb-8 leading-tight">
                Encuéntranos en todo el Reino Unido y Europa
              </h2>
            </div>
            <div className="hidden lg:flex items-center gap-4">
              <button
                aria-label="slide carousel to previous"
                onClick={() => scroll('left')}
                className="w-12 h-12 rounded-full border-2 border-[#3d2c1e] flex items-center justify-center text-[#3d2c1e] hover:bg-[#3d2c1e] hover:text-white transition-colors disabled:opacity-50"
              >
                <FaChevronLeft className="w-6 h-6" />
              </button>
              <button
                aria-label="slide carousel to next"
                onClick={() => scroll('right')}
                className="w-12 h-12 rounded-full border-2 border-[#3d2c1e] flex items-center justify-center text-[#3d2c1e] hover:bg-[#3d2c1e] hover:text-white transition-colors"
              >
                <FaChevronRight className="w-6 h-6" />
              </button>
              <a 
                href="/hotels" 
                className="text-[#3d2c1e] hover:text-[#2d2320] transition-colors font-medium ml-4"
              >
                *Ver todos
              </a>
            </div>
          </div>
          
          {/* Carrusel */}
          <div className="lg:w-[55%] w-full overflow-x-auto scrollbar-hide">
            <div
              ref={scrollRef}
              className="flex gap-[34px] pb-2 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
              style={{ scrollBehavior: 'smooth', cursor: 'grab' }}
            >
              {cities.map((city, idx) => (
                <a
                  key={city.name}
                  href={cityToHotelId[city.name] ? `/hotels/${cityToHotelId[city.name]}` : '/hotels'}
                  className="city-card max-w-[250px] min-w-[218px] w-[218px] flex-shrink-0 flex flex-col justify-between group snap-start"
                  style={{ aspectRatio: '2/3' }}
                >
                  <div className="img-placeholder overflow-hidden aspect-[2/3] rounded-2xl mb-4 transition group-hover:scale-105">
                    <img
                      src={city.image}
                      alt={city.name}
                      className="img-cover w-full h-full object-cover transition group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                  <p className="text-xl font-bold text-[#2d2320] mb-1">{city.name}</p>
                  <p className="uppercase text-xs text-[#3d2c1e] opacity-70 tracking-widest">{city.country}</p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CitiesCarousel; 