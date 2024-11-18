const pool = require('../../config/db');


exports.createRoom = async (req, res) => {
  const { room_name, is_private, created_by } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO rooms (room_name, is_private, created_by) VALUES ($1, $2, $3) RETURNING *',
      [room_name, is_private, created_by]
    );

    res.status(201).json({ message: 'Sala creada exitosamente', room: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la sala' });
  }
};

exports.updateRoomPrivacy = async (req, res) => {
  const { created_by } = req.params;
  const { room_id, is_private } = req.body;

  try {
    const result = await pool.query(
      'UPDATE rooms SET is_private = $1 WHERE room_id = $2 AND created_by = $3 RETURNING *',
      [is_private, room_id, created_by]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Sala no encontrada o no tienes permiso para actualizarla' });
    }

    res.status(200).json({ message: 'Sala actualizada exitosamente', room: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar la sala' });
  }
};

exports.deleteRoom = async (req, res) => {
  const { room_id } = req.params;

  try {
    await pool.query('BEGIN');
    await pool.query('DELETE FROM messages WHERE room_id = $1', [room_id]);
    await pool.query('DELETE FROM room_users WHERE room_id = $1', [room_id]);
    await pool.query('DELETE FROM current_playback WHERE room_id = $1', [room_id]);

    const result = await pool.query(
      'DELETE FROM rooms WHERE room_id = $1 RETURNING *',
      [room_id]
    );

    if (result.rows.length === 0) {
      await pool.query('ROLLBACK');
      return res.status(404).json({ message: 'Sala no encontrada' });
    }

    await pool.query('COMMIT');
    res.status(200).json({ message: 'Sala eliminada exitosamente' });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar la sala' });
  }
};

exports.getRoomsByUser = async (req, res) => {
  const { created_by } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM rooms WHERE created_by = $1',
      [created_by]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las salas' });
  }
};

