import axios from 'axios';

const AUTH_BASE = import.meta.env.VITE_API_AUTH_URL || 'http://localhost:3001';
const APPT_BASE = import.meta.env.VITE_API_APPOINTMENTS_URL || 'http://localhost:3002';

// --- Instancia para el Servicio de Autenticación ---
export const authApi = axios.create({ baseURL: AUTH_BASE });

// --- Instancia para el Servicio de Citas ---
export const appointmentApi = axios.create({ baseURL: APPT_BASE });

// Interceptor: Inyectar JWT automáticamente en cada llamada al servicio de Citas
appointmentApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('pethealth_jwt');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Tipos de respuesta para mejor tipado en los componentes
export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface AppointmentPayload {
  pet_name: string;
  vet_name: string;
  appointment_date: string;
  reason: string;
}
