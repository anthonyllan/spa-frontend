import axios from 'axios';

// Usar variables de entorno de Vite
const API_URL = import.meta.env.VITE_SERVICIO_API_URL || 'http://localhost:9000';
const REST_API_BASE_URL = `${API_URL}/api/productos`;

export const listProductos = () => axios.get(REST_API_BASE_URL);

export const getProductoById = (id) => axios.get(`${REST_API_BASE_URL}/${id}`);

export const guardarProducto = (producto) => axios.post(REST_API_BASE_URL, producto);

export const actualizarProducto = (id, producto) => axios.put(`${REST_API_BASE_URL}/${id}`, producto);

export const eliminarProducto = (id) => axios.delete(`${REST_API_BASE_URL}/${id}`);