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

  const fetchServicios = () => {
    listServicios()
      .then((response) => {
        setServicios(response.data);
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching servicios:", err);
        setError('Error al cargar la lista de servicios.');
      });
  };

  useEffect(() => {
    // Cargar servicios, categorías y productos al iniciar
    Promise.all([listServicios(), listCategorias(), listProductos()])
      .then(([serviciosData, categoriasData, productosData]) => {
        setServicios(serviciosData.data);
        setCategorias(categoriasData.data);
        setProductos(productosData.data);
        setError(null);
      })
      .catch((err) => {
        console.error("Error loading data:", err);
        setError('Error al cargar los datos. Intente nuevamente.');
      });
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
    setError(null);
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
    // Validar campos requeridos
    if (!currentServicio.nombreServicio) {
      setError("El nombre del servicio es obligatorio.");
      return;
    }
    
    // Crear un objeto de datos con el formato correcto para la API
    const servicioDataToSend = {
      nombreServicio: currentServicio.nombreServicio,
      descripcionServicio: currentServicio.descripcionServicio,
      categoria: {
        idCategoria: currentServicio.categoria.idCategoria ? parseInt(currentServicio.categoria.idCategoria, 10) : null
      },
      producto: {
        idProducto: currentServicio.producto.idProducto ? parseInt(currentServicio.producto.idProducto, 10) : null
      }
    };

    // Si es una edición, incluir el ID
    if (modalType === 'edit') {
      servicioDataToSend.idServicio = currentServicio.idServicio;
    }

    console.log("Datos a enviar:", servicioDataToSend);

    if (modalType === 'add') {
      guardarServicio(servicioDataToSend)
        .then((response) => {
          console.log("Servicio creado exitosamente:", response.data);
          fetchServicios();
          handleCloseModal();
        })
        .catch((err) => {
          console.error("Error completo:", err);
          let errorMsg = 'Error al crear el servicio.';
          
          if (err.response) {
            console.error("Datos del error:", err.response.data);
            console.error("Estado del error:", err.response.status);
            errorMsg = err.response.data?.message || `Error ${err.response.status}: ${err.message}`;
          } else if (err.request) {
            errorMsg = 'No se recibió respuesta del servidor (timeout). Intente nuevamente.';
          } else {
            errorMsg = err.message;
          }
          
          setError(errorMsg);
        });
    } else if (modalType === 'edit') {
      actualizarServicio(currentServicio.idServicio, servicioDataToSend)
        .then((response) => {
          console.log("Servicio actualizado exitosamente:", response.data);
          fetchServicios();
          handleCloseModal();
        })
        .catch((err) => {
          console.error("Error completo:", err);
          let errorMsg = 'Error al actualizar el servicio.';
          
          if (err.response) {
            console.error("Datos del error:", err.response.data);
            errorMsg = err.response.data?.message || `Error ${err.response.status}: ${err.message}`;
          } else if (err.request) {
            errorMsg = 'No se recibió respuesta del servidor (timeout). Intente nuevamente.';
          } else {
            errorMsg = err.message;
          }
          
          setError(errorMsg);
        });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este servicio?')) {
      eliminarServicio(id)
        .then(() => {
          setServicios(servicios.filter((servicio) => servicio.idServicio !== id));
          setError(null);
        })
        .catch((err) => {
          console.error("Error deleting servicio:", err);
          setError(err.response?.data?.message || 'Error al eliminar el servicio.');
        });
    }
  };

  return (
    <div className="container mt-4">
      <h2>Lista de Servicios</h2>
      {error && <p className="alert alert-danger">{error}</p>}
      <Button variant="primary" onClick={() => handleShowModal('add')} className="mb-3">
        Agregar Servicio
      </Button>
      <div className="table-responsive">
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
            {servicios.length > 0 ? (
              servicios.map((servicio) => (
                <tr key={servicio.idServicio}>
                  <td>{servicio.idServicio}</td>
                  <td>{servicio.nombreServicio}</td>
                  <td>{servicio.descripcionServicio}</td>
                  <td>{servicio.categoria?.nombreCategoria || ''}</td>
                  <td>{servicio.producto?.nombreProducto || ''}</td>
                  <td>
                    <Button 
                      variant="warning" 
                      onClick={() => handleShowModal('edit', servicio)}
                      className="me-2"
                    >
                      Editar
                    </Button>
                    <Button 
                      variant="danger" 
                      onClick={() => handleDelete(servicio.idServicio)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">No hay servicios para mostrar</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{modalType === 'add' ? 'Agregar Servicio' : 'Editar Servicio'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && showModal && <p className="alert alert-danger">{error}</p>}
          <Form>
            <Form.Group className="mb-3" controlId="formNombreServicio">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombreServicio"
                value={currentServicio.nombreServicio}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formDescripcionServicio">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                name="descripcionServicio"
                value={currentServicio.descripcionServicio}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formCategoria">
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
            <Form.Group className="mb-3" controlId="formProducto">
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