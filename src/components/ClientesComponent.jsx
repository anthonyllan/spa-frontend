import React, { useEffect, useState } from 'react';
import { listClientes, guardarCliente, actualizarCliente, eliminarCliente } from '../services/ClienteService';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export const ClientesComponent = () => {
    const [clientes, setClientes] = useState([]);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('add');
    const [currentCliente, setCurrentCliente] = useState({
        idCliente: '',
        nombreCliente: '',
        apellidosCliente: '',
        correoCliente: ''
    });
    // Estado para errores de validación
    const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    listClientes()
      .then((response) => setClientes(response.data))
      .catch((err) => setError(err.message));
  }, []);

  const handleShowModal = (type, cliente = {}) => {
    setModalType(type);
    setCurrentCliente(cliente);
    setShowModal(true);
    // Limpiar errores de validación
    setValidationErrors({});
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Funciones de validación
  const validateNombre = (value) => {
    if (!value.trim()) {
      return "El nombre es obligatorio.";
    }
    if (/[0-9]/.test(value)) {
      return "El nombre no debe contener números.";
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/.test(value)) {
      return "El nombre solo debe contener letras y espacios.";
    }
    return "";
  };

  const validateApellidos = (value) => {
    if (!value.trim()) {
      return "Los apellidos son obligatorios.";
    }
    if (/[0-9]/.test(value)) {
      return "Los apellidos no deben contener números.";
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/.test(value)) {
      return "Los apellidos solo deben contener letras y espacios.";
    }
    return "";
  };

  const validateCorreo = (value) => {
    if (!value.trim()) {
      return "El correo electrónico es obligatorio.";
    }
    // Validación para correo electrónico común (@gmail.com, @outlook.com, etc.)
    const emailPattern = /^[a-zA-Z0-9._-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z0-9]{2,4}$/;
    if (!emailPattern.test(value)) {
      return "El formato de correo electrónico es inválido.";
    }
    // Verificar que sea un dominio común
    const validDomains = ["gmail.com", "outlook.com", "hotmail.com", "yahoo.com", "live.com"];
    const domain = value.split('@')[1];
    if (!validDomains.includes(domain)) {
      return "Por favor use un dominio de correo válido como @gmail.com";
    }
    return "";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCliente({ ...currentCliente, [name]: value });
    
    // Validación en tiempo real
    if (name === "nombreCliente") {
      const error = validateNombre(value);
      setValidationErrors({ ...validationErrors, [name]: error });
    } 
    else if (name === "apellidosCliente") {
      const error = validateApellidos(value);
      setValidationErrors({ ...validationErrors, [name]: error });
    } 
    else if (name === "correoCliente") {
      const error = validateCorreo(value);
      setValidationErrors({ ...validationErrors, [name]: error });
    }
  };

  const handleSubmit = () => {
    // Validar todos los campos antes de enviar
    const errors = {
      nombreCliente: validateNombre(currentCliente.nombreCliente),
      apellidosCliente: validateApellidos(currentCliente.apellidosCliente),
      correoCliente: validateCorreo(currentCliente.correoCliente)
    };

    // Verificar si hay errores
    if (Object.values(errors).some(error => error !== "")) {
      setValidationErrors(errors);
      return;
    }

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
            <th>Acciones</th>
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
                <Button variant="warning" className="me-2" onClick={() => handleShowModal('edit', cliente)}>Editar</Button>
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
            <Form.Group controlId="formNombreCliente" className="mb-3">
              <Form.Label>Nombre <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="nombreCliente"
                value={currentCliente.nombreCliente}
                onChange={handleInputChange}
                isInvalid={!!validationErrors.nombreCliente}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.nombreCliente}
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                Solo se permiten letras.
              </Form.Text>
            </Form.Group>
            
            <Form.Group controlId="formApellidosCliente" className="mb-3">
              <Form.Label>Apellidos <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="apellidosCliente"
                value={currentCliente.apellidosCliente}
                onChange={handleInputChange}
                isInvalid={!!validationErrors.apellidosCliente}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.apellidosCliente}
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                Solo se permiten letras.
              </Form.Text>
            </Form.Group>
            
            <Form.Group controlId="formCorreoCliente" className="mb-3">
              <Form.Label>Correo <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="email"
                name="correoCliente"
                value={currentCliente.correoCliente}
                onChange={handleInputChange}
                isInvalid={!!validationErrors.correoCliente}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.correoCliente}
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                Formato: ejemplo@gmail.com
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            disabled={Object.values(validationErrors).some(error => error !== "")}
          >
            {modalType === 'add' ? 'Agregar' : 'Guardar'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};