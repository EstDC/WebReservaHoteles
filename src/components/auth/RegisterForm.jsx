import React, { useState } from 'react';
import { useHotelStore } from '../../stores/hotelStore';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const RegisterForm = () => {
  const { t } = useTranslation();
  const { register } = useHotelStore();
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError(t('Las contraseñas no coinciden'));
      return;
    }

  // Validación de teléfono
  // Limpiar espacios
  const cleanPhone = formData.phone.replace(/\\s+/g, '');

  // Log para depuración
  console.log('Teléfono limpio:', cleanPhone);

  if (!/^\+\d{10,15}$/.test(cleanPhone)) {
    setError('El teléfono debe incluir el prefijo internacional y tener entre 10 y 15 dígitos (ej: +34658975423)');
    return;
  }


    setLoading(true);

    try {
      await register(formData);
      window.location.href = '/auth/login';
    } catch (err) {
      setError(err.message || t('Error al registrar'));
    } finally {
      setLoading(false);
    }
  };

  // Obtener imagen
  const hotelImg = '/images/img/timeshare-resources-timeshare-ownership-are-timeshares-worth-it.jpg';

  return (
    <section className="w-full flex flex-col md:flex-row p-0 m-0 bg-white items-stretch min-h-[60vh] md:min-h-[80vh]">
      {/* Formulario de registro a la izquierda */}
      <div className="md:w-1/2 w-full flex flex-col justify-center p-8 md:p-16 flex-1">
      <div className="relative mb-8">
        <h1 className="font-alcantera-script text-7xl md:text-8xl text-primary">Hazte</h1>
        <h1 className="font-lorise-sans text-6xl md:text-7xl absolute -bottom-4 left-[12%]">miembro</h1>
      </div>

        <form onSubmit={handleSubmit} className="w-full max-w-md">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              {t('Nombre')}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="surname" className="block text-sm font-medium text-gray-700 mb-1">
              {t('Apellidos')}
            </label>
            <input
              type="text"
              id="surname"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              {t('Correo electrónico')}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              {t('Teléfono')}
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              {t('Contraseña')}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              {t('Confirmar contraseña')}
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? t('common.loading') : t('Registrarse')}
          </button>
        </form>
      </div>

      {/* Imagen principal a la derecha */}
      <div className="md:w-1/2 w-full relative flex items-center justify-start flex-1">
        <img
          src={hotelImg}
          alt="Hotel"
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
          style={{ borderRadius: 0 }}
        />
        {/* Overlay degradado */}
        <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-black/40 via-black/0 to-transparent" />
        {/* Texto animado */}
        <div className="absolute left-0 bottom-0 flex flex-col justify-end items-start z-20 h-full w-full pl-8 pb-8 md:pl-16 md:pb-8">
          <motion.span
            initial={{ opacity: 0, x: 200 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.8, 0, 0.2, 1] }}
            className="font-lorise-sans text-6xl md:text-7xl text-white drop-shadow-lg leading-none"
          >
            Únete a nuestra&nbsp;
          </motion.span>
          <motion.span
            initial={{ opacity: 0, x: 240 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.8, 0, 0.2, 1] }}
            className="font-alcantera-script text-8xl md:text-9xl text-white drop-shadow-lg -mt-10 pl-12"
          >
            ¡familia hotelera!
          </motion.span>
        </div>
      </div>
    </section>
  );
};

export default RegisterForm; 