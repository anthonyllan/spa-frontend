import React, { useEffect, useState } from 'react';
import { listEspecialidades, guardarEspecialidad, actualizarEspecialidad, eliminarEspecialidad } from '../services/EspecialidadService';
import { Modal, Button, Form } from 'react-bootstrap';

export const EspecialidadesComponent = () => {
  const [especialidades, setEspecialidades] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [currentEspecialidad, setCurrentEspecialidad] = useState({
    idEspecialidad: '',
    nombreEspecialidad: '',
  });

  useEffect(() => {
    listEspecialidades()
      .then((response) => setEspecialidades(response.data))
      .catch((err) => setError(err.message));
  }, []);

  const handleShowModal = (type, especialidad = {}) => {
    setModalType(type);
    setCurrentEspecialidad(especialidad);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentEspecialidad({ ...currentEspecialidad, [name]: value });
  };

  const handleSubmit = () => {
    if (modalType === 'add') {
      guardarEspecialidad(currentEspecialidad)
        .then((response) => {
          setEspecialidades([...especialidades, response.data]);
          handleCloseModal();
        })
        .catch((err) => setError(err.message));
    } else if (modalType === 'edit') {
      actualizarEspecialidad(currentEspecialidad.idEspecialidad, currentEspecialidad)
        .then((response) => {
          const updatedEspecialidades = especialidades.map((especialidad) =>
            especialidad.idEspecialidad === currentEspecialidad.idEspecialidad ? response.data : especialidad
          );
          setEspecialidades(updatedEspecialidades);
          handleCloseModal();
        })
        .catch((err) => setError(err.message));
    }
  };

  const handleDelete = (id) => {
    eliminarEspecialidad(id)
      .then(() => {
        setEspecialidades(especialidades.filter((especialidad) => especialidad.idEspecialidad !== id));
      })
      .catch((err) => setError(err.message));
  };

  return (
    <div className="container mt-4">
      <h2>Lista de Especialidades</h2>
      {error && <p className="text-danger">Error: {error}</p>}
      <Button variant="primary" onClick={() => handleShowModal('add')}>Agregar Especialidad</Button>
      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>Identificador</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {especialidades.map((especialidad) => (
            <tr key={especialidad.idEspecialidad}>
              <td>{especialidad.idEspecialidad}</td>
              <td>{especialidad.nombreEspecialidad}</td>
              <td>
                <Button variant="warning" onClick={() => handleShowModal('edit', especialidad)}>Editar</Button>
                <Button variant="danger" onClick={() => handleDelete(especialidad.idEspecialidad)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{modalType === 'add' ? 'Agregar Especialidad' : 'Editar Especialidad'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNombreEspecialidad">
              <Form.Label>Nombre de la Especialidad</Form.Label>
              <Form.Control
                type="text"
                name="nombreEspecialidad"
                value={currentEspecialidad.nombreEspecialidad}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {modalType === 'add' ? 'Agregar' : 'Guardar'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};