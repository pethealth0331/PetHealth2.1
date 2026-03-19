import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './router/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import ScheduleAppointmentPage from './pages/ScheduleAppointmentPage';
import AppointmentConfirmationPage from './pages/AppointmentConfirmationPage';
import './index.css';

function App() {
  return (
    // AuthProvider envuelve TODA la aplicación, exponiendo el contexto JWT global
    <AuthProvider>
      <BrowserRouter>
        {/* Navbar siempre visible: reacciona al estado de autenticación */}
        <Navbar />
        <Routes>
          {/* Ruta pública: Página de inicio */}
          <Route path="/" element={<LandingPage />} />

          {/* Ruta pública: Login / Registro (unificados) */}
          <Route path="/auth" element={<AuthPage />} />

          {/* Ruta PROTEGIDA: Agendar Cita (requiere JWT válido) */}
          <Route
            path="/agendar-cita"
            element={
              <ProtectedRoute>
                <ScheduleAppointmentPage />
              </ProtectedRoute>
            }
          />

          {/* Ruta PROTEGIDA: Confirmación de cita agendada */}
          <Route
            path="/cita-confirmada"
            element={
              <ProtectedRoute>
                <AppointmentConfirmationPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
