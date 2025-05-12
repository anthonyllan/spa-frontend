import React, { useEffect, useState } from 'react';
import { listProductos, guardarProducto, actualizarProducto, eliminarProducto } from '../services/ProductoService';
import { Modal, Button, Form } from 'react-bootstrap';

export const ProductosComponent = () => {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [currentProducto, setCurrentProducto] = useState({
    idProducto: '',
    nombreProducto: '',
    descripcionProducto: '',
    stock: 0
  });

  useEffect(() => {
    listProductos()
      .then((response) => setProductos(response.data))
      .catch((err) => setError(err.message));
  }, []);

  const handleShowModal = (type, producto = {}) => {
    setModalType(type);
    setCurrentProducto(producto);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProducto({ ...currentProducto, [name]: value });
  };

  const handleSubmit = () => {
    if (modalType === 'add') {
      guardarProducto(currentProducto)
        .then((response) => {
          setProductos([...productos, response.data]);
          handleCloseModal();
        })
        .catch((err) => setError(err.message));
    } else if (modalType === 'edit') {
      actualizarProducto(currentProducto.idProducto, currentProducto)
        .then((response) => {
          const updatedProductos = productos.map((producto) =>
            producto.idProducto === currentProducto.idProducto ? response.data : producto
          );
          setProductos(updatedProductos);
          handleCloseModal();
        })
        .catch((err) => setError(err.message));
    }
  };

  const handleDelete = (id) => {
    eliminarProducto(id)
      .then(() => {
        setProductos(productos.filter((producto) => producto.idProducto !== id));
      })
      .catch((err) => setError(err.message));
  };

  return (
    <div className="container mt-4">
      <h2>Lista de Productos</h2>
      {error && <p className="text-danger">Error: {error}</p>}
      <Button variant="primary" onClick={() => handleShowModal('add')}>Agregar Producto</Button>
      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>Identificador</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.idProducto}>
              <td>{producto.idProducto}</td>
              <td>{producto.nombreProducto}</td>
              <td>{producto.descripcionProducto}</td>
              <td>{producto.stock}</td>
              <td>
                <Button variant="warning" onClick={() => handleShowModal('edit', producto)}>Editar</Button>
                <Button variant="danger" onClick={() => handleDelete(producto.idProducto)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{modalType === 'add' ? 'Agregar Producto' : 'Editar Producto'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNombreProducto">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombreProducto"
                value={currentProducto.nombreProducto}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formDescripcionProducto">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                name="descripcionProducto"
                value={currentProducto.descripcionProducto}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formStock">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                name="stock"
                value={currentProducto.stock}
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