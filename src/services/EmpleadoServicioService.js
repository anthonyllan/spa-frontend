import axios from 'axios';

// Usar variables de entorno de Vite
const API_URL = import.meta.env.VITE_SERVICIO_API_URL || 'http://localhost:9000';
const REST_API_BASE_URL = `${API_URL}/api/empleado-servicio`;

// Obtener todos los empleados-servicios
export const listEmpleadoServicios = () => axios.get(REST_API_BASE_URL);

// Obtener relación específica
export const getEmpleadoServicioById = (id) => axios.get(`${REST_API_BASE_URL}/${id}`);

// Crear nueva relación empleado-servicio
export const guardarEmpleadoServicio = (empleadoServicio) => 
  axios.post(REST_API_BASE_URL, empleadoServicio);

// Actualizar relación empleado-servicio
export const actualizarEmpleadoServicio = (id, empleadoServicio) => 
  axios.put(`${REST_API_BASE_URL}/${id}`, empleadoServicio);

// Eliminar relación empleado-servicio
export const eliminarEmpleadoServicio = (id) => 
  axios.delete(`${REST_API_BASE_URL}/${id}`);

// Obtener todas las relaciones detalladas
export const listEmpleadoServiciosDetallados = () => 
  axios.get(`${REST_API_BASE_URL}/detallados`);