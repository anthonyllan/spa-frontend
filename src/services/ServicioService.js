import axios from 'axios';

// Usar variables de entorno de Vite
const API_URL = import.meta.env.VITE_SERVICIO_API_URL || 'http://localhost:9000';
const REST_API_BASE_URL = `${API_URL}/api/servicios`;

// Crear una instancia de Axios con tiempos de espera aumentados
const axiosInstance = axios.create({
  timeout: 30000, // 30 segundos
  headers: {
    'Content-Type': 'application/json',
  }
});

export const listServicios = () => axiosInstance.get(REST_API_BASE_URL);

export const getServicioById = (id) => axiosInstance.get(`${REST_API_BASE_URL}/${id}`);

export const guardarServicio = (servicio) => axiosInstance.post(REST_API_BASE_URL, servicio);

export const actualizarServicio = (id, servicio) => axiosInstance.put(`${REST_API_BASE_URL}/${id}`, servicio);

export const eliminarServicio = (id) => axiosInstance.delete(`${REST_API_BASE_URL}/${id}`);