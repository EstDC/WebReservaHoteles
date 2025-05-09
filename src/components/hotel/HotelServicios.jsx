import React from "react";

// Mapea el nombre del servicio al nombre del icono en tu carpeta
const ICONOS_SERVICIOS = {
  "Parking":                            "/images/iconos/parking.png",
  "WiFi":                               "/images/iconos/wifi.png",
  "Spa":                                "/images/iconos/bath.png",
  "Piscina":                            "/images/iconos/pool.png",
  "Gimnasio":                           "/images/iconos/6fitness.png",
  "Restaurante":                        "/images/iconos/restautannte.svg",
  "Consigna":                           "/images/iconos/suitcase.png",
  "Guardería":                          "/images/iconos/familia.svg",
  "Bodega":                             "/images/iconos/cesta.svg",
  "Eventos privados":                   "/images/iconos/eventos.svg",
  "Instalaciones para huéspedes con problemas de movilidad": "/images/iconos/adaptado.svg",
  "Habitaciones adaptadas y accesibles":"/images/iconos/habitacionadaptada.svg",
  "Punto de recarga para coches eléctricos":"/images/iconos/recargacoche.svg",
  "Zonas exteriores":                   "/images/iconos/exterior.svg",
  "Belleza y bienestar":                "/images/iconos/bienestar.svg",
  "Familias y niños":                   "/images/iconos/familia.svg",
  "Actividades deportivas":             "/images/iconos/6fitness.png",
  "En las inmediaciones":               "/images/iconos/informacion.svg",
  "Entretenimiento":                    "/images/iconos/tv.png",
  "Accesibilidad":                      "/images/iconos/adaptado.svg",
  "Instalaciones de negocios":          "/images/iconos/negocios.svg",
  "Mascotas":                           "/images/iconos/mascotas.svg",
  "Sostenibilidad":                     "/images/iconos/ecologico.svg",
  "Zonas comunes":                      "/images/iconos/terrace.png",
  "Servicios de recepción":             "/images/iconos/bell.png",
  "Seguridad":                          "/images/iconos/seguridad.svg",
  "Servicios de limpieza":              "/images/iconos/washing_machine.png",
  "Tipos de pensión":                   "/images/iconos/double_bed.png",
  "Formas de pago aceptadas en el hotel":"/images/iconos/tarjeta.svg",
  "Tiendas":                            "/images/iconos/cesta.svg",
};

const HotelServicios = ({ servicios }) => (
  <section className="max-w-5xl mx-auto my-12 px-4">
    <h2 className="text-2xl md:text-3xl font-bold mb-2">Servicios e instalaciones</h2>
    <p className="text-gray-500 mb-8">
      Descubre la amplia gama de servicios e instalaciones que garantizan una estancia de lo más agradable y cómoda en nuestro hotel.
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {servicios.map((servicio, idx) => {
        const nombre = typeof servicio === "object" ? servicio.nombre : servicio;
        const icono = ICONOS_SERVICIOS[nombre] || "/images/iconos/default.png";
        return (
          <div
            key={idx}
            className="flex items-center gap-4 rounded-lg p-4 shadow-sm"
          >
            <img
              src={icono}
              alt={nombre}
              className="w-8 h-8 object-contain"
            />
            <span className="text-gray-800 text-base">{nombre}</span>
          </div>
        );
      })}
    </div>
  </section>
);

export default HotelServicios; 