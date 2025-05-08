import { motion } from 'framer-motion';

const AboutSection = () => {
  return (
    <section className="py-20 bg-accent">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
          {/* Images Section */}
          <div className="lg:w-1/2 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="/images/img/H5HjF5SC83iTYLbvyxmd.avif"
                alt="Hotel Interior"
                className="w-full h-[600px] object-cover rounded-lg shadow-xl"
              />
              <motion.div
                initial={{ opacity: 0, x: -30, y: 30 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="absolute -bottom-8 -left-8 w-64 h-64 rounded-lg shadow-xl overflow-hidden"
              >
                <img
                  src="/images/img/e7cnL4wZUEFNF1DN8VdE.avif"
                  alt="Hotel Exterior"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </motion.div>
          </div>

          {/* Text Section */}
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="mb-6">
                <small className="text-primary font-montserrat uppercase tracking-wider">Sobre nosotros</small>
                <h2 className="text-4xl md:text-5xl font-caveat mt-2 text-secondary">
                  Servicios personalizados y experiencias únicas
                </h2>
              </div>

              <p className="text-lg text-gray-600 mb-4">
                En HotelFinder, nos dedicamos a crear experiencias memorables para nuestros huéspedes. Cada detalle está cuidadosamente pensado para ofrecerte el máximo confort y lujo.
              </p>

              <p className="text-gray-600 mb-6">
                Nuestro equipo está comprometido con la excelencia en el servicio, asegurando que cada momento de tu estancia sea perfecto. Desde la decoración hasta la gastronomía, todo está diseñado para superar tus expectativas.
              </p>

              <div className="flex items-center space-x-4">
                <img
                  src="/img/signature.png"
                  alt="Firma del propietario"
                  className="h-12"
                />
                <div>
                  <p className="text-primary italic">María González</p>
                  <p className="text-sm text-gray-500">Fundadora y CEO</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection; 