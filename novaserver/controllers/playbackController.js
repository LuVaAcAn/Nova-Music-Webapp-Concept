const pool = require('../config/db');

exports.addPlayback = async (req, res) => {
  const { station_id, track_url } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO current_playback (station_id, track_url) VALUES ($1, $2) RETURNING *',
      [station_id, track_url]
    );
    res.status(201).json(result.rows[0]); // Respond with the added track
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error adding track' });
  }
};

exports.getPlaybackByRoom = async (req, res) => {
  const { room_id } = req.params;
  try {
    const result = await pool.query(
      'SELECT track_url, started_at FROM current_playback WHERE room_id = $1 AND station_id IS NULL',
      [room_id]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener la reproducción actual' });
  }
};

exports.getPlaybackByStation = async (req, res) => {
  const { station_id } = req.params;
  try {
    const result = await pool.query(
      'SELECT track_url FROM current_playback WHERE station_id = $1',
      [station_id]
    );
    res.status(200).json(result.rows);  // Send back the list of tracks
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching tracks for the station' });
  }
};

exports.deletePlaybackByRoom = async (req, res) => {
  const { room_id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM current_playback WHERE room_id = $1 AND station_id IS NULL RETURNING *',
      [room_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No se encontró reproducción en la sala especificada' });
    }
    res.status(200).json({ message: 'Reproducción de canción eliminada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar la reproducción de canción' });
  }
};

exports.deletePlaybackByStation = async (req, res) => {
  const { station_id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM current_playback WHERE station_id = $1 AND room_id IS NULL RETURNING *',
      [station_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No se encontró reproducción en la estación especificada' });
    }
    res.status(200).json({ message: 'Reproducción de canción eliminada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar la reproducción de canción' });
  }
};
