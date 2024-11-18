const pool = require('../config/db'); 

exports.getAllRadioStations = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        rs.station_id, 
        rs.station_name, 
        COUNT(su.user_id) AS user_count 
      FROM radio_stations rs
      LEFT JOIN station_users su ON rs.station_id = su.station_id
      GROUP BY rs.station_id
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las estaciones de radio' });
  }
};

exports.getRadioStationsByUser = async (req, res) => {
  const { created_by } = req.params;
  try {
    const result = await pool.query(`
      SELECT 
        rs.station_id, 
        rs.station_name, 
        COUNT(su.user_id) AS user_count 
      FROM radio_stations rs
      LEFT JOIN station_users su ON rs.station_id = su.station_id
      WHERE rs.created_by = $1
      GROUP BY rs.station_id
    `, [created_by]);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las estaciones de radio del usuario' });
  }
};

exports.createRadioStation = async (req, res) => {
  const { station_name, created_by } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO radio_stations (station_name, created_by) VALUES ($1, $2) RETURNING *',
      [station_name, created_by]
    );
    
    const station = result.rows[0];
    await pool.query(
      'INSERT INTO station_users (station_id, user_id) VALUES ($1, $2)',
      [station.station_id, created_by]
    );

    res.status(201).json({
      message: 'Estación de radio creada exitosamente',
      station: { ...station, user_count: 1 }, // Assuming owner is the first user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la estación de radio' });
  }
};


exports.addUserToStation = async (req, res) => {
  const { station_id, user_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO station_users (station_id, user_id) VALUES ($1, $2) RETURNING *',
      [station_id, user_id]
    );
    res.status(201).json({ 
      message: 'Usuario agregado a la estación de radio exitosamente', 
      stationUser: result.rows[0] 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al agregar usuario a la estación de radio' });
  }
};


exports.removeUserFromStation = async (req, res) => {
  const { station_id, user_id } = req.params;  // These will come from the request parameters
  try {
    const result = await pool.query(
      'DELETE FROM station_users WHERE station_id = $1 AND user_id = $2 RETURNING *',
      [station_id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado en la estación de radio' });
    }

    // Success response
    res.status(200).json({ message: 'Usuario eliminado de la estación de radio exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar usuario de la estación de radio' });
  }
};

exports.deleteRadioStation = async (req, res) => {
  const { station_id } = req.params;

  try {
    await pool.query('DELETE FROM station_users WHERE station_id = $1', [station_id]);

    const result = await pool.query('DELETE FROM radio_stations WHERE station_id = $1 RETURNING *', [station_id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Station not found' });
    }

    res.status(200).json({ message: 'Radio station deleted successfully' });
  } catch (error) {
    console.error('Error deleting radio station:', error);
    res.status(500).json({ error: 'Error deleting radio station' });
  }
};
