import { Navigate, useLocation, type ReactNode } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Componente de Ruta Protegida:
 * Intercepta el acceso a rutas privadas. Si el usuario no está autenticado,
 * lo redirige a /auth guardando la ubicación original en el state del router
 * para poder redirigirlo de regreso tras el login exitoso.
 */
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Guardamos la ruta de origen en state para retornar al usuario después del login
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
