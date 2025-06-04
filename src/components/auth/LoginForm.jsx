import React, { useState, useEffect } from 'react';
import { useHotelStore } from '../../stores/hotelStore';
import { useTranslation } from 'react-i18next';
import { FaCheckCircle } from 'react-icons/fa';

const LoginForm = () => {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  // Obtener las funciones del store directamente
  const login = useHotelStore((state) => state.login);
  const user = useHotelStore((state) => state.user);

  // Marcar cuando estamos en el cliente
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Redirigir si el usuario ya está autenticado
  useEffect(() => {
    if (user) {
      setSuccess(true);
      // Esperar 1.5 segundos antes de redirigir para mostrar el mensaje de éxito
      const timer = setTimeout(() => {
        const params = new URLSearchParams(window.location.search);
        const redirectUrl = params.get('redirect') || (user.role === 'ADMIN' ? '/admin' : '/account');
        window.location.href = redirectUrl;
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setSuccess(false);

    try {
      if (!email || !password) {
        throw new Error(t('auth.requiredFields'));
      }

      console.log('LoginForm: Iniciando login con:', { email });
      const user = await login({ email, password });
      console.log('LoginForm: Login exitoso, usuario:', user);
      
      // La redirección se manejará en el useEffect cuando user cambie
    } catch (error) {
      console.error('LoginForm: Error en login:', error);
      let errorMessage = t('Error al iniciar sesión');
      
      if (error.response?.status === 401) {
        errorMessage = t('Credenciales incorrectas');
      } else if (error.response?.status === 400) {
        errorMessage = t('Correo electrónico o contraseña incorrectos');
      } else if (error.message === 'Network Error') {
        errorMessage = t('Error de red');
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="backdrop-blur-sm p-4 sm:p-8 rounded-lg text-center">
        <div className="flex flex-col items-center space-y-4">
          <FaCheckCircle className="w-16 h-16 text-primary" />
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
            ¡Bienvenido de nuevo!
          </h2>
          <p className="text-gray-600 font-helvetica text-sm sm:text-base">
            Has iniciado sesión correctamente. Redirigiendo...
          </p>
          <div className="w-8 h-8 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // No renderizar nada hasta que estemos en el cliente
  if (!isClient) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="backdrop-blur-sm p-4 sm:p-8 rounded-lg">
      {error && (
        <div className="mb-4 p-3 bg-red-500/50 backdrop-blur-sm text-white rounded-md text-sm sm:text-base">
          {error}
        </div>
      )}

      <div className="mb-6">
        <label htmlFor="email" className="block text-xs sm:text-sm  text-gray-900 mb-2 font-helvetica">
          {t('Correo electrónico')}
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white/20 border border-gray-300 text-gray-900 font-helvetica placeholder-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent backdrop-blur-sm text-sm sm:text-base"
          placeholder="tu@email.com"
          disabled={loading}
        />
      </div>

      <div className="mb-6">
        <label htmlFor="password" className="block text-xs sm:text-sm font-helvetica text-gray-900 mb-2">
          {t('Contraseña')}
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white/20 border border-gray-300 text-gray-900 font-helvetica placeholder-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent backdrop-blur-sm text-sm sm:text-base"
          placeholder="••••••••"
          disabled={loading}
        />
      </div>

      <div className="flex items-center justify-between mb-6">
        <a
          href="/auth/recover-password"
          className="text-xs sm:text-sm text-gray-900 hover:text-primary transition-colors font-helvetica"
        >
          {t('He olvidado mi contraseña')}
        </a>
      </div>

      <button
        type="submit"
        className="w-full bg-primary text-white py-2 sm:py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
        disabled={loading}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2 font-helvetica"></div>
            {t('common.loading')}
          </div>
        ) : (
          t('Iniciar sesión')
        )}
      </button>

    </form>
  );
};

export default LoginForm; 