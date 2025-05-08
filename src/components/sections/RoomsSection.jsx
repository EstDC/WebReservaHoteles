import { motion } from 'framer-motion';
import { FaBed, FaWifi, FaSwimmingPool, FaTv, FaCoffee } from 'react-icons/fa';

const RoomCard = ({ image, title, price, features }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="group relative overflow-hidden rounded-lg shadow-lg"
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4">
          <span className="text-white text-sm">From</span>
          <p className="text-white text-2xl font-bold">${price}/night</p>
        </div>
      </div>
      
      <div className="p-6 bg-white">
        <h3 className="text-xl font-caveat text-secondary mb-4">{title}</h3>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {features.map((feature, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full"
            >
              {feature.icon}
              {feature.name}
            </span>
          ))}
        </div>

        <a
          href="#"
          className="inline-block bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 transition-colors"
        >
          View Details
        </a>
      </div>
    </motion.div>
  );
};

const RoomsSection = () => {
  const rooms = [
    {
      image: "/img/e7cnL4wZUEFNF1DN8VdE.avif",
      title: "Junior Suite",
      price: 250,
      features: [
        { name: "King Bed", icon: <FaBed /> },
        { name: "Free WiFi", icon: <FaWifi /> },
        { name: "TV", icon: <FaTv /> },
      ]
    },
    {
      image: "/img/gallery_8-3.webp",
      title: "Deluxe Room",
      price: 190,
      features: [
        { name: "Queen Bed", icon: <FaBed /> },
        { name: "Free WiFi", icon: <FaWifi /> },
        { name: "Coffee Maker", icon: <FaCoffee /> },
      ]
    },
    {
      image: "/img/e7cnL4wZUEFNF1DN8VdE.avif",
      title: "Superior Room",
      price: 240,
      features: [
        { name: "King Bed", icon: <FaBed /> },
        { name: "Pool View", icon: <FaSwimmingPool /> },
        { name: "TV", icon: <FaTv /> },
      ]
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
          <small className="text-primary font-montserrat uppercase tracking-wider">Luxury experience</small>
          <h2 className="text-4xl md:text-5xl font-caveat mt-2 text-secondary">
            Rooms & Suites
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room, index) => (
            <RoomCard key={index} {...room} />
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="/rooms"
            className="inline-block border-2 border-primary text-primary px-8 py-3 rounded-full hover:bg-primary hover:text-white transition-colors"
          >
            View all Rooms
          </a>
        </div>
      </div>
    </section>
  );
};

export default RoomsSection; 