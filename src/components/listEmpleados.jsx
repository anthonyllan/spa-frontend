import React, { useEffect, useState } from 'react';
import { listEmpleados, createEmpleado, updateEmpleado, deleteEmpleado } from '../services/EmpleadoService';
import { listEspecialidades } from '../services/EspecialidadService'; // Importa el servicio para especialidades
import { Modal, Button, Form } from 'react-bootstrap';

export const ListEmpleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [especialidades, setEspecialidades] = useState([]); // Estado para las especialidades
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [currentEmpleado, setCurrentEmpleado] = useState({
    idEmpleado: '',
    nombreEmpleado: '',
    apellidosEmpleado: '',
    telefonoEmpleado: '',
    correoEmpleado: '',
    idEspecialidad: '' // Ahora seleccionaremos desde un menú desplegable
  });

  // Función para cargar la lista de empleados
  const fetchEmpleados = () => {
    listEmpleados()
      .then((response) => {
        setEmpleados(
          response.data.map((empleado) => ({
            ...empleado,
            idEspecialidad: empleado.especialidad ? empleado.especialidad.idEspecialidad : ''
          }))
        );
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching empleados:", err);
        setError('Error al cargar la lista de empleados.');
      });
  };

  useEffect(() => {
    // Cargar empleados y especialidades al iniciar
    Promise.all([listEmpleados(), listEspecialidades()])
      .then(([empleadosData, especialidadesData]) => {
        setEmpleados(
          empleadosData.data.map((empleado) => ({
            ...empleado,
            idEspecialidad: empleado.especialidad ? empleado.especialidad.idEspecialidad : ''
          }))
        );
        setEspecialidades(especialidadesData.data);
      })
      .catch((err) => {
        console.error("Error loading data:", err);
        setError('Error al cargar los datos. Intente nuevamente.');
      });
  }, []);

  const handleShowModal = (type, empleado = null) => {
    setModalType(type);
    if (type === 'add') {
      setCurrentEmpleado({
        idEmpleado: '',
        nombreEmpleado: '',
        apellidosEmpleado: '',
        telefonoEmpleado: '',
        correoEmpleado: '',
        idEspecialidad: '' // Valor inicial vacío
      });
    } else if (type === 'edit' && empleado) {
      setCurrentEmpleado({
        ...empleado,
        idEspecialidad: empleado.especialidad ? empleado.especialidad.idEspecialidad : ''
      });
    }
    setError(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentEmpleado({
      idEmpleado: '',
      nombreEmpleado: '',
      apellidosEmpleado: '',
      telefonoEmpleado: '',
      correoEmpleado: '',
      idEspecialidad: ''
    });
    setError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentEmpleado({ ...currentEmpleado, [name]: value });
  };

  const handleSubmit = () => {
    if (!currentEmpleado.nombreEmpleado || !currentEmpleado.correoEmpleado) {
      setError("Nombre y Correo son campos obligatorios.");
      return;
    }

    // Formato correcto para el objeto empleado que se enviará a la API
    const empleadoDataToSend = {
      nombreEmpleado: currentEmpleado.nombreEmpleado,
      apellidosEmpleado: currentEmpleado.apellidosEmpleado,
      telefonoEmpleado: currentEmpleado.telefonoEmpleado,
      correoEmpleado: currentEmpleado.correoEmpleado,
      especialidad: {
        idEspecialidad: currentEmpleado.idEspecialidad ? parseInt(currentEmpleado.idEspecialidad, 10) : null
      }
    };

    // Si es una edición, incluir el ID del empleado
    if (modalType === 'edit') {
      empleadoDataToSend.idEmpleado = currentEmpleado.idEmpleado;
    }

    console.log("Datos a enviar:", empleadoDataToSend); // Para depuración

    if (modalType === 'add') {
      createEmpleado(empleadoDataToSend)
        .then((response) => {
          console.log("Respuesta del servidor:", response.data); // Para depuración
          fetchEmpleados();
          handleCloseModal();
        })
        .catch((err) => {
          console.error("Error completo:", err);
          let errorMsg = 'Error al crear el empleado.';
          
          if (err.response) {
            console.error("Datos del error:", err.response.data);
            console.error("Estado del error:", err.response.status);
            errorMsg = err.response.data?.message || `Error ${err.response.status}: ${err.message}`;
          } else if (err.request) {
            errorMsg = 'No se recibió respuesta del servidor';
          } else {
            errorMsg = err.message;
          }
          
          setError(errorMsg);
        });
    } else if (modalType === 'edit') {
      updateEmpleado(currentEmpleado.idEmpleado, empleadoDataToSend)
        .then((response) => {
          console.log("Respuesta del servidor:", response.data);
          fetchEmpleados();
          handleCloseModal();
        })
        .catch((err) => {
          console.error("Error completo:", err);
          let errorMsg = 'Error al actualizar el empleado.';
          
          if (err.response) {
            console.error("Datos del error:", err.response.data);
            console.error("Estado del error:", err.response.status);
            errorMsg = err.response.data?.message || `Error ${err.response.status}: ${err.message}`;
          } else if (err.request) {
            errorMsg = 'No se recibió respuesta del servidor';
          } else {
            errorMsg = err.message;
          }
          
          setError(errorMsg);
        });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este empleado?')) {
      deleteEmpleado(id)
        .then(() => {
          setEmpleados(empleados.filter((empleado) => empleado.idEmpleado !== id));
          setError(null);
        })
        .catch((err) => {
          console.error("Error deleting empleado:", err);
          setError(err.response?.data?.message || 'Error al eliminar el empleado.');
        });
    }
  };

  return (
    <div className="container mt-4">
      <h2>Lista de Empleados</h2>
      {error && !showModal && <p className="alert alert-danger">{error}</p>}
      <Button variant="primary" onClick={() => handleShowModal('add')} className="mb-3">
        Agregar Empleado
      </Button>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Identificador</th>
              <th>Nombre</th>
              <th>Apellidos</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Especialidad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empleados.length > 0 ? (
              empleados.map((empleado) => (
                <tr key={empleado.idEmpleado}>
                  <td>{empleado.idEmpleado}</td>
                  <td>{empleado.nombreEmpleado}</td>
                  <td>{empleado.apellidosEmpleado}</td>
                  <td>{empleado.correoEmpleado}</td>
                  <td>{empleado.telefonoEmpleado}</td>
                  <td>
                    {
                      empleado.especialidad?.nombreEspecialidad || 
                      especialidades.find(
                        (esp) => esp.idEspecialidad === empleado.idEspecialidad
                      )?.nombreEspecialidad || 
                      'Sin especialidad'
                    }
                  </td>
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => handleShowModal('edit', empleado)}
                      className="me-2"
                    >
                      Editar
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(empleado.idEmpleado)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">No hay empleados para mostrar.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal show={showModal} onHide={handleCloseModal} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>{modalType === 'add' ? 'Agregar Empleado' : 'Editar Empleado'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && showModal && <p className="alert alert-danger">{error}</p>}
          <Form>
            {modalType === 'edit' && (
              <Form.Group className="mb-3" controlId="formIdEmpleado">
                <Form.Label>ID Empleado</Form.Label>
                <Form.Control
                  type="text"
                  name="idEmpleado"
                  value={currentEmpleado.idEmpleado}
                  readOnly
                  disabled
                />
              </Form.Group>
            )}
            <Form.Group className="mb-3" controlId="formNombreEmpleado">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el nombre"
                name="nombreEmpleado"
                value={currentEmpleado.nombreEmpleado}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formApellidosEmpleado">
              <Form.Label>Apellidos</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese los apellidos"
                name="apellidosEmpleado"
                value={currentEmpleado.apellidosEmpleado}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formTelefonoEmpleado">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="tel"
                placeholder="Ingrese el teléfono"
                name="telefonoEmpleado"
                value={currentEmpleado.telefonoEmpleado}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formCorreoEmpleado">
              <Form.Label>Correo Electrónico</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingrese el correo"
                name="correoEmpleado"
                value={currentEmpleado.correoEmpleado}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formEspecialidad">
              <Form.Label>Especialidad</Form.Label>
              <Form.Select
                name="idEspecialidad"
                value={currentEmpleado.idEspecialidad}
                onChange={handleInputChange}
              >
                <option value="">Seleccione una especialidad</option>
                {especialidades.map((especialidad) => (
                  <option
                    key={especialidad.idEspecialidad}
                    value={especialidad.idEspecialidad}
                  >
                    {especialidad.nombreEspecialidad}
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
            {modalType === 'add' ? 'Agregar' : 'Guardar Cambios'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};