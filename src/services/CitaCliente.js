import axios from 'axios';

// Usar variables de entorno de Vite
const CITA_API_URL = import.meta.env.VITE_CITA_API_URL || 'http://localhost:9002';
const SERVICIO_API_URL = import.meta.env.VITE_SERVICIO_API_URL || 'http://localhost:9000';

const REST_API_BASE_URL_CITAS = `${CITA_API_URL}/api/citas`;
const REST_API_BASE_URL_SERVICIOS = `${SERVICIO_API_URL}/api/servicios`;

// Crear una instancia de Axios con tiempos de espera aumentados
const axiosInstance = axios.create({
  timeout: 30000, // 30 segundos
  headers: {
    'Content-Type': 'application/json',
  }
});

export const listCitas = () => axiosInstance.get(REST_API_BASE_URL_CITAS);

export const guardarCita = (cita) => axiosInstance.post(REST_API_BASE_URL_CITAS, cita);

export const listServicios = () => axiosInstance.get(REST_API_BASE_URL_SERVICIOS);

export const getEmpleadosPorServicio = (idServicio) =>
    axiosInstance.get(`${SERVICIO_API_URL}/api/empleado-servicio/servicio/${idServicio}/empleados`);