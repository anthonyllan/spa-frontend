import React, { useEffect, useState } from 'react';
import { listEmpleadoServiciosDetallados, guardarEmpleadoServicio, eliminarEmpleadoServicio } from '../services/EmpleadoServicioService';
import { listEmpleados } from '../services/EmpleadoService';
import { listServicios } from '../services/ServicioService';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';

export const EmpleadoServicioComponent = () => {
  const [empleadoServicios, setEmpleadoServicios] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentAsignacion, setCurrentAsignacion] = useState({
    idEmpleado: '',
    idServicio: ''
  });

  // Cargar datos al inicializar el componente
  useEffect(() => {
    setLoading(true);
    Promise.all([
      listEmpleadoServiciosDetallados(),
      listEmpleados(),
      listServicios()
    ])
      .then(([asignacionesData, empleadosData, serviciosData]) => {
        setEmpleadoServicios(asignacionesData.data);
        setEmpleados(empleadosData.data);
        setServicios(serviciosData.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error cargando datos:", err);
        setError("Error al cargar los datos. Por favor, intente nuevamente.");
        setLoading(false);
      });
  }, []);

  const fetchAsignaciones = () => {
    listEmpleadoServiciosDetallados()
      .then((response) => {
        setEmpleadoServicios(response.data);
      })
      .catch((err) => {
        setError("Error al recargar las asignaciones.");
        console.error("Error fetching asignaciones:", err);
      });
  };

  const handleShowModal = () => {
    setCurrentAsignacion({ idEmpleado: '', idServicio: '' });
    setShowModal(true);
    setError(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentAsignacion({ ...currentAsignacion, [name]: value });
  };

  const handleSubmit = () => {
    // Validación básica
    if (!currentAsignacion.idEmpleado || !currentAsignacion.idServicio) {
      setError("Debe seleccionar un empleado y un servicio.");
      return;
    }

    // Verificar si la asignación ya existe
    const asignacionExistente = empleadoServicios.find(
      (as) => as.idEmpleado.toString() === currentAsignacion.idEmpleado && 
              as.idServicio.toString() === currentAsignacion.idServicio
    );

    if (asignacionExistente) {
      setError("Esta asignación ya existe.");
      return;
    }

    guardarEmpleadoServicio(currentAsignacion)
      .then(() => {
        fetchAsignaciones();
        handleCloseModal();
      })
      .catch((err) => {
        console.error("Error al guardar asignación:", err);
        setError(err.response?.data?.message || "Error al guardar la asignación.");
      });
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta asignación?')) {
      eliminarEmpleadoServicio(id)
        .then(() => {
          fetchAsignaciones();
        })
        .catch((err) => {
          console.error("Error al eliminar asignación:", err);
          setError(err.response?.data?.message || "Error al eliminar la asignación.");
        });
    }
  };

  if (loading) {
    return <div className="d-flex justify-content-center mt-5"><div className="spinner-border" role="status"></div></div>;
  }

  return (
    <div className="container mt-4">
      <h2>Asignación de Servicios a Empleados</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <Button variant="primary" onClick={handleShowModal} className="mb-3">
        Nueva Asignación
      </Button>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Empleado</th>
              <th>Servicio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empleadoServicios.length > 0 ? (
              empleadoServicios.map((asignacion) => (
                <tr key={asignacion.id}>
                  <td>{asignacion.id}</td>
                  <td>{asignacion.nombreEmpleado || `ID: ${asignacion.idEmpleado}`}</td>
                  <td>{asignacion.nombreServicio || `ID: ${asignacion.idServicio}`}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(asignacion.id)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">No hay asignaciones para mostrar.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal para agregar asignación */}
      <Modal show={showModal} onHide={handleCloseModal} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Asignar Servicio a Empleado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <div className="alert alert-danger">{error}</div>}
          <Form>
            <Form.Group className="mb-3" controlId="formEmpleado">
              <Form.Label>Empleado</Form.Label>
              <Form.Select
                name="idEmpleado"
                value={currentAsignacion.idEmpleado}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccione un empleado</option>
                {empleados.map((empleado) => (
                  <option key={empleado.idEmpleado} value={empleado.idEmpleado}>
                    {empleado.nombreEmpleado} {empleado.apellidosEmpleado}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formServicio">
              <Form.Label>Servicio</Form.Label>
              <Form.Select
                name="idServicio"
                value={currentAsignacion.idServicio}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccione un servicio</option>
                {servicios.map((servicio) => (
                  <option key={servicio.idServicio} value={servicio.idServicio}>
                    {servicio.nombreServicio}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Guardar Asignación
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};