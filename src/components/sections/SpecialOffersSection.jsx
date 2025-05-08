import { motion } from 'framer-motion';
import { FaCalendarAlt, FaHotel, FaTag } from 'react-icons/fa';

const OfferCard = ({ image, title, location, discount, dates, description }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="group relative overflow-hidden rounded-lg shadow-lg"
    >
      <div className="relative h-80 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        
        {/* Discount Badge */}
        <div className="absolute top-4 right-4 bg-primary text-white px-4 py-2 rounded-full font-bold">
          {discount} OFF
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <FaHotel className="text-primary" />
            <span className="text-sm">{location}</span>
          </div>
          <h3 className="text-2xl font-caveat mb-2">{title}</h3>
          
          <div className="flex items-center gap-2 mb-4">
            <FaCalendarAlt className="text-primary" />
            <span className="text-sm">{dates}</span>
          </div>

          <p className="text-sm mb-4">{description}</p>

          <a
            href="#"
            className="inline-block bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 transition-colors"
          >
            Book Now
          </a>
        </div>
      </div>
    </motion.div>
  );
};

const SpecialOffersSection = () => {
  const offers = [
    {
      image: "/img/e7cnL4wZUEFNF1DN8VdE.avif",
      title: "Summer Escape",
      location: "Barcelona, Spain",
      discount: "25%",
      dates: "June 1 - August 31, 2024",
      description: "Enjoy the Mediterranean summer with our special rates and complimentary breakfast."
    },
    {
      image: "/img/gallery_8-3.webp",
      title: "Early Bird Special",
      location: "Paris, France",
      discount: "20%",
      dates: "Book by March 31, 2024",
      description: "Plan your Parisian getaway in advance and save on your stay."
    },
    {
      image: "/img/e7cnL4wZUEFNF1DN8VdE.avif",
      title: "Weekend Getaway",
      location: "London, UK",
      discount: "15%",
      dates: "Every Weekend",
      description: "Perfect for a quick city break with our weekend special rates."
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
          <small className="text-primary font-montserrat uppercase tracking-wider">Special Deals</small>
          <h2 className="text-4xl md:text-5xl font-caveat mt-2 text-secondary">
            Exclusive Offers
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Take advantage of our special rates and packages designed to make your stay even more memorable.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offers.map((offer, index) => (
            <OfferCard key={index} {...offer} />
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="/offers"
            className="inline-block border-2 border-primary text-primary px-8 py-3 rounded-full hover:bg-primary hover:text-white transition-colors"
          >
            View all Offers
          </a>
        </div>
      </div>
    </section>
  );
};

export default SpecialOffersSection; 