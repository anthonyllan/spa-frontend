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
  const [success, setSuccess] = useState('');
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
    setSuccess('');
    setLoading(true);

    try {
      if (activeTab === 'login') {
        // Verificar si es el administrador
        if (formData.correoCliente === 'admin@spadivine.mx' && formData.password === 'admin123') {
          loginAsAdmin();
          setSuccess('¡Bienvenido Administrador! Accediendo al panel...');
          setTimeout(() => navigate('/inicio'), 1500);
          return;
        }

        // Buscar cliente por correo electrónico
        const response = await listClientes();
        const cliente = response.data.find(
          c => c.correoCliente === formData.correoCliente
        );

        if (!cliente) {
          setError('Usuario no encontrado. Verifica tu correo electrónico.');
          setLoading(false);
          return;
        }

        // En un sistema real, verificaríamos la contraseña aquí
        loginAsCliente(cliente);
        setSuccess(`¡Bienvenido/a de nuevo, ${cliente.nombreCliente}! Preparando tu experiencia...`);
        setTimeout(() => navigate('/cita-cliente'), 1500);
        
      } else {
        // Registro de nuevo cliente
        // Validar que todos los campos estén completos
        if (!formData.nombreCliente || !formData.apellidosCliente || !formData.correoCliente || !formData.password) {
          setError('Por favor completa todos los campos del formulario');
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
        setSuccess('¡Cuenta creada con éxito! Bienvenido/a a Spa Divine');
        setTimeout(() => navigate('/cita-cliente'), 1500);
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.message || 'Error al procesar la solicitud. Intenta nuevamente más tarde.');
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Panel lateral con imagen */}
        <div className="login-image-side">
          <div className="login-image-overlay">
            <div className="login-logo">
              <h1>Spa Divine</h1>
              <p className="login-slogan">Experiencia de bienestar</p>
            </div>
            
            {/* Características destacadas */}
            <div className="login-benefits">
              <div className="login-benefit-item">
                <div className="benefit-icon">✨</div>
                <div className="benefit-text">
                  <h3>Servicios Premium</h3>
                  <p>Tratamientos exclusivos para tu bienestar</p>
                </div>
              </div>
              
              <div className="login-benefit-item">
                <div className="benefit-icon">⏱️</div>
                <div className="benefit-text">
                  <h3>Reservas Fáciles</h3>
                  <p>Agenda tu cita en pocos minutos</p>
                </div>
              </div>
              
              <div className="login-benefit-item">
                <div className="benefit-icon">🎁</div>
                <div className="benefit-text">
                  <h3>Ofertas Especiales</h3>
                  <p>Accede a promociones exclusivas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Panel de formulario */}
        <div className="login-form-side">
          {/* Selector de formulario */}
          <div className="login-mode-selector">
            <div
              className={`login-mode-option ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => setActiveTab('login')}
            >
              Iniciar Sesión
              {activeTab === 'login' && <div className="login-mode-indicator"></div>}
            </div>
            <div
              className={`login-mode-option ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => setActiveTab('register')}
            >
              Registrarse
              {activeTab === 'register' && <div className="login-mode-indicator"></div>}
            </div>
          </div>
          
          {/* Título del formulario */}
          <div className="login-form-header">
            <h2>{activeTab === 'login' ? 'Bienvenido de nuevo' : 'Crear una cuenta'}</h2>
            <p>
              {activeTab === 'login' 
                ? 'Ingresa tus datos para acceder a tu cuenta' 
                : 'Regístrate para comenzar tu experiencia de bienestar'}
            </p>
          </div>
          
          {/* Mensajes */}
          {error && (
            <div className="login-message error">
              <span className="message-icon">!</span>
              {error}
            </div>
          )}
          
          {success && (
            <div className="login-message success">
              <span className="message-icon">✓</span>
              {success}
            </div>
          )}
          
          {/* Formulario */}
          <form onSubmit={handleSubmit} className="login-form">
            {/* Correo electrónico */}
            <div className="login-form-field">
              <label htmlFor="correoCliente">Correo electrónico</label>
              <div className="login-input-container">
                <input
                  type="email"
                  id="correoCliente"
                  name="correoCliente"
                  value={formData.correoCliente}
                  onChange={handleChange}
                  placeholder="ejemplo@correo.com"
                  required
                />
                <div className="field-icon email"></div>
              </div>
            </div>
            
            {/* Contraseña */}
            <div className="login-form-field">
              <label htmlFor="password">Contraseña</label>
              <div className="login-input-container">
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Tu contraseña"
                  required
                />
                <div className="field-icon password"></div>
              </div>
            </div>
            
            {/* Campos adicionales para registro */}
            {activeTab === 'register' && (
              <div className="login-form-row">
                <div className="login-form-field">
                  <label htmlFor="nombreCliente">Nombre</label>
                  <div className="login-input-container">
                    <input
                      type="text"
                      id="nombreCliente"
                      name="nombreCliente"
                      value={formData.nombreCliente}
                      onChange={handleChange}
                      placeholder="Tu nombre"
                      required
                    />
                    <div className="field-icon user"></div>
                  </div>
                </div>
                
                <div className="login-form-field">
                  <label htmlFor="apellidosCliente">Apellidos</label>
                  <div className="login-input-container">
                    <input
                      type="text"
                      id="apellidosCliente"
                      name="apellidosCliente"
                      value={formData.apellidosCliente}
                      onChange={handleChange}
                      placeholder="Tus apellidos"
                      required
                    />
                    <div className="field-icon user"></div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Botón de envío */}
            <button 
              type="submit" 
              className={`login-submit-btn ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <div className="login-spinner"></div>
              ) : (
                activeTab === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'
              )}
            </button>
          </form>
          
          {/* Enlaces adicionales */}
          <div className="login-extra-links">
            {activeTab === 'login' ? (
              <>
                <a href="#" className="login-forgot">¿Olvidaste tu contraseña?</a>
                <div className="login-switch">
                  ¿No tienes cuenta? <span onClick={() => setActiveTab('register')}>Regístrate</span>
                </div>
              </>
            ) : (
              <div className="login-switch">
                ¿Ya tienes cuenta? <span onClick={() => setActiveTab('login')}>Inicia sesión</span>
              </div>
            )}
          </div>
          
          {/* Políticas */}
          {activeTab === 'register' && (
            <div className="login-policy">
              Al registrarte aceptas nuestros <a href="#">términos y condiciones</a> y <a href="#">política de privacidad</a>.
            </div>
          )}
          
          {/* Footer */}
          <div className="login-footer">
            <p>&copy; {new Date().getFullYear()} Spa Divine - Todos los derechos reservados</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;