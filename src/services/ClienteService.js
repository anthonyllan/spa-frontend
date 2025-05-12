import axios from 'axios';

// Usar variables de entorno de Vite
const API_URL = import.meta.env.VITE_CITA_API_URL || 'http://localhost:9002';
const REST_API_BASE_URL = `${API_URL}/api/clientes`;

export const listClientes = () => axios.get(REST_API_BASE_URL);

// Obtener Cliente por ID
export const getClienteById = (id) => axios.get(`${REST_API_BASE_URL}/${id}`);

// Crear nuevo Cliente
export const guardarCliente = (cliente) => axios.post(REST_API_BASE_URL, cliente);

// Actualizar Cliente
export const actualizarCliente = (id, cliente) => axios.put(`${REST_API_BASE_URL}/${id}`, cliente);

// Eliminar Cliente
export const eliminarCliente = (id) => axios.delete(`${REST_API_BASE_URL}/${id}`);