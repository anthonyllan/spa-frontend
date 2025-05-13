import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { guardarCliente, listClientes } from '../services/ClienteService';
import './LoginComponent.css';

const LoginComponent = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    correoCliente: '',
    password: '', // Nota: Deberás añadir un campo de contraseña a tu API
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
      if (isLogin) {
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
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <h2>Spa Divine</h2>
        </div>
        <h3>{isLogin ? 'Iniciar Sesión' : 'Registrarse'}</h3>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Correo Electrónico</label>
            <input
              type="email"
              name="correoCliente"
              value={formData.correoCliente}
              onChange={handleChange}
              placeholder="tu@email.com"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Tu contraseña"
              required
            />
          </div>
          
          {!isLogin && (
            <>
              <div className="form-group">
                <label>Nombre</label>
                <input
                  type="text"
                  name="nombreCliente"
                  value={formData.nombreCliente}
                  onChange={handleChange}
                  placeholder="Tu nombre"
                  required={!isLogin}
                />
              </div>
              
              <div className="form-group">
                <label>Apellidos</label>
                <input
                  type="text"
                  name="apellidosCliente"
                  value={formData.apellidosCliente}
                  onChange={handleChange}
                  placeholder="Tus apellidos"
                  required={!isLogin}
                />
              </div>
            </>
          )}
          
          <button 
            className="auth-button" 
            type="submit"
            disabled={loading}
          >
            {loading ? 'Procesando...' : isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </button>
        </form>
        
        <div className="auth-toggle">
          {isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
          <button 
            type="button" 
            className="toggle-button"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Regístrate' : 'Inicia Sesión'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;