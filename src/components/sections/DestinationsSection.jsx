import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaHotel, FaStar } from 'react-icons/fa';

const DestinationCard = ({ image, city, country, hotels, rating }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="group relative overflow-hidden rounded-lg shadow-lg cursor-pointer"
    >
      <div className="relative h-80 overflow-hidden">
        <img
          src={image}
          alt={`${city}, ${country}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <FaMapMarkerAlt className="text-primary" />
            <span className="text-sm">{country}</span>
          </div>
          <h3 className="text-2xl font-caveat mb-2">{city}</h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaHotel className="text-primary" />
              <span className="text-sm">{hotels} hotels</span>
            </div>
            <div className="flex items-center gap-1">
              <FaStar className="text-yellow-400" />
              <span className="text-sm">{rating}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const MarqueeText = () => {
  return (
    <div className="overflow-hidden whitespace-nowrap py-4 bg-primary/5">
      <div className="inline-block animate-marquee">
        <span className="text-2xl font-caveat text-primary mx-8">
          Barcelona • Paris • London • Rome • New York • Tokyo • Dubai • Sydney • Barcelona • Paris • London • Rome • New York • Tokyo • Dubai • Sydney
        </span>
      </div>
    </div>
  );
};

const DestinationsSection = () => {
  const destinations = [
    {
      image: "/img/e7cnL4wZUEFNF1DN8VdE.avif",
      city: "Barcelona",
      country: "Spain",
      hotels: 24,
      rating: "4.8"
    },
    {
      image: "/img/gallery_8-3.webp",
      city: "Paris",
      country: "France",
      hotels: 32,
      rating: "4.9"
    },
    {
      image: "/img/e7cnL4wZUEFNF1DN8VdE.avif",
      city: "London",
      country: "UK",
      hotels: 28,
      rating: "4.7"
    },
    {
      image: "/img/gallery_8-3.webp",
      city: "New York",
      country: "USA",
      hotels: 35,
      rating: "4.9"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <small className="text-primary font-montserrat uppercase tracking-wider">Explore the world</small>
          <h2 className="text-4xl md:text-5xl font-caveat mt-2 text-secondary">
            Popular Destinations
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {destinations.map((destination, index) => (
            <DestinationCard key={index} {...destination} />
          ))}
        </div>

        <MarqueeText />

        <div className="text-center mt-12">
          <a
            href="/destinations"
            className="inline-block border-2 border-primary text-primary px-8 py-3 rounded-full hover:bg-primary hover:text-white transition-colors"
          >
            View all Destinations
          </a>
        </div>
      </div>
    </section>
  );
};

export default DestinationsSection; 