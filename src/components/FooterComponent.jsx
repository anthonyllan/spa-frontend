import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './FooterComponent.css';

function FooterComponent() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-main">
                <div className="footer-container">
                    <div className="footer-columns">
                        <div className="footer-column">
                            <h3>Sobre nosotros</h3>
                            <p>SPA Divine es un refugio de lujo donde la tranquilidad y la belleza se encuentran. 
                            Nuestros tratamientos exclusivos están diseñados para renovar tu cuerpo, mente y espíritu.</p>
                        </div>
                        
                        <div className="footer-column">
                            <h3>Servicios</h3>
                            <ul>
                                <li><a href="#">Masajes terapéuticos</a></li>
                                <li><a href="#">Tratamientos faciales</a></li>
                                <li><a href="#">Manicure y pedicure</a></li>
                                <li><a href="#">Terapias corporales</a></li>
                            </ul>
                        </div>
                        
                        <div className="footer-column">
                            <h3>Horario</h3>
                            <ul className="hours-list">
                                <li><span>Lunes - Viernes:</span> 9:00 AM - 8:00 PM</li>
                                <li><span>Sábados:</span> 10:00 AM - 6:00 PM</li>
                                <li><span>Domingos:</span> 11:00 AM - 4:00 PM</li>
                            </ul>
                        </div>
                        
                        <div className="footer-column">
                            <h3>Contacto</h3>
                            <address>
                                <p><i className="fas fa-map-marker-alt"></i> Av. Principal #123, Ciudad</p>
                                <p><i className="fas fa-phone"></i> +123 456 7890</p>
                                <p><i className="fas fa-envelope"></i> info@spadivine.com</p>
                            </address>
                        </div>
                    </div>

                    <div className="footer-social-section">
                        <h3>Síguenos</h3>
                        <div className="social-icons">
                            <a href="https://www.facebook.com/share/159uz5s61x/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-facebook-f"></i>
                            </a>
                            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-instagram"></i>
                            </a>
                            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-twitter"></i>
                            </a>
                            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-linkedin-in"></i>
                            </a>
                        </div>
                    </div>

                    <div className="footer-newsletter">
                        <h3>Recibe nuestras ofertas</h3>
                        <form>
                            <input type="email" placeholder="Tu correo electrónico" required />
                            <button type="submit">Suscribirse</button>
                        </form>
                    </div>
                </div>
            </div>
            
            <div className="footer-bottom">
                <div className="footer-bottom-container">
                    <p className="copyright">© {currentYear} SPA Divine. Todos los derechos reservados.</p>
                    <div className="footer-links">
                        <a href="#">Términos y condiciones</a>
                        <span className="separator">|</span>
                        <a href="#">Política de privacidad</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default FooterComponent;