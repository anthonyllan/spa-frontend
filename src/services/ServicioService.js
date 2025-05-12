import axios from 'axios';

// Usar variables de entorno de Vite
const API_URL = import.meta.env.VITE_SERVICIO_API_URL || 'http://localhost:9000';
const REST_API_BASE_URL = `${API_URL}/api/servicios`;

export const listServicios = () => axios.get(REST_API_BASE_URL);

export const getServicioById = (id) => axios.get(`${REST_API_BASE_URL}/${id}`);

export const guardarServicio = (servicio) => axios.post(REST_API_BASE_URL, servicio);

export const actualizarServicio = (id, servicio) => axios.put(`${REST_API_BASE_URL}/${id}`, servicio);

export const eliminarServicio = (id) => axios.delete(`${REST_API_BASE_URL}/${id}`);