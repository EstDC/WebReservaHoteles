import React, { useState } from 'react';
import { useHotelStore } from '../../stores/hotelStore';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import api from '../../utils/api';

const PasswordRecoveryForm = () => {
  const { t } = useTranslation();
  const { recoverPassword } = useHotelStore();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState('');

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await api.post(`/usuarios/recuperar-password?email=${encodeURIComponent(email)}`);
      const tokenRecibido = response.data.token;
      setToken(tokenRecibido);
      setStep(2);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.mensaje || err.message || t('auth.recoveryError'));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError(t('auth.passwordsDoNotMatch'));
      return;
    }

    setLoading(true);

    try {
      await api.post(`/usuarios/cambiar-password?token=${encodeURIComponent(token)}&nuevaPassword=${encodeURIComponent(newPassword)}`);
      window.location.href = '/auth/login';
    } catch (err) {
      setError(err.response?.data?.mensaje || err.message || t('auth.recoveryError'));
    } finally {
      setLoading(false);
    }
  };

  const hotelImg = '/images/img/QXD4HIO6SJHGRKGQEWWVEHB3XI_converted.jpg';

  return (
    <section className="w-full flex flex-col md:flex-row p-0 m-0 bg-white items-stretch min-h-[60vh] md:min-h-[80vh]">
      {/* Imagen y texto en móvil (arriba) */}
      <div className="relative w-full h-56 sm:h-64 md:hidden">
        <img
          src={hotelImg}
          alt="Hotel"
          className="w-full h-full object-cover object-center z-0"
          style={{ borderRadius: 0 }}
        />
        {/* Overlay degradado */}
        <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-black/20 via-black/0 to-transparent" />
        {/* Texto animado adaptado a móvil */}
        <div className="absolute inset-0 flex flex-col justify-end items-center z-20 pb-4">
          <motion.span
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.8, 0, 0.2, 1] }}
            className="font-lorise-sans text-2xl text-white drop-shadow-lg leading-none"
          >
            ¿Olvidaste tu&nbsp;
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.8, 0, 0.2, 1] }}
            className="font-alcantera-script text-3xl text-white drop-shadow-lg -mt-2"
          >
            contraseña?
          </motion.span>
        </div>
      </div>
      {/* Formulario a la izquierda (en móvil debajo de la imagen) */}
      <div className="md:w-1/2 w-full flex flex-col justify-center p-8 md:p-16 flex-1">
        {/* Título decorativo en móvil */}
        <div className="relative mb-8 block md:hidden">
          <h1 className="font-alcantera-script text-4xl text-primary">Recupera</h1>
          <h1 className="font-lorise-sans text-2xl absolute -bottom-2 left-[10%]">tu acceso</h1>
        </div>
        {/* Título decorativo en desktop */}
        <div className="relative mb-8 hidden md:block">
          <h1 className="font-alcantera-script text-7xl md:text-8xl text-primary">Recupera</h1>
          <h1 className="font-lorise-sans text-6xl md:text-7xl absolute -bottom-4 left-[12%]">tu acceso</h1>
        </div>
        {/* Formulario de recuperación */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        {success && step === 2 && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
            {t('auth.recoveryEmailSent')}
          </div>
        )}
        {step === 1 ? (
          <form onSubmit={handleEmailSubmit} className="w-full max-w-md">
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                {t('Correo electrónico')}
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? t('common.loading') : t('Enviar correo')}
            </button>
          </form>
        ) : (
          <form onSubmit={handlePasswordSubmit} className="w-full max-w-md">
            <div className="mb-4">
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.newPassword')}
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.confirmPassword')}
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? t('common.loading') : t('auth.resetPassword')}
            </button>
          </form>
        )}
      </div>
      {/* Imagen a la derecha solo en desktop */}
      <div className="md:w-1/2 w-full relative items-center justify-start flex-1 hidden md:flex">
        <img
          src={hotelImg}
          alt="Hotel"
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
          style={{ borderRadius: 0 }}
        />
        {/* Overlay degradado */}
        <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-black/20 via-black/0 to-transparent" />
        {/* Texto animado */}
        <div className="absolute left-0 bottom-0 flex flex-col justify-end items-start z-20 h-full w-full pl-8 pb-8 md:pl-16 md:pb-8">
          <motion.span
            initial={{ opacity: 0, x: 200 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.8, 0, 0.2, 1] }}
            className="font-lorise-sans text-6xl md:text-7xl text-white drop-shadow-lg leading-none"
          >
            ¿Olvidaste tu&nbsp;
          </motion.span>
          <motion.span
            initial={{ opacity: 0, x: 240 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.8, 0, 0.2, 1] }}
            className="font-alcantera-script text-8xl md:text-9xl text-white drop-shadow-lg -mt-10 pl-12"
          >
            contraseña?
          </motion.span>
        </div>
      </div>
    </section>
  );
};

export default PasswordRecoveryForm;