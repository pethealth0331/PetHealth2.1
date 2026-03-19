import { useLocation, useNavigate } from 'react-router-dom';

const AppointmentConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const appointmentId = (location.state as { appointmentId?: string })?.appointmentId;

  return (
    <div className="confirm-page">
      <div className="confirm-card">
        <div className="confirm-icon">✅</div>
        <h1>¡Cita Agendada!</h1>
        <p>Tu cita veterinaria ha sido registrada exitosamente.</p>
        {appointmentId && (
          <p className="confirm-id">
            ID de referencia: <strong>{appointmentId}</strong>
          </p>
        )}
        <button className="btn-primary" onClick={() => navigate('/')}>
          Volver al Inicio
        </button>
      </div>
    </div>
  );
};

export default AppointmentConfirmationPage;
