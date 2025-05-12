import axios from 'axios';

// Usar variables de entorno de Vite
const API_URL = import.meta.env.VITE_SERVICIO_API_URL || 'http://localhost:9000';
const REST_API_BASE_URL = `${API_URL}/api/categorias`;

export const listCategorias = () => axios.get(REST_API_BASE_URL);

export const getCategoriaById = (id) => axios.get(`${REST_API_BASE_URL}/${id}`);

export const guardarCategoria = (categoria) => axios.post(REST_API_BASE_URL, categoria);

export const actualizarCategoria = (id, categoria) => axios.put(`${REST_API_BASE_URL}/${id}`, categoria);

export const eliminarCategoria = (id) => axios.delete(`${REST_API_BASE_URL}/${id}`);