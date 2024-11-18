import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate('/login');
  };

  return (
    <div className="landing">
      <div className="landing-container">
        <div className="landing-subcontainer">
          <div className="landing-image">
            <div className="mobile-phone">
              <div id="mobile-cam"></div>
              <img src="https://i.scdn.co/image/ab678e040000ed3aed58911aecc6dbc16949f40b"></img>
            </div>
          </div>
          <div className="landing-firstimpression">
            <h1>Reproduce millones de canciones y podcasts de forma grupal.</h1>
            <p>¡La diversión se multiplica al escuchar juntos, sin importar la distancia!</p>
            <button onClick={handleRedirect}>Obtener Nova</button>
          </div>
        </div>
      </div>
      <div className="landing-content">
            <div className="landing-porqueescoger">
              <h1>¿Por qué elegir Nova?</h1>
              <ul>
                <li><div className="porqueescoger-img" id="canciones-fav"></div><div className="porqueescoger-text"><p className="porqueescoger-subtitle">Escucha tus canciones favoritas.</p><p>Escucha las canciones que te encantan y descubre música y podcasts nuevos.</p></div></li>
                <li><div className="porqueescoger-img" id="salas-fav"></div><div className="porqueescoger-text"><p className="porqueescoger-subtitle">Crear salas nunca fue tan fácil.</p><p>Te ayudaremos a crear salas con tus amigos. O puedes unirte a las suyas.</p></div></li>
                <li><div className="porqueescoger-img" id="podcast-fav"></div><div className="porqueescoger-text"><p className="porqueescoger-subtitle">Descubre tus nuevos podcasts favoritos.</p><p>Escucha las canciones que te encantan y descubre música y podcasts nuevos.</p></div></li>
                <li><div className="porqueescoger-img" id="calidad-fav"></div><div className="porqueescoger-text"><p className="porqueescoger-subtitle">La mejor calidad de streaming.</p><p>Consume menos datos cuando escuches tu música mientras la disfrutas a la máxima calidad.</p></div></li>
              </ul>
            </div>
      </div>
    </div>
  );
};

export default Landing;
