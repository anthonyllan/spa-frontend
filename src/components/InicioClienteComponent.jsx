import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './InicioClienteComponent.css';

// Opcional: importar biblioteca de animaciones
// import AOS from 'aos';
// import 'aos/dist/aos.css';

function InicioClienteComponent() {
  const navigate = useNavigate();

  // Opcional: inicializar animaciones al cargar
  // useEffect(() => {
  //   AOS.init({ duration: 1000, once: true });
  // }, []);

  const handleAgendarCita = () => {
    navigate('/cita-cliente');
  };

  return (
    <div className="inicio-cliente">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Bienvenido al <span className="accent">Mundo Divine</span></h1>
          <p className="hero-subtitle">Un santuario de relajación y bienestar para el cuerpo y el espíritu</p>
          <button className="btn-primary hero-btn" onClick={handleAgendarCita}>
            Reserva tu experiencia
            <i className="arrow-icon">→</i>
          </button>
        </div>
      </section>

      {/* Servicios Destacados */}
      <section className="featured-services">
        <div className="section-header">
          <span className="section-tag">Nuestros Servicios</span>
          <h2 className="section-title">Descubre la Experiencia <span className="accent">Divine</span></h2>
          <div className="separator"></div>
        </div>

        <div className="services-container">
          {/* Servicio 1 */}
          <div className="service-card" data-aos="fade-up">
            <div className="service-image-container">
              <img src="/images/masajes.jpg" alt="Masajes Terapéuticos" className="service-image" />
              <div className="service-overlay"></div>
            </div>
            <div className="service-content">
              <div className="service-icon">
                <i className="icon">✦</i>
              </div>
              <h3 className="service-title">Masajes Terapéuticos</h3>
              <p className="service-description">
                Sumérgete en un estado de profunda relajación con nuestros masajes personalizados. 
                Combinamos técnicas ancestrales y modernas para liberar tensiones y restaurar tu energía vital.
              </p>
              <a href="#" className="service-link">Explorar tratamientos <i className="arrow">→</i></a>
            </div>
          </div>

          {/* Servicio 2 */}
          <div className="service-card" data-aos="fade-up" data-aos-delay="100">
            <div className="service-image-container">
              <img src="/images/faciales.jpg" alt="Rituales Faciales" className="service-image" />
              <div className="service-overlay"></div>
            </div>
            <div className="service-content">
              <div className="service-icon">
                <i className="icon">✦</i>
              </div>
              <h3 className="service-title">Rituales Faciales</h3>
              <p className="service-description">
                Tratamientos faciales exclusivos que combinan ingredientes naturales de la más alta calidad 
                para revelar la luminosidad natural de tu piel y un resplandor renovado.
              </p>
              <a href="#" className="service-link">Explorar tratamientos <i className="arrow">→</i></a>
            </div>
          </div>

          {/* Servicio 3 */}
          <div className="service-card" data-aos="fade-up" data-aos-delay="200">
            <div className="service-image-container">
              <img src="/images/manicura.jpg" alt="Arte en Manos y Pies" className="service-image" />
              <div className="service-overlay"></div>
            </div>
            <div className="service-content">
              <div className="service-icon">
                <i className="icon">✦</i>
              </div>
              <h3 className="service-title">Arte en Manos y Pies</h3>
              <p className="service-description">
                Más que un simple manicure o pedicure, nuestros tratamientos embellecen, nutren y reparan 
                tus manos y pies con productos premium y técnicas artísticas de vanguardia.
              </p>
              <a href="#" className="service-link">Explorar tratamientos <i className="arrow">→</i></a>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Bienvenida */}
      <section className="welcome-section">
        <div className="welcome-grid">
          <div className="welcome-image-container" data-aos="fade-right">
            <img src="/images/maquillaje.jpg" alt="Spa Divine Ambiente" className="welcome-image" />
          </div>
          <div className="welcome-content" data-aos="fade-left">
            <span className="section-tag">Sobre Nosotros</span>
            <h2 className="section-title">Un Santuario de <span className="accent">Bienestar</span></h2>
            <p className="welcome-text">
              En SPA Divine, creemos que el verdadero lujo es tomarse tiempo para uno mismo. Nuestro espacio 
              ha sido meticulosamente diseñado para transportarte a un estado de serenidad desde el momento en 
              que cruzas nuestras puertas.
            </p>
            <p className="welcome-text">
              Cada tratamiento es una experiencia sensorial completa, donde combinamos técnicas expertas, 
              productos de la más alta calidad y un entorno que estimula todos tus sentidos.
            </p>
            <div className="welcome-features">
              <div className="feature">
                <div className="feature-icon">✓</div>
                <span>Terapeutas certificados</span>
              </div>
              <div className="feature">
                <div className="feature-icon">✓</div>
                <span>Productos orgánicos premium</span>
              </div>
              <div className="feature">
                <div className="feature-icon">✓</div>
                <span>Ambiente de absoluta tranquilidad</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="testimonials-section">
        <div className="section-header light">
          <span className="section-tag">Testimonios</span>
          <h2 className="section-title">Lo que dicen nuestros <span className="accent">Clientes</span></h2>
          <div className="separator"></div>
        </div>
        
        <div className="testimonials-container">
          <div className="testimonial-card" data-aos="zoom-in">
            <div className="quote-icon">"</div>
            <p className="testimonial-text">
              Una experiencia absolutamente transformadora. El masaje de piedras calientes alivió mi dolor 
              crónico de espalda y los terapeutas fueron increíblemente atentos a mis necesidades.
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">ML</div>
              <div className="author-info">
                <h4>María López</h4>
                <span>Cliente desde 2022</span>
              </div>
            </div>
          </div>
          
          <div className="testimonial-card" data-aos="zoom-in" data-aos-delay="100">
            <div className="quote-icon">"</div>
            <p className="testimonial-text">
              El facial personalizado fue justo lo que mi piel necesitaba. La estheticienne diagnosticó 
              perfectamente mi tipo de piel y seleccionó productos que realmente funcionaron para mí.
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">CG</div>
              <div className="author-info">
                <h4>Carlos Gutiérrez</h4>
                <span>Cliente desde 2023</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="cta-section">
        <div className="cta-overlay"></div>
        <div className="cta-container">
          <h2 className="cta-title">Comienza tu viaje de bienestar hoy</h2>
          <p className="cta-text">
            Date el regalo del tiempo para ti. Nuestro equipo está listo para crear una 
            experiencia personalizada que revitalice tu cuerpo y eleve tu espíritu.
          </p>
          <button className="btn-primary cta-button" onClick={handleAgendarCita}>
            Reservar mi cita
          </button>
        </div>
      </section>
    </div>
  );
}

export default InicioClienteComponent;