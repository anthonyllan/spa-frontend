import React, { useEffect, useState } from 'react';
import { listCategorias, guardarCategoria, actualizarCategoria, eliminarCategoria } from '../services/CategoriaService';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

export const CategoriasComponent = () => {
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [currentCategoria, setCurrentCategoria] = useState({
    idCategoria: '',
    nombreCategoria: '',
  });
  // Estado para errores de validación
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    listCategorias()
      .then((response) => setCategorias(response.data))
      .catch((err) => setError(err.message));
  }, []);

  const handleShowModal = (type, categoria = {}) => {
    setModalType(type);
    setCurrentCategoria(categoria);
    setShowModal(true);
    // Limpiar errores de validación al abrir el modal
    setValidationErrors({});
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Validación para nombre de categoría (solo letras y espacios)
  const validateNombreCategoria = (value) => {
    if (!value.trim()) {
      return "El nombre de la categoría es obligatorio.";
    }
    if (/[0-9]/.test(value)) {
      return "El nombre no debe contener números.";
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/.test(value)) {
      return "El nombre solo debe contener letras y espacios.";
    }
    return "";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCategoria({ ...currentCategoria, [name]: value });
    
    // Validar en tiempo real
    if (name === "nombreCategoria") {
      const error = validateNombreCategoria(value);
      setValidationErrors({
        ...validationErrors,
        [name]: error
      });
    }
  };

  const handleSubmit = () => {
    // Validar todos los campos antes de enviar
    const nombreError = validateNombreCategoria(currentCategoria.nombreCategoria);
    
    if (nombreError) {
      setValidationErrors({
        nombreCategoria: nombreError
      });
      return; // Detener el envío si hay errores
    }

    if (modalType === 'add') {
      guardarCategoria(currentCategoria)
        .then((response) => {
          setCategorias([...categorias, response.data]);
          handleCloseModal();
        })
        .catch((err) => setError(err.message));
    } else if (modalType === 'edit') {
      actualizarCategoria(currentCategoria.idCategoria, currentCategoria)
        .then((response) => {
          const updatedCategorias = categorias.map((categoria) =>
            categoria.idCategoria === currentCategoria.idCategoria ? response.data : categoria
          );
          setCategorias(updatedCategorias);
          handleCloseModal();
        })
        .catch((err) => setError(err.message));
    }
  };

  const handleDelete = (id) => {
    eliminarCategoria(id)
      .then(() => {
        setCategorias(categorias.filter((categoria) => categoria.idCategoria !== id));
      })
      .catch((err) => setError(err.message));
  };

  return (
    <div className="container mt-4">
      <h2>Lista de Categorías</h2>
      {error && <p className="text-danger">Error: {error}</p>}
      <Button variant="primary" onClick={() => handleShowModal('add')}>Agregar Categoría</Button>
      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>Identificador</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((categoria) => (
            <tr key={categoria.idCategoria}>
              <td>{categoria.idCategoria}</td>
              <td>{categoria.nombreCategoria}</td>
              <td>
                <Button variant="warning" className="me-2" onClick={() => handleShowModal('edit', categoria)}>Editar</Button>
                <Button variant="danger" onClick={() => handleDelete(categoria.idCategoria)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{modalType === 'add' ? 'Agregar Categoría' : 'Editar Categoría'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNombreCategoria">
              <Form.Label>Nombre de la Categoría</Form.Label>
              <Form.Control
                type="text"
                name="nombreCategoria"
                value={currentCategoria.nombreCategoria}
                onChange={handleInputChange}
                isInvalid={!!validationErrors.nombreCategoria}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.nombreCategoria}
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                El nombre solo debe contener letras.
              </Form.Text>
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