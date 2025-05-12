import React, { useState, useEffect } from 'react';
import { useHotelStore } from '../../stores/hotelStore';
import { useTranslation } from 'react-i18next';
import { FaCheckCircle } from 'react-icons/fa';

const LoginForm = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Obtener las funciones del store directamente
  const login = useHotelStore((state) => state.login);
  const user = useHotelStore((state) => state.user);

  // Redirigir si el usuario ya está autenticado
  useEffect(() => {
    if (user) {
      setSuccess(true);
      // Esperar 1.5 segundos antes de redirigir para mostrar el mensaje de éxito
      const timer = setTimeout(() => {
        const params = new URLSearchParams(window.location.search);
        const redirectUrl = params.get('redirect') || '/account';
        
        // Usar navigate para una navegación más suave
        const event = new CustomEvent('navigate', {
          detail: { url: redirectUrl }
        });
        window.dispatchEvent(event);
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
      let errorMessage = t('auth.loginError');
      
      if (error.response?.status === 401) {
        errorMessage = t('auth.invalidCredentials');
      } else if (error.response?.status === 400) {
        errorMessage = t('auth.invalidEmail');
      } else if (error.message === 'Network Error') {
        errorMessage = t('auth.networkError');
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="backdrop-blur-sm p-8 rounded-lg text-center">
        <div className="flex flex-col items-center space-y-4">
          <FaCheckCircle className="w-16 h-16 text-green-500" />
          <h2 className="text-2xl font-semibold text-gray-900">
            ¡Bienvenido de nuevo!
          </h2>
          <p className="text-gray-600">
            Has iniciado sesión correctamente. Redirigiendo...
          </p>
          <div className="w-8 h-8 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="backdrop-blur-sm p-8 rounded-lg">
      {error && (
        <div className="mb-4 p-3 bg-red-500/50 backdrop-blur-sm text-white rounded-md">
          {error}
        </div>
      )}

      <div className="mb-6">
        <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
          {t('auth.email')}
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 bg-white/20 border border-gray-300 text-gray-900 placeholder-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent backdrop-blur-sm"
          placeholder="tu@email.com"
          disabled={loading}
        />
      </div>

      <div className="mb-6">
        <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
          {t('auth.password')}
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-3 bg-white/20 border border-gray-300 text-gray-900 placeholder-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent backdrop-blur-sm"
          placeholder="••••••••"
          disabled={loading}
        />
      </div>

      <div className="flex items-center justify-between mb-6">
        <a
          href="/auth/recover-password"
          className="text-sm text-gray-900 hover:text-primary transition-colors"
        >
          {t('auth.forgotPassword')}
        </a>
      </div>

      <button
        type="submit"
        className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={loading}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
            {t('common.loading')}
          </div>
        ) : (
          t('auth.login')
        )}
      </button>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-900">
          {t('auth.noAccount')}{' '}
          <a
            href="/auth/register"
            className="text-primary hover:text-primary/90 transition-colors"
          >
            {t('auth.register')}
          </a>
        </p>
      </div>
    </form>
  );
};

export default LoginForm; 