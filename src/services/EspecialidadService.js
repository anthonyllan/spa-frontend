import axios from 'axios';

// Usar variables de entorno de Vite
const API_URL = import.meta.env.VITE_EMPLEADO_API_URL || 'http://localhost:9001';
const REST_API_BASE_URL = `${API_URL}/api/especialidades`;

export const listEspecialidades = () => axios.get(REST_API_BASE_URL);

export const getEspecialidadById = (id) => axios.get(`${REST_API_BASE_URL}/${id}`);

export const guardarEspecialidad = (especialidad) => axios.post(REST_API_BASE_URL, especialidad);

export const actualizarEspecialidad = (id, especialidad) => axios.put(`${REST_API_BASE_URL}/${id}`, especialidad);

export const eliminarEspecialidad = (id) => axios.delete(`${REST_API_BASE_URL}/${id}`);