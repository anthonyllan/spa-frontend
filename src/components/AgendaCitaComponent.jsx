import React, { useEffect, useState } from 'react';
import { listCitas, listServiciosConEmpleados } from '../services/AgendaCitaService';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './TableComponent.css';

export const AgendaCitaComponent = () => {
  const [citas, setCitas] = useState([]);
  const [serviciosConEmpleados, setServiciosConEmpleados] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Obtener citas y servicios con empleados relacionados
    const fetchData = async () => {
      try {
        const [citasResponse, serviciosResponse] = await Promise.all([
          listCitas(),
          listServiciosConEmpleados(),
        ]);

        console.log('Datos de citas:', citasResponse.data);
        console.log('Datos de servicios con empleados:', serviciosResponse.data);

        setCitas(citasResponse.data);
        setServiciosConEmpleados(serviciosResponse.data);
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

  if (isLoading) {
    return <p>Cargando datos...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="container">
      <h2>Agenda de citas</h2>
      {citas.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>ID Cita</th>
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

              return (
                <tr key={cita.idCita}>
                  <td>{cita.idCita}</td>
                  <td>{empleado ? empleado.nombreEmpleado : 'Desconocido'}</td>
                  <td>{servicio ? servicio.nombreServicio : 'Desconocido'}</td>
                  <td>{new Date(cita.fechaHora).toLocaleString()}</td>
                  <td>{cita.estado}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>No hay citas disponibles.</p>
      )}
    </div>
  );
};