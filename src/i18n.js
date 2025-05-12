import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      es: {
        translation: {
          common: {
            loading: 'Cargando...',
            book: 'Reservar',
            viewDetails: 'Ver detalles'
          },
          auth: {
            email: 'Correo electrónico',
            password: 'Contraseña',
            login: 'Iniciar sesión',
            register: 'Registrarse',
            forgotPassword: '¿Olvidaste tu contraseña?',
            noAccount: '¿No tienes una cuenta?',
            loginError: 'Error al iniciar sesión'
          }
        }
      },
      en: {
        translation: {
          common: {
            loading: 'Loading...',
            book: 'Book',
            viewDetails: 'View details'
          },
          auth: {
            email: 'Email',
            password: 'Password',
            login: 'Login',
            register: 'Register',
            forgotPassword: 'Forgot password?',
            noAccount: 'Don\'t have an account?',
            loginError: 'Login error'
          }
        }
      }
    },
    lng: 'es',
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n; 