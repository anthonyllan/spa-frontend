import React, { useEffect, useState } from 'react';
import { listClientes, guardarCliente, actualizarCliente, eliminarCliente } from '../services/ClienteService';
import 'bootstrap/dist/css/bootstrap.min.css';

export const ClientesComponent = () => {
    const [clientes, setClientes] = useState([]);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);const [modalType, setModalType] = useState('add');
    const [currentCliente, setCurrentCliente] = useState({
        idCliente: '',
        nombreCliente: '',
        apellidosCliente: '',
        correoCliente: ''
});

  useEffect(() => {
    listClientes()
      .then((response) => setClientes(response.data))
      .catch((err) => setError(err.message));
  }, []);

  const handleShowModal = (type, cliente = {}) => {
    setModalType(type);
    setCurrentCliente(cliente);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCliente({ ...currentCliente, [name]: value });
  };

  const handleSubmit = () => {
    if (modalType === 'add') {
      guardarCliente(currentCliente)
        .then((response) => {
          setClientes([...clientes, response.data]);
          handleCloseModal();
        })
        .catch((err) => setError(err.message));
    } else if (modalType === 'edit') {
      actualizarCliente(currentCliente.idCliente, currentCliente)
        .then((response) => {
          const updatedClientes = clientes.map((cliente) =>
            cliente.idCliente === currentCliente.idCliente ? response.data : cliente
          );
          setClientes(updatedClientes);
          handleCloseModal();
        })
        .catch((err) => setError(err.message));
    }
  };

  const handleDelete = (id) => {
    eliminarCliente(id)
      .then(() => {
        setClientes(clientes.filter((cliente) => cliente.idCliente !== id));
      })
      .catch((err) => setError(err.message));
  };

  return (
    <div className="container mt-4">
      <h2>Lista de Clientes</h2>
      {error && <p className="text-danger">Error: {error}</p>}
      <Button variant="primary" onClick={() => handleShowModal('add')}>Agregar Cliente</Button>
      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>Identificador</th>
            <th>Nombre</th>
            <th>Apellidos</th>
            <th>Correo</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.idCliente}>
              <td>{cliente.idCliente}</td>
              <td>{cliente.nombreCliente}</td>
              <td>{cliente.apellidosCliente}</td>
              <td>{cliente.correoCliente}</td>
              <td>
                <Button variant="warning" onClick={() => handleShowModal('edit', cliente)}>Editar</Button>
                <Button variant="danger" onClick={() => handleDelete(cliente.idCliente)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{modalType === 'add' ? 'Agregar Cliente' : 'Editar Cliente'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNombreCliente">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombreCliente"
                value={currentCliente.nombreCliente}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formApellidosCliente">
              <Form.Label>Apellidos</Form.Label>
              <Form.Control
                type="text"
                name="apellidosCliente"
                value={currentCliente.apellidosCliente}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formCorreoCliente">
              <Form.Label>Correo</Form.Label>
              <Form.Control
                type="email"
                name="correoCliente"
                value={currentCliente.correoCliente}
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