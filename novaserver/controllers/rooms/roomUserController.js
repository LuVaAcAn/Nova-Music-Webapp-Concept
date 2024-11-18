const pool = require('../../config/db');

exports.addUserToRoom = async (req, res) => {
  const { room_id, user_id } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO room_users (room_id, user_id) VALUES ($1, $2) RETURNING *',
      [room_id, user_id]
    );

    res.status(201).json({ message: 'Usuario agregado a la sala exitosamente', roomUser: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al agregar usuario a la sala' });
  }
};

exports.removeUserFromRoom = async (req, res) => {
  const { room_id, user_id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM room_users WHERE room_id = $1 AND user_id = $2 RETURNING *',
      [room_id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado en la sala' });
    }

    res.status(200).json({ message: 'Usuario eliminado de la sala exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar usuario de la sala' });
  }
};

exports.getUsersInRoom = async (req, res) => {
  const { room_id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM room_users WHERE room_id = $1',
      [room_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No se encontraron usuarios en la sala especificada' });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los usuarios de la sala' });
  }
};