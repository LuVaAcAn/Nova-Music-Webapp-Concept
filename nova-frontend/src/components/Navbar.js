import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Nova</Link>
      </div>
      <div className="navbar-links">
        <Link to="/register">Premium</Link>
        <Link to="/register">Ayuda</Link>
        <Link id="navbarlink-descargar" to="/register">Descargar</Link>
        <Link to="/register">Registrarse</Link>
        <Link to="/login">Iniciar Sesión</Link>
      </div>
    </nav>
  );
};

export default Navbar;
