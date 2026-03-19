import { useState, type FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi, type AuthResponse } from '../api/axiosConfig';
import axios from 'axios';

// Modo del formulario: login o registro
type AuthMode = 'login' | 'register';

const AuthPage = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Extraer la ruta de origen (para redirigir de vuelta después del login)
  const from = (location.state as { from?: Location })?.from?.pathname || '/';

  const toggleMode = () => {
    setError('');
    setMode((prev) => (prev === 'login' ? 'register' : 'login'));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const endpoint = mode === 'login' ? '/login' : '/register';
      const payload =
        mode === 'login'
          ? { email, password }
          : { full_name: fullName, email, password };

      const { data } = await authApi.post<AuthResponse>(endpoint, payload);

      // Guardar token en contexto global y localStorage
      login(data.access_token);

      // Redirigir a la ruta de origen o al inicio
      navigate(from, { replace: true });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail || 'Ocurrió un error. Intenta de nuevo.');
      } else {
        setError('Error inesperado del servidor.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Encabezado de la tarjeta */}
        <div className="auth-card-header">
          <span className="auth-logo">🐾</span>
          <h1 className="auth-card-title">PetHealth</h1>
          <p className="auth-card-subtitle">
            {mode === 'login'
              ? 'Bienvenido de vuelta. Inicia tu sesión.'
              : 'Crea tu cuenta en segundos.'}
          </p>
        </div>

        {/* Selector de modo Login / Registro */}
        <div className="auth-toggle">
          <button
            type="button"
            className={`auth-toggle-btn ${mode === 'login' ? 'active' : ''}`}
            onClick={() => setMode('login')}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            className={`auth-toggle-btn ${mode === 'register' ? 'active' : ''}`}
            onClick={() => setMode('register')}
          >
            Registrarse
          </button>
        </div>

        {/* Formulario dinámico con animación de entrada */}
        <form
          key={mode} /* Fuerza remontaje para disparar animación CSS */
          className="auth-form"
          onSubmit={handleSubmit}
        >
          {/* Campo exclusivo del registro */}
          {mode === 'register' && (
            <div className="form-group">
              <label htmlFor="fullName">Nombre Completo</label>
              <input
                id="fullName"
                type="text"
                placeholder="Ej. María González"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              id="email"
              type="email"
              placeholder="correo@ejemplo.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="Mínimo 8 caracteres"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Mensaje de error */}
          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="btn-primary btn-full" disabled={isLoading}>
            {isLoading ? (
              <span className="btn-spinner"></span>
            ) : mode === 'login' ? (
              'Entrar a mi cuenta'
            ) : (
              'Crear cuenta'
            )}
          </button>
        </form>

        {/* Texto de cambio de modo */}
        <p className="auth-switch-text">
          {mode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
          <button type="button" className="auth-switch-link" onClick={toggleMode}>
            {mode === 'login' ? 'Regístrate gratis' : 'Inicia sesión'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
