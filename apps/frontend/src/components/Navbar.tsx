import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">🐾</span>
        <span className="navbar-title">PetHealth</span>
      </div>

      <div className="navbar-links">
        <Link to="/" className="nav-link">Inicio</Link>
        <Link to="/agendar-cita" className="nav-link nav-link-cta">
          Agendar Cita
        </Link>

        {isAuthenticated ? (
          <button className="btn-nav-secondary" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        ) : (
          <Link to="/auth" className="btn-nav-primary">Ingresar</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
