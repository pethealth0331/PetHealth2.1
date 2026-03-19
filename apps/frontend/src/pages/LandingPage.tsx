import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* Sección Hero */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">Sistema Integral Veterinario</span>
          <h1 className="hero-title">
            Cuidamos a tu <span className="hero-highlight">mascota</span> con
            tecnología de punta
          </h1>
          <p className="hero-subtitle">
            Gestiona citas, registros médicos y el historial de salud de tu
            compañero de vida, todo desde un único lugar seguro y moderno.
          </p>
          <div className="hero-actions">
            <button
              className="btn-primary btn-large"
              onClick={() => navigate('/agendar-cita')}
            >
              Agendar una Cita
            </button>
            {!isAuthenticated && (
              <button
                className="btn-secondary btn-large"
                onClick={() => navigate('/auth')}
              >
                Crear cuenta gratis
              </button>
            )}
          </div>
        </div>
        <div className="hero-illustration">
          <div className="hero-card hero-card-1">
            <span>🐶</span>
            <p>Consulta General</p>
          </div>
          <div className="hero-card hero-card-2">
            <span>💉</span>
            <p>Vacunación</p>
          </div>
          <div className="hero-card hero-card-3">
            <span>🔬</span>
            <p>Análisis Clínicos</p>
          </div>
          <div className="hero-card hero-card-4">
            <span>🏥</span>
            <p>Hospitalización</p>
          </div>
        </div>
      </section>

      {/* Sección de Características */}
      <section className="features-section">
        <h2 className="features-title">¿Por qué elegir PetHealth?</h2>
        <div className="features-grid">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const FEATURES = [
  {
    icon: '📅',
    title: 'Citas en Línea',
    description: 'Agenda, reagenda o cancela citas veterinarias desde cualquier dispositivo en cuestión de segundos.',
  },
  {
    icon: '🔒',
    title: 'Datos Seguros',
    description: 'Tu información y la de tu mascota están protegidas con cifrado JWT de última generación.',
  },
  {
    icon: '📋',
    title: 'Historial Completo',
    description: 'Accede al historial médico completo de tu mascota en cualquier momento.',
  },
  {
    icon: '🔔',
    title: 'Notificaciones',
    description: 'Recibe recordatorios de citas y alertas sobre el estado de salud de tu compañero.',
  },
];

export default LandingPage;
