import axios from 'axios';

// Usar variables de entorno de Vite
const CITA_API_URL = import.meta.env.VITE_CITA_API_URL || 'http://localhost:9002';
const SERVICIO_API_URL = import.meta.env.VITE_SERVICIO_API_URL || 'http://localhost:9000';

// Base URLs para cada microservicio
const REST_API_BASE_URL_CITAS = `${CITA_API_URL}/api/citas`;
const REST_API_BASE_URL_SERVICIOS = `${SERVICIO_API_URL}/api/empleado-servicio/detallados`;

// Servicios para citas
export const listCitas = () => axios.get(REST_API_BASE_URL_CITAS);
export const guardarCita = (cita) => axios.post(REST_API_BASE_URL_CITAS, cita);

// Servicio para empleados y servicios combinados
export const listServiciosConEmpleados = () => axios.get(REST_API_BASE_URL_SERVICIOS);