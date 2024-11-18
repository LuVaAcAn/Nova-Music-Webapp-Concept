require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  console.log('Headers in middleware:', req.headers); // Log all headers
  const authHeader = req.headers.authorization;
  console.log('Authorization Header:', authHeader); // Log the authorization header

  const token = authHeader && authHeader.split(' ')[1]; // Extract token
  console.log('Token:', token); // Log the token extracted from the header

  if (!token) {
    console.error('Authorization header missing or malformed');
    return res.status(401).json({ error: 'No autorizado' });
  }

  try {
    console.log('SECRET_KEY:', process.env.SECRET_KEY); // Log the secret key
    const decoded = jwt.verify(token, process.env.SECRET_KEY); // Use secret key from .env
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error verifying token:', error.message);
    res.status(400).json({ error: 'Token inválido o expirado' });
  }
};
