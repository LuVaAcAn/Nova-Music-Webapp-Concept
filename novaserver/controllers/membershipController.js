const pool = require('../config/db'); 


exports.createMembership = async (req, res) => {
  const { user_id, amount } = req.body;

  try {
    await pool.query('UPDATE users SET has_membership = true WHERE user_id = $1', [user_id]);

    const result = await pool.query(
      'INSERT INTO memberships (user_id, amount, expires_at) VALUES ($1, $2, CURRENT_TIMESTAMP + INTERVAL \'1 month\') RETURNING *',
      [user_id, amount]
    );

    res.status(201).json({
      message: 'Membresía creada exitosamente',
      membership: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la membresía' });
  }
};

exports.updateMembership = async (req, res) => {
  const { user_id } = req.params;
  const { membership_id, is_active } = req.body;

  try {
    const result = await pool.query(
      'UPDATE memberships SET is_active = $3 WHERE user_id = $1 AND membership_id = $2 RETURNING *',
      [user_id, membership_id, is_active]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Membresía no encontrada' });
    }

    res.status(200).json({ message: 'Membresía actualizada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar la membresía' });
  }
};
