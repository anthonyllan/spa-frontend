import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './InicioClienteComponent.css';

const InicioClienteComponent = ({ isPublic = false }) => {
  const { userData } = useAuth();
  
  // Obtener el nombre del cliente para mostrar un saludo personalizado
  const clientName = userData?.nombreCliente || '';

  return (
    <div className="inicio-cliente-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Bienvenido{clientName ? `, ${clientName}` : ''} a Spa Divine</h1>
          <p className="hero-tagline">Tu experiencia de bienestar y relajación comienza aquí</p>
          <p className="hero-description">
            Descubre nuestros exclusivos tratamientos diseñados para renovar tu cuerpo, mente y espíritu.
          </p>
          
          {/* Mostrar diferentes botones según si es público o autenticado */}
          <div className="cta-buttons">
            {isPublic ? (
              <>
                <Link to="/login" className="btn-primary">Iniciar Sesión</Link>
                <Link to="/registro" className="btn-secondary">Crear Cuenta</Link>
              </>
            ) : (
              <Link to="/cita-cliente" className="btn-primary">Agendar una cita</Link>
            )}
          </div>
        </div>
      </section>

      <section className="services-preview">
        <div className="section-header">
          <h2 className="section-title">Nuestros Servicios</h2>
          <p className="section-subtitle">Tratamientos especializados para tu bienestar</p>
        </div>
        
        <div className="services-grid">
          <div className="service-card">
            <div className="service-image massage"></div>
            <h3>Masajes Terapéuticos</h3>
            <p>Relaja tu cuerpo y mente con nuestros masajes profesionales que alivian tensiones.</p>
            {isPublic ? (
              <Link to="/login" className="service-link">Reservar ahora</Link>
            ) : (
              <Link to="/cita-cliente" className="service-link">Reservar ahora</Link>
            )}
          </div>
          
          <div className="service-card">
            <div className="service-image facial"></div>
            <h3>Tratamientos Faciales</h3>
            <p>Cuida y revitaliza tu piel con nuestros tratamientos personalizados de alta gama.</p>
            {isPublic ? (
              <Link to="/login" className="service-link">Reservar ahora</Link>
            ) : (
              <Link to="/cita-cliente" className="service-link">Reservar ahora</Link>
            )}
          </div>
          
          <div className="service-card">
            <div className="service-image body"></div>
            <h3>Tratamientos Corporales</h3>
            <p>Renueva tu energía y mejora tu piel con nuestros tratamientos corporales exclusivos.</p>
            {isPublic ? (
              <Link to="/login" className="service-link">Reservar ahora</Link>
            ) : (
              <Link to="/cita-cliente" className="service-link">Reservar ahora</Link>
            )}
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="about-content">
          <div className="section-header">
            <h2 className="section-title">Sobre Spa Divine</h2>
            <p className="section-subtitle">Nuestro compromiso con tu bienestar</p>
          </div>
          
          <div className="about-description">
            <p>En Spa Divine nos dedicamos a proporcionar experiencias de bienestar excepcionales a través de tratamientos de alta calidad en un ambiente tranquilo y acogedor.</p>
            <p>Nuestro equipo de profesionales está comprometido con tu salud y satisfacción, utilizando solo productos de primera calidad y técnicas innovadoras.</p>
          </div>
          
          <div className="about-features">
            <div className="feature">
              <div className="feature-icon">✓</div>
              <div className="feature-text">Profesionales certificados</div>
            </div>
            <div className="feature">
              <div className="feature-icon">✓</div>
              <div className="feature-text">Productos premium</div>
            </div>
            <div className="feature">
              <div className="feature-icon">✓</div>
              <div className="feature-text">Ambiente relajante</div>
            </div>
            <div className="feature">
              <div className="feature-icon">✓</div>
              <div className="feature-text">Satisfacción garantizada</div>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonials">
        <div className="section-header">
          <h2 className="section-title">Lo que dicen nuestros clientes</h2>
          <p className="section-subtitle">Experiencias reales de nuestros visitantes</p>
        </div>
        
        <div className="testimonial-slider">
          <div className="testimonial">
            <p className="testimonial-text">"Una experiencia maravillosa. El personal es muy profesional y atento. Me sentí completamente renovada después de mi tratamiento facial."</p>
            <div className="testimonial-author">
              <div className="author-avatar"></div>
              <cite>- María González</cite>
            </div>
          </div>
          
          <div className="testimonial">
            <p className="testimonial-text">"Los mejores masajes que he recibido. La terapeuta entendió exactamente lo que necesitaba para aliviar mi dolor de espalda. Definitivamente regresaré."</p>
            <div className="testimonial-author">
              <div className="author-avatar"></div>
              <cite>- Carlos Pérez</cite>
            </div>
          </div>
        </div>
        
        {/* Diferentes llamados a la acción según modo público o autenticado */}
        <div className="testimonial-cta">
          {isPublic ? (
            <Link to="/registro" className="btn-accent">Únete a nuestra comunidad de clientes satisfechos</Link>
          ) : (
            <Link to="/cita-cliente" className="btn-accent">Reserva tu próxima experiencia</Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default InicioClienteComponent;