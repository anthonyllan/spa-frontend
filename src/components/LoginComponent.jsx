import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { guardarCliente, listClientes } from '../services/ClienteService';
import './LoginComponent.css';

const LoginComponent = ({ isRegistration = false }) => {
  const [activeTab, setActiveTab] = useState(isRegistration ? 'register' : 'login');
  const [formData, setFormData] = useState({
    correoCliente: '',
    password: '',
    nombreCliente: '',
    apellidosCliente: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loginAsCliente, loginAsAdmin } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (activeTab === 'login') {
        // Verificar si es el administrador
        if (formData.correoCliente === 'admin@spadivine.mx' && formData.password === 'admin123') {
          loginAsAdmin();
          navigate('/inicio');
          return;
        }

        // Buscar cliente por correo electrónico
        const response = await listClientes();
        const cliente = response.data.find(
          c => c.correoCliente === formData.correoCliente
        );

        if (!cliente) {
          setError('Usuario no encontrado');
          setLoading(false);
          return;
        }

        // En un sistema real, verificarías la contraseña aquí
        // Por ahora, simplemente iniciamos sesión con el cliente encontrado
        
        loginAsCliente(cliente);
        navigate('/cita-cliente');
      } else {
        // Registro de nuevo cliente
        // Validar que todos los campos estén completos
        if (!formData.nombreCliente || !formData.apellidosCliente || !formData.correoCliente) {
          setError('Todos los campos son obligatorios');
          setLoading(false);
          return;
        }

        // Crear el nuevo cliente
        const nuevoCliente = {
          nombreCliente: formData.nombreCliente,
          apellidosCliente: formData.apellidosCliente,
          correoCliente: formData.correoCliente
          // En un sistema real, guardarías también la contraseña (encriptada)
        };

        const response = await guardarCliente(nuevoCliente);
        loginAsCliente(response.data);
        navigate('/cita-cliente');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.message || 'Error al procesar la solicitud');
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2 className="login-title">Spa Divine</h2>
          <p className="login-subtitle">Tu momento de bienestar comienza aquí</p>
        </div>

        <div className="login-tabs">
          <button 
            className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Iniciar Sesión
          </button>
          <button 
            className={`tab-btn ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => setActiveTab('register')}
          >
            Registrarse
          </button>
        </div>
        
        {error && <div className="login-error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label" htmlFor="correoCliente">Correo Electrónico</label>
            <input
              type="email"
              id="correoCliente"
              name="correoCliente"
              className="form-control"
              value={formData.correoCliente}
              onChange={handleChange}
              placeholder="ejemplo@correo.com"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              placeholder="Ingresa tu contraseña"
              required
            />
          </div>
          
          {activeTab === 'register' && (
            <>
              <div className="form-group">
                <label className="form-label" htmlFor="nombreCliente">Nombre</label>
                <input
                  type="text"
                  id="nombreCliente"
                  name="nombreCliente"
                  className="form-control"
                  value={formData.nombreCliente}
                  onChange={handleChange}
                  placeholder="Tu nombre"
                  required={activeTab === 'register'}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label" htmlFor="apellidosCliente">Apellidos</label>
                <input
                  type="text"
                  id="apellidosCliente"
                  name="apellidosCliente"
                  className="form-control"
                  value={formData.apellidosCliente}
                  onChange={handleChange}
                  placeholder="Tus apellidos"
                  required={activeTab === 'register'}
                />
              </div>
            </>
          )}
          
          <button 
            className="btn-login" 
            type="submit"
            disabled={loading}
          >
            {loading ? 'Procesando...' : activeTab === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </button>
        </form>
        
        {activeTab === 'login' && (
          <div className="login-help">
            <a href="#" className="forgot-password">¿Olvidaste tu contraseña?</a>
          </div>
        )}
        
        <div className="login-decoration">
          <div className="decoration-circle"></div>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;