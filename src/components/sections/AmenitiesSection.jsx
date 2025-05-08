import { motion } from 'framer-motion';
import { 
  FaWifi, 
  FaSwimmingPool, 
  FaParking, 
  FaUtensils, 
  FaSpa, 
  FaDumbbell,
  FaConciergeBell,
  FaUmbrellaBeach
} from 'react-icons/fa';

const AmenityCard = ({ icon, title, description }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
    >
      <div className="text-primary text-4xl mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-caveat text-secondary mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

const AmenitiesSection = () => {
  const amenities = [
    {
      icon: <FaWifi />,
      title: "High Speed WiFi",
      description: "Stay connected with our complimentary high-speed internet access throughout the hotel."
    },
    {
      icon: <FaSwimmingPool />,
      title: "Swimming Pool",
      description: "Relax and unwind in our beautiful outdoor and indoor swimming pools."
    },
    {
      icon: <FaParking />,
      title: "Private Parking",
      description: "Secure parking facilities available for all our guests."
    },
    {
      icon: <FaUtensils />,
      title: "Restaurant & Bar",
      description: "Enjoy exquisite dining experiences at our on-site restaurants and bars."
    },
    {
      icon: <FaSpa />,
      title: "Spa & Wellness",
      description: "Indulge in our luxurious spa treatments and wellness services."
    },
    {
      icon: <FaDumbbell />,
      title: "Fitness Center",
      description: "Stay active with our state-of-the-art fitness facilities."
    },
    {
      icon: <FaConciergeBell />,
      title: "24/7 Concierge",
      description: "Our dedicated staff is available around the clock to assist you."
    },
    {
      icon: <FaUmbrellaBeach />,
      title: "Beach Access",
      description: "Direct access to pristine beaches at our coastal locations."
    }
  ];

  return (
    <section className="py-20 bg-accent">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <small className="text-primary font-montserrat uppercase tracking-wider">Our Services</small>
          <h2 className="text-4xl md:text-5xl font-caveat mt-2 text-secondary">
            Hotel Facilities
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Experience luxury and comfort with our wide range of amenities designed to make your stay unforgettable.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {amenities.map((amenity, index) => (
            <AmenityCard key={index} {...amenity} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AmenitiesSection; 