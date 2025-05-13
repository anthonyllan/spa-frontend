import React, { useEffect, useState } from 'react';
import { listCitas, listServiciosConEmpleados } from '../services/AgendaCitaService';
import { listClientes } from '../services/ClienteService'; // Importamos el servicio de clientes
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './TableComponent.css';

export const AgendaCitaComponent = () => {
  const [citas, setCitas] = useState([]);
  const [serviciosConEmpleados, setServiciosConEmpleados] = useState([]);
  const [clientes, setClientes] = useState([]); // Estado para almacenar los clientes
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Obtener citas, servicios con empleados relacionados y clientes
    const fetchData = async () => {
      try {
        const [citasResponse, serviciosResponse, clientesResponse] = await Promise.all([
          listCitas(),
          listServiciosConEmpleados(),
          listClientes(), // Añadimos la llamada para obtener los clientes
        ]);

        console.log('Datos de citas:', citasResponse.data);
        console.log('Datos de servicios con empleados:', serviciosResponse.data);
        console.log('Datos de clientes:', clientesResponse.data);

        setCitas(citasResponse.data);
        setServiciosConEmpleados(serviciosResponse.data);
        setClientes(clientesResponse.data);
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError(`Error al cargar datos: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const findEmpleadoById = (idEmpleado) => {
    const empleado = serviciosConEmpleados.find((item) => item.idEmpleado === idEmpleado);
    if (!empleado) {
      console.warn(`Empleado con id ${idEmpleado} no encontrado.`);
      return null;
    }
    return empleado;
  };

  const findServicioById = (idServicio) => {
    const servicio = serviciosConEmpleados.find((item) => item.idServicio === idServicio);
    if (!servicio) {
      console.warn(`Servicio con id ${idServicio} no encontrado.`);
      return null;
    }
    return servicio;
  };

  // Nueva función para encontrar un cliente por su ID
  const findClienteById = (idCliente) => {
    const cliente = clientes.find((item) => item.idCliente === idCliente);
    if (!cliente) {
      console.warn(`Cliente con id ${idCliente} no encontrado.`);
      return null;
    }
    return cliente;
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando datos...</p>
      </div>
    );
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="container">
      <h2 className="elegant-title">Agenda de citas</h2>
      {citas.length > 0 ? (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th> {/* Nueva columna para el cliente */}
                <th>Empleado</th>
                <th>Servicio</th>
                <th>Fecha y Hora</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {citas.map((cita) => {
                const empleado = findEmpleadoById(cita.idEmpleado);
                const servicio = findServicioById(cita.idServicio);
                const cliente = findClienteById(cita.idCliente); // Obtenemos el cliente

                return (
                  <tr key={cita.idCita}>
                    <td>{cita.idCita}</td>
                    <td>
                      {cliente 
                        ? `${cliente.nombreCliente} ${cliente.apellidosCliente}` 
                        : 'Cliente no encontrado'}
                    </td>
                    <td>{empleado ? empleado.nombreEmpleado : 'Desconocido'}</td>
                    <td>{servicio ? servicio.nombreServicio : 'Desconocido'}</td>
                    <td>
                      {new Date(cita.fechaHora).toLocaleString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td>
                      <span className={`estado-badge estado-${cita.estado.toLowerCase()}`}>
                        {cita.estado}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📅</div>
          <p>No hay citas programadas actualmente.</p>
        </div>
      )}
    </div>
  );
};