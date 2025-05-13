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
    <div className="spa-auth-container">
      <div className="spa-auth-wrapper">
        {/* Sección de imagen decorativa */}
        <div className="spa-auth-image-section">
          <div className="spa-auth-image-overlay">
            <h2 className="spa-auth-welcome">Bienvenido a Spa Divine</h2>
            <p className="spa-auth-tagline">Tu experiencia de bienestar comienza aquí</p>
            <div className="spa-auth-features">
              <div className="spa-auth-feature">
                <div className="feature-icon">✨</div>
                <div className="feature-text">Servicios de relajación premium</div>
              </div>
              <div className="spa-auth-feature">
                <div className="feature-icon">⏰</div>
                <div className="feature-text">Reserva citas en minutos</div>
              </div>
              <div className="spa-auth-feature">
                <div className="feature-icon">👤</div>
                <div className="feature-text">Atención personalizada</div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección del formulario */}
        <div className="spa-auth-form-section">
          <div className="spa-auth-form-container">
            <div className="spa-auth-logo">
              <span className="spa-logo-text">Spa Divine</span>
            </div>

            <div className="spa-auth-tabs">
              <button 
                className={`spa-auth-tab ${activeTab === 'login' ? 'active' : ''}`} 
                onClick={() => switchTab('login')}
                disabled={animating}
              >
                <span className="tab-icon">🔑</span>
                <span className="tab-text">Iniciar Sesión</span>
              </button>
              <button 
                className={`spa-auth-tab ${activeTab === 'register' ? 'active' : ''}`} 
                onClick={() => switchTab('register')}
                disabled={animating}
              >
                <span className="tab-icon">✏️</span>
                <span className="tab-text">Registrarse</span>
              </button>
            </div>
            
            <div className={`spa-auth-form-wrapper ${animating ? 'fade-out' : ''}`}>
              <div className="spa-auth-heading">
                <h3>{activeTab === 'login' ? 'Accede a tu cuenta' : 'Crea una cuenta nueva'}</h3>
                <p className="spa-auth-subheading">
                  {activeTab === 'login' 
                    ? 'Ingresa tus datos para acceder a tu cuenta' 
                    : 'Completa el formulario para unirte a Spa Divine'}
                </p>
              </div>
              
              {error && (
                <div className="spa-auth-message error">
                  <span className="message-icon">!</span>
                  <p>{error}</p>
                </div>
              )}
              
              {success && (
                <div className="spa-auth-message success">
                  <span className="message-icon">✓</span>
                  <p>{success}</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="spa-auth-form">
                <div className="spa-form-group">
                  <label className="spa-form-label" htmlFor="correoCliente">
                    Correo Electrónico
                  </label>
                  <div className="spa-input-wrapper">
                    <span className="spa-input-icon">✉️</span>
                    <input
                      type="email"
                      id="correoCliente"
                      name="correoCliente"
                      className="spa-form-input"
                      value={formData.correoCliente}
                      onChange={handleChange}
                      placeholder="ejemplo@correo.com"
                      required
                    />
                  </div>
                  <small className="spa-form-help">
                    {activeTab === 'login' ? 'Ingresa el correo con el que te registraste' : 'Usaremos este correo para confirmaciones'}
                  </small>
                </div>
                
                <div className="spa-form-group">
                  <label className="spa-form-label" htmlFor="password">
                    Contraseña
                  </label>
                  <div className="spa-input-wrapper">
                    <span className="spa-input-icon">🔒</span>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      className="spa-form-input"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Ingresa tu contraseña"
                      required
                    />
                  </div>
                </div>
                
                {activeTab === 'register' && (
                  <>
                    <div className="spa-form-row">
                      <div className="spa-form-group">
                        <label className="spa-form-label" htmlFor="nombreCliente">
                          Nombre
                        </label>
                        <div className="spa-input-wrapper">
                          <span className="spa-input-icon">👤</span>
                          <input
                            type="text"
                            id="nombreCliente"
                            name="nombreCliente"
                            className="spa-form-input"
                            value={formData.nombreCliente}
                            onChange={handleChange}
                            placeholder="Tu nombre"
                            required={activeTab === 'register'}
                          />
                        </div>
                      </div>
                      
                      <div className="spa-form-group">
                        <label className="spa-form-label" htmlFor="apellidosCliente">
                          Apellidos
                        </label>
                        <div className="spa-input-wrapper">
                          <span className="spa-input-icon">👤</span>
                          <input
                            type="text"
                            id="apellidosCliente"
                            name="apellidosCliente"
                            className="spa-form-input"
                            value={formData.apellidosCliente}
                            onChange={handleChange}
                            placeholder="Tus apellidos"
                            required={activeTab === 'register'}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="spa-auth-info">
                      <p className="spa-info-text">
                        <span className="spa-info-icon">ℹ️</span>
                        Al registrarte, aceptas nuestros términos y condiciones de servicio.
                      </p>
                    </div>
                  </>
                )}
                
                <button 
                  className={`spa-auth-button ${loading ? 'loading' : ''}`} 
                  type="submit"
                  disabled={loading}
                >
                  {loading && <span className="button-spinner"></span>}
                  <span className="button-text">
                    {activeTab === 'login' ? 'Iniciar Sesión' : 'Crear mi cuenta'}
                  </span>
                </button>
              </form>
              
              {activeTab === 'login' && (
                <div className="spa-auth-extras">
                  <a href="#" className="spa-forgot-link">¿Olvidaste tu contraseña?</a>
                  <p className="spa-register-cta">
                    ¿No tienes una cuenta? <button className="spa-text-button" onClick={() => switchTab('register')}>Regístrate aquí</button>
                  </p>
                </div>
              )}
              
              {activeTab === 'register' && (
                <div className="spa-auth-extras">
                  <p className="spa-login-cta">
                    ¿Ya tienes una cuenta? <button className="spa-text-button" onClick={() => switchTab('login')}>Inicia sesión aquí</button>
                  </p>
                </div>
              )}
            </div>
            
            <div className="spa-auth-footer">
              <p>© {new Date().getFullYear()} Spa Divine. Todos los derechos reservados.</p>
              <div className="spa-auth-footer-links">
                <a href="#">Ayuda</a>
                <a href="#">Privacidad</a>
                <a href="#">Términos</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;