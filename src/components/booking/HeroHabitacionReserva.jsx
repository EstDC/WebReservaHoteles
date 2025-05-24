import React from 'react';
import ImageSlider from '../../components/ImageSlider';

const FIXED_AMENITIES = [
  { icon: '/images/iconos/shower.png', label: 'Ducha efecto lluvia' },
  { icon: '/images/iconos/terrace.png', label: 'Balcón' },
  { icon: '/images/iconos/double_bed.png', label: 'Colchón Dreammaker' },
  { icon: '/images/iconos/double_bed.png', label: 'Almohada de espuma' },
  { icon: '/images/iconos/bath.png', label: 'Atenciones orgánicas de baño' },
  { icon: '/images/iconos/wifi.png', label: 'Wi-Fi de alta velocidad' },
  { icon: '/images/iconos/hair_dryer.png', label: 'Secador de pelo' },
  { icon: '/images/iconos/phone.png', label: 'Teléfono' },
  { icon: '/images/iconos/224hours.png', label: 'Recepción 24h' },
  { icon: '/images/iconos/tv.png', label: 'TV' },
];

const carpetasPorId = {
  1: "azores",
  2: "burdeos",
  3: "lisboa",
  4: "londres",
  5: "menorca",
  6: "paris",
  7: "praga",
  8: "santander",
  9: "santorini",
  10: "split",
  11: "venecia"
};

function getImagesForRoom(habitacion) {
  console.log('Habitación recibida:', habitacion);
  
  const hotelId = habitacion.hotelId || habitacion.hotel?.id;
  console.log('ID del hotel:', hotelId);
  
  if (!hotelId) {
    console.error('No se encontró ID del hotel en la habitación');
    return [{
      src: '/images/hotels/default-room.jpg',
      alt: 'Imagen por defecto'
    }];
  }

  const carpeta = carpetasPorId[hotelId];
  console.log('Carpeta del hotel:', carpeta);
  
  if (!carpeta) {
    console.error(`No se encontró carpeta para el hotel ID ${hotelId}`);
    return [{
      src: '/images/hotels/default-room.jpg',
      alt: 'Imagen por defecto'
    }];
  }

  const tipoKey = habitacion.tipo.toLowerCase().replace(/\s/g, '');
  console.log('Tipo de habitación:', tipoKey);
  
  const images = [];
  for (let i = 1; i <= 5; i++) {
    const imagePath = `/images/hotels/${carpeta}/${tipoKey}-${i}.jpg`;
    console.log(`Intentando cargar imagen: ${imagePath}`);
    images.push({
      src: imagePath,
      alt: `${habitacion.tipo} ${i}`
    });
  }
  return images;
}

const HeroHabitacionReserva = ({ habitacion }) => {
  console.log('HeroHabitacionReserva - habitacion recibida:', habitacion);
  
  if (!habitacion) {
    console.log('HeroHabitacionReserva - habitacion es null');
    return null;
  }

  const images = getImagesForRoom(habitacion);
  const mainImage = images[0];

  return (
    <section className="w-full flex flex-col md:flex-row p-0 m-0 bg-white">
      {/* Info de la habitación a la izquierda */}
      <div className="md:w-1/2 w-full flex flex-col justify-center p-8 md:p-16">
        <h1 className="text-7xl font-lorise-sans font-semibold mb-1 text-primary">{habitacion.tipo}</h1>
        {habitacion.vista && (
          <div className="text-lg text-gray-600 mb-2">{habitacion.vista}</div>
        )}
        <div className="text-6xl text-gray-800 mb-1 font-alcantera-script">{habitacion.descripcion}</div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 mt-6">
          {FIXED_AMENITIES.map((amenity, i) => (
            <div key={i} className="flex items-center gap-2 text-gray-700 text-base">
              <img src={amenity.icon} alt={amenity.label} className="w-6 h-6 object-contain" />
              <span>{amenity.label}</span>
            </div>
          ))}
        </div>
        <div className="text-lg text-gray-800 mb-2">Capacidad: {habitacion.capacidad}</div>
        <div className="text-2xl font-bold text-primary mb-2">{habitacion.precioPorNoche}€ / noche</div>
      </div>
      {/* Imagen principal a la derecha */}
      <div className="md:w-1/2 w-full relative flex items-center justify-start h-[60vh] md:h-[80vh]">
        <img
          src={mainImage.src}
          alt={mainImage.alt}
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
          style={{ minHeight: '100%', minWidth: '100%' }}
        />
      </div>
    </section>
  );
};

export default HeroHabitacionReserva;
