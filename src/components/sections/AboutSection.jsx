import { motion } from 'framer-motion';

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-accent">
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
                src="/images/img/H5HjF5SC83iTYLbvyxmd.jpg"
                alt="Hotel Interior"
                className="w-full h-auto aspect-[4/3] max-h-[600px] object-cover rounded-lg shadow-xl"
              />
              <motion.div
                initial={{ opacity: 0, x: -30, y: 30 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="absolute -bottom-4 -left-4 sm:-bottom-8 sm:-left-8 w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-lg shadow-xl overflow-hidden"
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
              <div className="mb-6 relative">
                <small className="text-primary font-alcantera-script tracking-wider text-8xl relative z-10">
                  Sobre nosotros
                </small>
                <h2
                  className="text-6xl md:text-7xl font-lorise-sans text-secondary font-bold
                    -mt-8 md:-mt-12 mx-auto text-center relative z-20"
                  style={{ letterSpacing: '-0.03em' }}
                >
                  Servicios personalizados y experiencias únicas
                </h2>
              </div>

              <div className="mx-auto text-center max-w-2xl px-4 md:px-8">
                <p className="text-xl text-gray-600 mb-4 font-helvetica">
                  En Habitahub, nos dedicamos a crear experiencias memorables para nuestros huéspedes. Cada detalle está cuidadosamente pensado para ofrecerte el máximo confort y lujo.
                </p>
                <p className="text-gray-600 mb-6 font-helvetica text-xl">
                  Nuestro equipo está comprometido con la excelencia en el servicio, asegurando que cada momento de tu estancia sea perfecto. Desde la decoración hasta la gastronomía, todo está diseñado para superar tus expectativas.
                </p>
              </div>

            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection; 