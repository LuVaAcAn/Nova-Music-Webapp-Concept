const pool = require('../config/db');

// Backend (chatController.js)
exports.addMessage = async (req, res) => {
  const { room_id, station_id, user_id, content } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO messages (room_id, station_id, user_id, content) VALUES ($1, $2, $3, $4) RETURNING *',
      [room_id, station_id, user_id, content] // Save the user_id
    );
    res.status(201).json({ message: 'Mensaje agregado exitosamente', messageData: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al agregar el mensaje', details: error.message });
  }
};

exports.getUserDetails = async (req, res) => {
  const { user_ids } = req.query; // Expecting a comma-separated list of user_ids
  try {
    const result = await pool.query('SELECT user_id, user_name FROM users WHERE user_id = ANY($1::int[])', [user_ids.split(',').map(Number)]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching user details' });
  }
};

exports.getMessagesByRoom = async (req, res) => {
  const { room_id } = req.params;

  try {
    // Use the JOIN query to get messages and usernames in one go
    const result = await pool.query(
      'SELECT m.*, u.username FROM messages m JOIN users u ON m.user_id = u.user_id WHERE m.room_id = $1',
      [room_id]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching messages with user details:', error);
    res.status(500).json({ error: 'Error fetching messages', details: error.message });
  }
};


exports.getMessagesByStation = async (req, res) => {
  const { stat_id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM messages WHERE station_id = $1', [stat_id]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los mensajes', details: error.message });
  }
};