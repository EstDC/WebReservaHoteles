import PropTypes from 'prop-types';

const FeatureSection = ({
  image,
  subtitle,
  title,
  text,
  buttonText,
  buttonLink = '#',
  imageLeft = true
}) => {
  return (
    <section className="py-20 bg-white">
      <div className={`container mx-auto px-4 flex flex-col md:flex-row ${imageLeft ? '' : 'md:flex-row-reverse'} items-center gap-12`}>
        {/* Imagen */}
        <div className="md:w-1/2 w-full flex justify-center">
          <img
            src={image}
            alt={title}
            className="rounded-2xl shadow-xl w-full max-w-[500px] object-cover"
          />
        </div>
        {/* Texto */}
        <div className="md:w-1/2 w-full">
          <div className="mb-6 relative">
            <span className="text-7xl text-primary font-alcantera-script mb-2 block relative z-10">{subtitle}</span>
            <div className="ml-12 md:ml-16">
              <h2 className="text-7xl md:text-8xl font-lorise-sans text-secondary mb-4 -mt-8 md:-mt-12 relative z-20 leading-tight" style={{ letterSpacing: '-0.03em' }}>{title}</h2>
              <p className="text-lg text-gray-600 mb-8 font-helvetica">{text}</p>
              {buttonText && (
                <a
                  href={buttonLink}
                  className="inline-block px-8 py-3 border-2 border-gray-800 rounded-full text-lg font-semibold hover:bg-gray-800 hover:text-white transition-colors font-helvetica"
                >
                  {buttonText}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

FeatureSection.propTypes = {
  image: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  buttonText: PropTypes.string,
  buttonLink: PropTypes.string,
  imageLeft: PropTypes.bool
};

export default FeatureSection; 