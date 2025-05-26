import React, { useEffect, useState } from 'react';
import { useHotelStore } from '../../stores/hotelStore';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import ImageSlider from '../../components/hotel/ImageSlider';
import HotelServicios from './HotelServicios';

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

// Mapeo de id a carpeta para las imágenes de los hoteles
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

const HotelDetails = ({ hotelId }) => {
  const { t } = useTranslation();
  const {
    selectedHotel,
    loading,
    error,
    fetchHotelById
  } = useHotelStore();

  const [rooms, setRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [roomsError, setRoomsError] = useState(null);

  useEffect(() => {
    fetchHotelById(hotelId);
  }, [hotelId]);

  useEffect(() => {
    // Cargar habitaciones del hotel usando el endpoint público
    const fetchRooms = async () => {
      setRoomsLoading(true);
      setRoomsError(null);
      try {
        const response = await axios.get(`http://localhost:8081/api/habitaciones/hotel/${hotelId}`);
        setRooms(response.data);
      } catch (err) {
        setRoomsError('Error al cargar las habitaciones');
      } finally {
        setRoomsLoading(false);
      }
    };
    if (hotelId) {
      fetchRooms();
    }
  }, [hotelId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    );
  }

  if (!selectedHotel) {
    return null;
  }

  // Helper to render stars
  const renderStars = (stars) => {
    if (!stars) return null;
    return (
      <span className="text-yellow-500 text-lg">
        {Array.from({ length: stars }).map((_, i) => '★').join('')}
      </span>
    );
  };

  // Helper to render amenities/services
  const renderAmenities = (amenities) => {
    if (!amenities || !amenities.length) return null;
    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {amenities.map((amenity, idx) => (
          <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
            {typeof amenity === 'object' ? amenity.nombre : amenity}
          </span>
        ))}
      </div>
    );
  };

  // Prefer Spanish field names, fallback to English
  const direccion = selectedHotel.direccion || selectedHotel.address;
  const ubicacion = selectedHotel.ubicacion || selectedHotel.location;
  const ciudad = selectedHotel.ciudad || selectedHotel.city;
  const pais = selectedHotel.pais || selectedHotel.country;
  const estrellas = selectedHotel.estrellas || selectedHotel.stars;
  const servicios = selectedHotel.servicios || selectedHotel.amenities;
  const descripcion = selectedHotel.descripcion || selectedHotel.description;

  // Helper para íconos de amenities
  function getAmenityIcon(amenity) {
    const name = typeof amenity === 'object' ? amenity.nombre?.toLowerCase() : String(amenity).toLowerCase();
    if (name.includes('ducha')) return '🚿';
    if (name.includes('balcón') || name.includes('balcon')) return '🪟';
    if (name.includes('colchón') || name.includes('colchon')) return '🛏️';
    if (name.includes('almohada')) return '🛌';
    if (name.includes('wifi')) return '📶';
    if (name.includes('baño')) return '🛁';
    if (name.includes('aire')) return '❄️';
    if (name.includes('calefacción') || name.includes('calefaccion')) return '🔥';
    if (name.includes('tv') || name.includes('televisión') || name.includes('television')) return '📺';
    if (name.includes('minibar')) return '🥤';
    if (name.includes('secador')) return '💇';
    return '✔️';
  }

  // Función para obtener el párrafo según el tipo de habitación
  function getRoomParagraph(tipo) {
    const t = (tipo || '').toUpperCase();
    if (t.includes('SUITE')) {
      return 'Vive una experiencia exclusiva en nuestra suite, donde el confort y la elegancia se combinan para ofrecerte una estancia inolvidable. Disfruta de amplios espacios, detalles de lujo y un ambiente único pensado para tu máximo bienestar.';
    }
    if (t.includes('SUPERIOR')) {
      return 'Descubre el equilibrio perfecto entre diseño contemporáneo y comodidad en nuestra habitación superior. Un espacio moderno, luminoso y equipado con todo lo necesario para que tu estancia sea especial.';
    }
    // Por defecto, estándar
    return 'Disfruta de una estancia cómoda y elegante en una habitación equipada con todo lo necesario para tu descanso. Diseño actual, detalles cuidados y un ambiente acogedor para una experiencia perfecta.';
  }

  // Devuelve las imágenes para el slider de cada tipo de habitación
  function getImagesForRoom(tipo) {
    const carpeta = carpetasPorId[selectedHotel.id];
    const tipoKey = tipo.toLowerCase().replace(/\s/g, '');
    const images = [];
    for (let i = 1; i <= 4; i++) {
      images.push({
        src: `/images/hotels/${carpeta}/${tipoKey}-${i}.jpg`,
        alt: `${tipo} ${i}`
      });
    }
    return images;
  }

  // --- HERO FUERA DEL CONTENEDOR CENTRADO ---
  const heroSection = (
    <section className="w-screen h-screen flex flex-col md:flex-row p-0 m-0">
      {/* Columna izquierda: descripción */}
      <div className="md:w-1/2 w-full flex items-center justify-center bg-white h-1/2 md:h-full font-helvetica">
        <div className="max-w-xl p-8 text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-normal mb-8">{selectedHotel.tituloDestacado || ''}</h2>
          <p className="text-lg md:text-xl text-gray-800 leading-relaxed whitespace-pre-wrap">
            {descripcion}
          </p>
        </div>
      </div>
      {/* Columna derecha: imagen con overlay y nombre */}
      <div className="md:w-1/2 w-full relative flex items-center justify-start h-1/2 md:h-full">
        <img
          src={`/images/hotels/${carpetasPorId[selectedHotel.id]}/imagentop.jpg`}
          alt={selectedHotel.name || selectedHotel.nombre}
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
          style={{ minHeight: '100%', minWidth: '100%' }}
        />
        {/* Overlay con degradado de izquierda a derecha */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent z-10" />
        {/* Contenido superpuesto */}
        <div className="relative z-20 p-8 flex flex-col items-start justify-center h-full w-full">
          {/* Ubicación */}
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-gray-200 font-helvetica" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 11.5a3 3 0 100-6 3 3 0 000 6z"/><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7-7.5 11-7.5 11s-7.5-4-7.5-11a7.5 7.5 0 1115 0z"/></svg>
            <span className="uppercase text-xs text-gray-200 tracking-wider font-medium">
              {selectedHotel.ciudad || selectedHotel.city}{selectedHotel.pais || selectedHotel.country ? ', ' : ''}{selectedHotel.pais || selectedHotel.country}
            </span>
          </div>
          {/* Nombre del hotel */}
          <div className="relative w-full overflow-visible">
            <div className="relative">
              <h1 className="text-white font-lorise-sans text-9xl md:text-9xl lg:text-8xl leading-tight drop-shadow-lg mb-2">
                {(selectedHotel.name || selectedHotel.nombre).split(' ').slice(0, -1).join(' ')}
              </h1>
              <span className="font-alcantera-script text-white text-9xl absolute -bottom-20 left-[30%] transform -rotate-12">
                {(selectedHotel.name || selectedHotel.nombre).split(' ').pop()}
              </span>
            </div>
          </div>
          {/* Estrellas */}
          <div className="flex gap-1 mt-2">
            {Array.from({ length: selectedHotel.estrellas || selectedHotel.stars || 0 }).map((_, i) => (
              <svg key={i} className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.049 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" /></svg>
            ))}
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <>
      {heroSection}
      <div className="max-w-7xl mx-auto">
        {/* Bloque de datos del hotel refinado */}
        <div className="max-w-7xl mx-auto w-full px-4 md:px-8 mt-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200 bg-white rounded-none">
            {/* Contacto */}
            <div className="flex flex-col items-center md:items-start py-8 px-6">
              <div className="font-alcantera-script text-5xl text-primary mb-6">Contacto</div>
              <a href={`mailto:${selectedHotel.email || 'info@hotel.com'}`} className="flex items-center gap-2 mb-3 text-gray-800 hover:underline font-helvetica">
                <svg className="w-5 h-5 text-[#252525]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" stroke="#252525" strokeWidth="2"/><path d="M3 7l9 6 9-6" stroke="#252525" strokeWidth="2"/></svg>
                <span>{selectedHotel.email || 'info@hotel.com'}</span>
              </a>
              <a href={`tel:${selectedHotel.telefono || selectedHotel.phone || '+34 000 000 000'}`} className="flex items-center gap-2 mb-3 text-gray-800 hover:underline font-helvetica">
                <svg className="w-5 h-5 text-[#252525]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2A19.72 19.72 0 013 5.18 2 2 0 015 3h3a2 2 0 012 1.72c.13 1.13.37 2.23.72 3.28a2 2 0 01-.45 2.11l-1.27 1.27a16 16 0 006.29 6.29l1.27-1.27a2 2 0 012.11-.45c1.05.35 2.15.59 3.28.72A2 2 0 0122 16.92z" /></svg>
                <span>{selectedHotel.telefono || selectedHotel.phone || '+34 000 000 000'}</span>
              </a>
              <div className="text-sm text-gray-600 mb-1 font-helvetica">Check-in <span className="text-primary">15:00</span></div>
              <div className="text-sm text-gray-600 font-helvetica">Check-out <span className="text-primary">12:00</span></div>
            </div>
            {/* Dirección */}
            <div className="flex flex-col items-center md:items-start py-8 px-6">
              <div className="font-alcantera-script text-5xl text-primary mb-6">Dirección</div>
              <div className="text-base text-gray-800 mb-2 text-center md:text-left font-helvetica">
                {selectedHotel.direccion || selectedHotel.address || 'Dirección no disponible'}<br />
                {selectedHotel.ciudad || selectedHotel.city || ''}
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((selectedHotel.direccion || '') + ' ' + (selectedHotel.ciudad || ''))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-primary hover:underline mb-3 font-helvetica"
              >
                <svg width="20" height="20" viewBox="0 0 13 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M6.00078 1.80078C3.62149 1.80078 1.80078 3.59822 1.80078 5.68622C1.80078 6.0752 1.97319 6.70615 2.31982 7.52929C2.65622 8.32814 3.1207 9.22649 3.62508 10.1187C4.47672 11.6253 5.42116 13.0778 6.00074 13.9431C6.58033 13.0776 7.52478 11.6251 8.37649 10.1185C8.88087 9.22629 9.34534 8.32799 9.68175 7.52919C10.0284 6.7061 10.2008 6.07519 10.2008 5.68622C10.2008 3.59822 8.38008 1.80078 6.00078 1.80078ZM5.45348 14.9195C4.93858 14.1634 3.78267 12.4296 2.75454 10.6108C2.24065 9.70176 1.7556 8.76609 1.3982 7.9174C1.04491 7.07844 0.800781 6.28929 0.800781 5.68622C0.800781 2.98807 3.1289 0.800781 6.00078 0.800781C8.87266 0.800781 11.2008 2.98807 11.2008 5.68622C11.2008 6.2893 10.9566 7.0784 10.6034 7.91732C10.246 8.76596 9.76091 9.70158 9.24702 10.6106C8.21889 12.4293 7.0631 14.163 6.54823 14.9193C6.42872 15.0946 6.2223 15.2008 6.00078 15.2008C5.77926 15.2008 5.57299 15.0948 5.45348 14.9195ZM6.00078 4.04541C5.28281 4.04541 4.70078 4.62744 4.70078 5.34541C4.70078 6.06338 5.28281 6.64541 6.00078 6.64541C6.71875 6.64541 7.30078 6.06338 7.30078 5.34541C7.30078 4.62744 6.71875 4.04541 6.00078 4.04541ZM3.70078 5.34541C3.70078 4.07516 4.73053 3.04541 6.00078 3.04541C7.27104 3.04541 8.30078 4.07516 8.30078 5.34541C8.30078 6.61566 7.27104 7.64541 6.00078 7.64541C4.73053 7.64541 3.70078 6.61566 3.70078 5.34541Z" fill="#252525"></path></svg>
                Ver en mapa
              </a>
              <div className="text-sm text-gray-600 mb-1 font-helvetica">0 km desde Playa</div>
              <div className="text-sm text-gray-600 font-helvetica">8 km desde Centro ciudad</div>
            </div>
            {/* Valoraciones */}
            <div className="flex flex-col items-center md:items-start py-8 px-6">
              <div className="font-alcantera-script text-5xl text-primary mb-6">Valoraciones de los viajeros</div>
              <div className="text-3xl font-serif font-bold text-primary mb-2">4.4<span className="text-xl">/5</span></div>
              <div className="flex gap-2 mb-2">
                <span className="w-4 h-4 rounded-full bg-primary inline-block" />
                <span className="w-4 h-4 rounded-full bg-primary inline-block" />
                <span className="w-4 h-4 rounded-full bg-primary inline-block" />
                <span className="w-4 h-4 rounded-full bg-primary inline-block" />
                <span className="w-4 h-4 rounded-full border-2 border-primary inline-block" />
              </div>
              <div className="text-sm text-gray-600 font-helvetica">(1869 opiniones)</div>
            </div>
          </div>
        </div>

        {/* Habitaciones del hotel */}
        <div className="bg-transparent p-0">
          <h2 className="text-2xl font-semibold mb-8">{t('Conoce nuestros 3 tipos de habitación disponible')}</h2>
          {roomsLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : roomsError ? (
            <div className="text-red-500">{roomsError}</div>
          ) : (
            <div>
              {rooms.map((room, idx) => (
                <div key={room.id} className={`bg-white border border-gray-200 rounded-none p-0 md:p-8 mb-16 ${idx === rooms.length - 1 ? '' : 'md:mb-16 mb-10'}`}>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-8 items-stretch">
                    {/* Slider de imágenes de la habitación */}
                    <div className="md:col-span-6 col-span-1 w-full flex items-stretch">
                      <div className="w-full h-full">
                        <ImageSlider 
                          aspectRatio={1.33} // 4:3 ratio
                          images={getImagesForRoom(room.tipo)}
                        />
                      </div>
                    </div>
                    {/* Info de la habitación */}
                    <div className="md:col-span-6 col-span-1 flex flex-col h-full p-4 md:p-4">
                      <div>
                        <h3 className="text-5xl font-lorise-sans font-semibold mb-1 text-primary">{room.tipo}</h3>
                        {/* Subtítulo con detalles y separadores */}
                        <div className="text-xs text-gray-700 uppercase tracking-wider mb-1 flex flex-wrap gap-x-2 gap-y-1">
                          {room.vista && <span>{room.vista}</span>}
                          {room.tipoCama && <span>| {room.tipoCama}</span>}
                          {room.metrosCuadrados && <span>| {room.metrosCuadrados} m²</span>}
                        </div>
                        {/* Subtítulo pequeño (descripción de la tabla) */}
                        <div className="text-5xl text-gray-800 mb-1 font-alcantera-script">{room.descripcion}</div>
                        <div className="h-6" />
                        <p className="text-base md:text-lg text-gray-700 mb-2">
                          {getRoomParagraph(room.tipo)}
                        </p>
                        <div className="h-6" />
                        {/* Amenities fijos */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-2 gap-y-1 mb-1">
                          {FIXED_AMENITIES.map((amenity, i) => (
                            <div key={i} className="flex items-center gap-2 text-gray-700 text-sm">
                              <img src={amenity.icon} alt={amenity.label} className="w-6 h-6 object-contain" />
                              <span>{amenity.label}</span>
                            </div>
                          ))}
                        </div>
                        {/* Capacidad destacada */}
                        <div className="text-sm md:text-base text-gray-800 mb-2 text-center md:text-left">
                          Capacidad: {room.capacidad}
                        </div>
                        <div className="h-6" />
                      </div>
                      {/* Botón reservar y precio siempre abajo */}
                      <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-2 mt-auto pt-2">
                        {/* Caja de precio por noche */}
                        <div className="px-6 py-2 bg-gray-100 border border-gray-400 text-gray-800 text-lg md:text-xl font-bold text-center w-full md:w-auto" style={{minWidth:'120px'}}>
                          {room.precioPorNoche} €/noche
                        </div>
                        {/* Botón reservar */}
                        <button
                            onClick={() => {
                              const user = useHotelStore.getState().user;
                              if (!user) {
                                window.location.href = `/auth/login?redirect=/booking/reserva?roomId=${room.id}&hotelId=${hotelId}`;
                              } else {
                                window.location.href = `/booking/reserva?roomId=${room.id}&hotelId=${hotelId}`;
                              }
                            }}
                            className="bg-primary text-white px-6 py-2 rounded-none hover:bg-black transition-colors font-bold text-lg md:text-xl w-full md:w-auto"
                          >
                          {t('Rerserva ahora')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sección de servicios debajo de las habitaciones */}
        {servicios && servicios.length > 0 && (
          <HotelServicios servicios={servicios} />
        )}

        {/* Galería de instalaciones */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          <div className="relative mb-12">
            <h2 className="font-alcantera-script text-9xl text-primary">Nuestras</h2>
            <h2 className="font-lorise-sans text-7xl absolute -bottom-4 left-[10%]">instalaciones</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Piscina */}
            <div className="relative group">
              <img 
                src={`/images/hotels/${carpetasPorId[selectedHotel.id]}/piscina.jpg`} 
                alt="Piscina del hotel" 
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <h3 className="text-white text-3xl font-lorise-sans">Piscina</h3>
              </div>
            </div>
            {/* Gimnasio */}
            <div className="relative group">
              <img 
                src={`/images/hotels/${carpetasPorId[selectedHotel.id]}/gimnasio.jpg`} 
                alt="Gimnasio del hotel" 
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <h3 className="text-white text-3xl font-lorise-sans">Gimnasio</h3>
              </div>
            </div>
            {/* Restaurante */}
            <div className="relative group">
              <img 
                src={`/images/hotels/${carpetasPorId[selectedHotel.id]}/restaurante.jpg`} 
                alt="Restaurante del hotel" 
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <h3 className="text-white text-3xl font-lorise-sans">Restaurante</h3>
              </div>
            </div>
            {/* Spa */}
            <div className="relative group">
              <img 
                src={`/images/hotels/${carpetasPorId[selectedHotel.id]}/spa.jpg`} 
                alt="Spa del hotel" 
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <h3 className="text-white text-3xl font-lorise-sans">Spa</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HotelDetails; 