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
          <span className="uppercase tracking-widest text-sm text-[#b6a179] font-semibold mb-2 block">{subtitle}</span>
          <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-4">{title}</h2>
          <p className="text-lg text-gray-600 mb-8">{text}</p>
          {buttonText && (
            <a
              href={buttonLink}
              className="inline-block px-8 py-3 border-2 border-gray-800 rounded-full text-lg font-semibold hover:bg-gray-800 hover:text-white transition-colors"
            >
              {buttonText}
            </a>
          )}
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