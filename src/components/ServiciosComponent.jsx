import React, { useEffect, useState } from 'react';
import { listServicios, guardarServicio, actualizarServicio, eliminarServicio } from '../services/ServicioService';
import { listCategorias } from '../services/CategoriaService';
import { listProductos } from '../services/ProductoService';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';

export const ServiciosComponent = () => {
  const [servicios, setServicios] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [currentServicio, setCurrentServicio] = useState({
    idServicio: '',
    nombreServicio: '',
    descripcionServicio: '',
    categoria: {
      idCategoria: '',
      nombreCategoria: ''
    },
    producto: {
      idProducto: '',
      nombreProducto: ''
    }
  });

  useEffect(() => {
    // Cargar servicios, categorías y productos al iniciar
    Promise.all([listServicios(), listCategorias(), listProductos()])
      .then(([serviciosData, categoriasData, productosData]) => {
        setServicios(serviciosData.data);
        setCategorias(categoriasData.data);
        setProductos(productosData.data);
      })
      .catch((err) => setError(err.message));
  }, []);

  const handleShowModal = (type, servicio = {}) => {
    setModalType(type);
    setCurrentServicio({
      idServicio: servicio.idServicio || '',
      nombreServicio: servicio.nombreServicio || '',
      descripcionServicio: servicio.descripcionServicio || '',
      categoria: servicio.categoria || { idCategoria: '', nombreCategoria: '' },
      producto: servicio.producto || { idProducto: '', nombreProducto: '' }
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('categoria.')) {
      setCurrentServicio((prevState) => ({
        ...prevState,
        categoria: { ...prevState.categoria, idCategoria: value }
      }));
    } else if (name.startsWith('producto.')) {
      setCurrentServicio((prevState) => ({
        ...prevState,
        producto: { ...prevState.producto, idProducto: value }
      }));
    } else {
      setCurrentServicio({ ...currentServicio, [name]: value });
    }
  };

  const handleSubmit = () => {
    if (modalType === 'add') {
      guardarServicio(currentServicio)
        .then((response) => {
          setServicios([...servicios, response.data]);
          handleCloseModal();
        })
        .catch((err) => setError(err.message));
    } else if (modalType === 'edit') {
      actualizarServicio(currentServicio.idServicio, currentServicio)
        .then((response) => {
          const updatedServicios = servicios.map((servicio) =>
            servicio.idServicio === currentServicio.idServicio ? response.data : servicio
          );
          setServicios(updatedServicios);
          handleCloseModal();
        })
        .catch((err) => setError(err.message));
    }
  };

  const handleDelete = (id) => {
    eliminarServicio(id)
      .then(() => {
        setServicios(servicios.filter((servicio) => servicio.idServicio !== id));
      })
      .catch((err) => setError(err.message));
  };

  return (
    <div className="container mt-4">
      <h2>Lista de Servicios</h2>
      {error && <p className="text-danger">Error: {error}</p>}
      <Button variant="primary" onClick={() => handleShowModal('add')}>Agregar Servicio</Button>
      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>Identificador</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Categoría</th>
            <th>Producto</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {servicios.map((servicio) => (
            <tr key={servicio.idServicio}>
              <td>{servicio.idServicio}</td>
              <td>{servicio.nombreServicio}</td>
              <td>{servicio.descripcionServicio}</td>
              <td>{servicio.categoria?.nombreCategoria || ''}</td>
              <td>{servicio.producto?.nombreProducto || ''}</td>
              <td>
                <Button variant="warning" onClick={() => handleShowModal('edit', servicio)}>Editar</Button>
                <Button variant="danger" onClick={() => handleDelete(servicio.idServicio)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{modalType === 'add' ? 'Agregar Servicio' : 'Editar Servicio'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNombreServicio">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombreServicio"
                value={currentServicio.nombreServicio}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formDescripcionServicio">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                name="descripcionServicio"
                value={currentServicio.descripcionServicio}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formCategoria">
              <Form.Label>Categoría</Form.Label>
              <Form.Control
                as="select"
                name="categoria.idCategoria"
                value={currentServicio.categoria.idCategoria}
                onChange={handleInputChange}
              >
                <option value="">Seleccione una categoría</option>
                {categorias.map((categoria) => (
                  <option key={categoria.idCategoria} value={categoria.idCategoria}>
                    {categoria.nombreCategoria}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formProducto">
              <Form.Label>Producto</Form.Label>
              <Form.Control
                as="select"
                name="producto.idProducto"
                value={currentServicio.producto.idProducto}
                onChange={handleInputChange}
              >
                <option value="">Seleccione un producto</option>
                {productos.map((producto) => (
                  <option key={producto.idProducto} value={producto.idProducto}>
                    {producto.nombreProducto}
                  </option>
                ))}
              </Form.Control>
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