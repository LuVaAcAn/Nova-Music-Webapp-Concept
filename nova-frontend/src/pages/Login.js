import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Correct useState here
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/api/users/login', { email, password });
      const { token } = response.data;
      console.log('JWT Token:', token);
      localStorage.setItem('token', token);
      navigate('/dashboard');
    } catch (error) {
      setError('Login failed. Please check your credentials.');
      console.error('Login failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-subcontainer">
        <div className="login-box">
          <h1>NOVA</h1>
          <h2>Inicia Sesión</h2>
          <form onSubmit={handleLogin}>
            <p>Correo electrónico</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              />
            <p>Contraseña</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              />
            <button type="submit">Log In</button>
          </form>
          {error && <p>{error}</p>}
          {isLoading && <p>Loading...</p>}  {/* Display loading state */}
        </div>
      </div>
    </div>
  );
};

export default Login;
