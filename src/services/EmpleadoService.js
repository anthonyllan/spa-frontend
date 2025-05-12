import axios from 'axios';

// Usar variables de entorno de Vite
const API_URL = import.meta.env.VITE_EMPLEADO_API_URL || 'http://localhost:9001';
const REST_API_BASE_URL = `${API_URL}/r/empleado`;

// Obtener todos los empleados
export const listEmpleados = () => axios.get(REST_API_BASE_URL);

// Obtener empleado por ID
export const getEmpleadoById = (id) => axios.get(`${REST_API_BASE_URL}/${id}`);

// Crear nuevo empleado
export const createEmpleado = (empleado) => axios.post(REST_API_BASE_URL, empleado);

// Actualizar empleado
export const updateEmpleado = (id, empleado) => axios.put(`${REST_API_BASE_URL}/${id}`, empleado);

// Eliminar empleado
export const deleteEmpleado = (id) => axios.delete(`${REST_API_BASE_URL}/${id}`);