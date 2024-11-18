const bcrypt = require('bcryptjs');
const pool = require('../config/db'); // Ensure db config is correct
const jwt = require('jsonwebtoken');

exports.getUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users'); // Query to get all users
    res.status(200).json(result.rows); // Respond with user data
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los usuarios' }); // Server error handling
  }
};

exports.createUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password for storage

    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash, has_membership) VALUES ($1, $2, $3, $4) RETURNING *',
      [username, email, hashedPassword, false] // Insert user into the database
    );

    res.status(201).json(result.rows[0]); // Respond with created user
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el usuario' }); // Error handling
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const user = result.rows[0];
    console.log('User object:', user);  // Log the user object to check if user_id is available

    const match = await bcrypt.compare(password, user.password_hash);

    if (match) {
      const payload = {
        userId: user.user_id,  // Ensure user_id is included here
        username: user.username,
        email: user.email
      };

      const token = jwt.sign(payload, 'nNqa3qLu17emzvKKUQbKKgOQ55Kg20kZ', { expiresIn: '2h' });

      res.status(200).json({
        message: 'Login exitoso',
        userId: user.user_id,
        token: token
      });      
    } else {
      res.status(401).json({ error: 'Contraseña incorrecta' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al realizar el login' });
  }
};
