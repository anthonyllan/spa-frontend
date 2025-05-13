import React, { useState, useEffect } from 'react';
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
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [animating, setAnimating] = useState(false);
  const navigate = useNavigate();
  const { loginAsCliente, loginAsAdmin } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const switchTab = (tab) => {
    if (tab === activeTab) return;
    
    setAnimating(true);
    setTimeout(() => {
      setActiveTab(tab);
      setAnimating(false);
      setError('');
      setSuccess('');
    }, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (activeTab === 'login') {
        // Verificar si es el administrador
        if (formData.correoCliente === 'admin@spadivine.mx' && formData.password === 'admin123') {
          loginAsAdmin();
          setSuccess('Acceso concedido. Redirigiendo...');
          setTimeout(() => navigate('/inicio'), 1500);
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

        // En un sistema real, verificaríamos la contraseña aquí
        loginAsCliente(cliente);
        setSuccess('Bienvenido/a de nuevo. Redirigiendo...');
        setTimeout(() => navigate('/cita-cliente'), 1500);
        
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
        setSuccess('Cuenta creada con éxito. Redirigiendo...');
        setTimeout(() => navigate('/cita-cliente'), 1500);
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.message || 'Error al procesar la solicitud');
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-decorations">
          <div className="auth-decoration top-left"></div>
          <div className="auth-decoration bottom-right"></div>
        </div>
        
        <div className="auth-header">
          <h2 className="auth-title">
            <span className="auth-brand-name">Spa Divine</span>
          </h2>
          <p className="auth-tagline">Tu experiencia de bienestar</p>
        </div>
        
        <div className="auth-tabs">
          <button 
            className={`auth-tab-btn ${activeTab === 'login' ? 'active' : ''}`} 
            onClick={() => switchTab('login')}
            disabled={animating}
          >
            Iniciar Sesión
          </button>
          <button 
            className={`auth-tab-btn ${activeTab === 'register' ? 'active' : ''}`} 
            onClick={() => switchTab('register')}
            disabled={animating}
          >
            Registrarse
          </button>
          <div 
            className="auth-tab-indicator" 
            style={{ transform: activeTab === 'login' ? 'translateX(0)' : 'translateX(100%)' }}
          ></div>
        </div>
        
        <div className={`auth-content ${animating ? 'slide-out' : ''}`}>
          {error && (
            <div className="auth-message error">
              <i className="auth-message-icon">!</i>
              <p>{error}</p>
            </div>
          )}
          
          {success && (
            <div className="auth-message success">
              <i className="auth-message-icon">✓</i>
              <p>{success}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label" htmlFor="correoCliente">
                <i className="form-icon email"></i>
                Correo Electrónico
              </label>
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
              <label className="form-label" htmlFor="password">
                <i className="form-icon password"></i>
                Contraseña
              </label>
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
                  <label className="form-label" htmlFor="nombreCliente">
                    <i className="form-icon user"></i>
                    Nombre
                  </label>
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
                  <label className="form-label" htmlFor="apellidosCliente">
                    <i className="form-icon user"></i>
                    Apellidos
                  </label>
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
              className={`auth-submit-btn ${loading ? 'loading' : ''}`} 
              type="submit"
              disabled={loading}
            >
              {loading && <span className="btn-spinner"></span>}
              <span className="btn-text">
                {activeTab === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
              </span>
            </button>
          </form>
          
          {activeTab === 'login' && (
            <div className="auth-help">
              <a href="#" className="auth-help-link">¿Olvidaste tu contraseña?</a>
            </div>
          )}
        </div>
        
        <div className="auth-footer">
          <p>© {new Date().getFullYear()} Spa Divine. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;