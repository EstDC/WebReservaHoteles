import { motion } from 'framer-motion';

const restaurants = [
  {
    name: "La Terraza",
    cuisine: "Mediterránea",
    description: "Cocina mediterránea contemporánea con vistas panorámicas",
    image: "/img/restaurants/terrace.jpg",
    features: ["Terraza exterior", "Vinos locales", "Menú degustación"],
    schedule: "Desayuno: 7:00 - 11:00 | Cena: 19:00 - 23:00"
  },
  {
    name: "Sushi Bar",
    cuisine: "Japonesa",
    description: "Auténtica cocina japonesa con ingredientes frescos",
    image: "/img/restaurants/sushi.jpg",
    features: ["Barra de sushi", "Cocina abierta", "Sake bar"],
    schedule: "Almuerzo: 12:00 - 15:00 | Cena: 19:00 - 23:00"
  },
  {
    name: "El Jardín",
    cuisine: "Internacional",
    description: "Buffet internacional en un ambiente relajado",
    image: "/img/restaurants/garden.jpg",
    features: ["Buffet temático", "Zona infantil", "Cocina en vivo"],
    schedule: "Desayuno: 7:00 - 11:00 | Almuerzo: 12:00 - 16:00"
  }
];

const RestaurantsSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <small className="text-primary font-montserrat uppercase tracking-wider">Gastronomía</small>
          <h2 className="text-4xl md:text-5xl font-caveat mt-2 text-secondary">
            Nuestros Restaurantes
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {restaurants.map((restaurant, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-64">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="text-2xl font-caveat">{restaurant.name}</h3>
                  <p className="text-sm opacity-90">{restaurant.cuisine}</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">{restaurant.description}</p>
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Características:</h4>
                  <ul className="space-y-1">
                    {restaurant.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-600">
                        <svg className="w-4 h-4 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500">{restaurant.schedule}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubre una experiencia culinaria única en cada uno de nuestros restaurantes. 
            Desde la cocina mediterránea hasta la auténtica gastronomía japonesa, 
            cada plato es una obra maestra de sabores y presentación.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default RestaurantsSection; 