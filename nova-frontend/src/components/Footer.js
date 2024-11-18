import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-links">
          <a href="/about">Sobre Nosotros</a>
          <a href="/terms">Términos de Servicio</a>
          <a href="/privacy">Política de Privacidad</a>
          <a href="/contact">Contacto</a>
        </div>
        <div className="footer-copy">
          <p>&copy; {new Date().getFullYear()} Nova. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;