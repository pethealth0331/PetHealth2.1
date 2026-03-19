import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { appointmentApi, type AppointmentPayload } from '../api/axiosConfig';
import axios from 'axios';

// Pasos del formulario multistep
type Step = 1 | 2;

const ScheduleAppointmentPage = () => {
  const [step, setStep] = useState<Step>(1);
  const [petName, setPetName] = useState('');
  const [vetName, setVetName] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleNextStep = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const payload: AppointmentPayload = {
      pet_name: petName,
      vet_name: vetName,
      appointment_date: appointmentDate,
      reason: reason,
    };

    try {
      const { data } = await appointmentApi.post('/appointments/schedule', payload);
      navigate('/cita-confirmada', { state: { appointmentId: data.id } });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail || 'No se pudo agendar la cita. Intenta de nuevo.');
      } else {
        setError('Error inesperado.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="appt-page">
      <div className="appt-card">

        {/* Indicador de pasos */}
        <div className="appt-steps">
          <div className={`step-indicator ${step >= 1 ? 'active' : ''}`}>
            <span>1</span>
            <p>Tu Mascota</p>
          </div>
          <div className={`step-connector ${step === 2 ? 'active' : ''}`} />
          <div className={`step-indicator ${step === 2 ? 'active' : ''}`}>
            <span>2</span>
            <p>La Cita</p>
          </div>
        </div>

        {/* Paso 1: Información de la mascota */}
        {step === 1 && (
          <form key="step-1" className="appt-form" onSubmit={handleNextStep}>
            <h2 className="appt-title">¿Quién viene a consulta?</h2>
            <p className="appt-subtitle">Ingresa el nombre de tu mascota para comenzar.</p>

            <div className="form-group">
              <label htmlFor="petName">Nombre de la Mascota</label>
              <input
                id="petName"
                type="text"
                placeholder="Ej. Luna, Thor, Simba…"
                required
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-primary btn-full">
              Continuar →
            </button>
          </form>
        )}

        {/* Paso 2: Detalles de la cita */}
        {step === 2 && (
          <form key="step-2" className="appt-form" onSubmit={handleSubmit}>
            <h2 className="appt-title">Detalles de la Cita</h2>
            <p className="appt-subtitle">
              Agendando para: <strong>{petName}</strong>
            </p>

            <div className="form-group">
              <label htmlFor="vetName">Veterinario</label>
              <input
                id="vetName"
                type="text"
                placeholder="Ej. Dr. Rodríguez"
                required
                value={vetName}
                onChange={(e) => setVetName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="appointmentDate">Fecha y Hora</label>
              <input
                id="appointmentDate"
                type="datetime-local"
                required
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="reason">Motivo de la Consulta</label>
              <textarea
                id="reason"
                placeholder="Describe brevemente el motivo o síntoma de tu mascota…"
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>

            {error && <p className="auth-error">{error}</p>}

            <div className="appt-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setStep(1)}
              >
                ← Atrás
              </button>
              <button type="submit" className="btn-primary" disabled={isLoading}>
                {isLoading ? <span className="btn-spinner"></span> : 'Confirmar Cita'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ScheduleAppointmentPage;
