import { motion } from 'framer-motion';

const facilities = [
  {
    title: "Parking Privado",
    description: "Aparca tu vehículo con total comodidad y seguridad durante toda tu estancia en nuestro hotel.",
    icon: (
      <svg className="w-14 h-14 mx-auto mb-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 48 48">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 40V20l16-8 16 8v20M12 40V24m24 16V24M16 40v-4a4 4 0 014-4h8a4 4 0 014 4v4" />
        <rect x="18" y="28" width="12" height="8" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
    )
  },
  {
    title: "Wi-Fi de Alta Velocidad",
    description: "Conéctate en cualquier momento y lugar del hotel gracias a nuestra red Wi-Fi rápida y gratuita.",
    icon: (
      <svg className="w-14 h-14 mx-auto mb-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 48 48">
        <rect x="14" y="32" width="20" height="8" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M24 32v-4m-8 4a8 8 0 0116 0" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 24a12 12 0 0124 0" />
      </svg>
    )
  },
  {
    title: "Bar y Restaurante",
    description: "Disfruta de una variada oferta gastronómica y de bebidas en un ambiente acogedor y elegante.",
    icon: (
      <svg className="w-14 h-14 mx-auto mb-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 48 48">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 36h24M24 36V12m0 0l8 8m-8-8l-8 8" />
        <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
    )
  },
  {
    title: "Piscina",
    description: "Relájate y refréscate en nuestra piscina, ideal para disfrutar solo o en familia durante tu estancia.",
    icon: (
      <svg className="w-14 h-14 mx-auto mb-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 48 48">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 32c4 4 8 4 12 0s8-4 12 0 8 4 12 0" />
        <rect x="8" y="36" width="32" height="4" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
    )
  }
];

const FacilitiesSection = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
      <h2 className="text-5xl md:text-6xl text-gray-800 font-lorise-sans text-center mb-8">
        Principales <span className="font-alcantera-script text-primary">Servicios</span>
      </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {facilities.map((facility, index) => (
            <div key={index} className="bg-white rounded-2xl shadow p-8 text-center flex flex-col items-center h-full">
              {facility.icon}
              <h3 className="text-xl font-bold text-gray-800 mb-2">{facility.title}</h3>
              <p className="text-gray-500 text-base">{facility.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FacilitiesSection;