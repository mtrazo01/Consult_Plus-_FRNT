const pool = require('../models/db');

exports.getEspecialidades = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM especialidades ORDER BY nome');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar especialidades' });
  }
};
