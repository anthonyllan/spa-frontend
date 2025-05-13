import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './HeaderComponent.css';

function HeaderComponent() {
  const { userRole, userData, logout } = useAuth();
  const navigate = useNavigate();
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Efecto para controlar la visibilidad del header al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      // Posición actual del scroll
      const currentScrollPos = window.pageYOffset;
      
      // Si estamos al inicio de la página, siempre mostrar el header
      if (currentScrollPos < 10) {
        setVisible(true);
        return;
      }
      
      // Determinar si debemos mostrar u ocultar el header basado en la dirección del scroll
      const isVisible = prevScrollPos > currentScrollPos;
      
      setVisible(isVisible);
      setPrevScrollPos(currentScrollPos);
    };
    
    // Agregar event listener
    window.addEventListener('scroll', handleScroll);
    
    // Limpieza del event listener cuando el componente se desmonte
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [prevScrollPos]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const handleLogin = () => {
    navigate('/login');
    setMobileMenuOpen(false);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };
  
  return (
    <header className={`header ${visible ? 'header-visible' : 'header-hidden'}`}>
      <div className="header-container">
        <Link to="/" className="logo-container">
          <span className="brand-name">SPA Divine</span>
        </Link>
        
        <button 
          className={`mobile-menu-btn ${mobileMenuOpen ? 'open' : ''}`} 
          onClick={toggleMobileMenu}
          aria-label="Menu principal"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        
        <nav className={`main-nav ${mobileMenuOpen ? 'open' : ''}`}>
          <ul className="nav-list">
            {userRole === 'admin' && (
              <>
                <li className="nav-item"><Link to="/inicio" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Inicio</Link></li>
                <li className="nav-item"><Link to="/servicios" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Servicios</Link></li>
                <li className="nav-item"><Link to="/empleados" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Empleados</Link></li>
                <li className="nav-item"><Link to="/empleado-servicio" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Empleado-Servicio</Link></li>
                <li className="nav-item"><Link to="/productos" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Productos</Link></li>
                <li className="nav-item"><Link to="/categorias" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Categorías</Link></li>
                <li className="nav-item"><Link to="/especialidades" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Especialidades</Link></li>
                <li className="nav-item"><Link to="/agendar-cita" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Citas</Link></li>
              </>
            )}
            {userRole === 'cliente' && (
              <>
                <li className="nav-item"><Link to="/inicio-cliente" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Inicio</Link></li>
                <li className="nav-item"><Link to="/cita-cliente" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Agendar cita</Link></li>
              </>
            )}
          </ul>
          
          <div className="auth-controls">
            {!userRole ? (
              <button className="auth-btn login-btn" onClick={handleLogin}>Iniciar Sesión</button>
            ) : (
              <>
                <span className="user-greeting">Hola, {userData?.nombreCliente || 'Administrador'}</span>
                <button className="auth-btn logout-btn" onClick={handleLogout}>Cerrar Sesión</button>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default HeaderComponent;