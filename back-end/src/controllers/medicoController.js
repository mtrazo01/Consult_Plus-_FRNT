const pool = require('../models/db');

exports.listarMedicos = async (req, res) => {
  try {
    const result = await db.query("SELECT id, nome, especialidade_id, avatar_url FROM medicos");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.buscarPorEspecialidade = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM medicos WHERE especialidade_id = $1',
      [id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar médicos por especialidade:', error);
    res.status(500).json({ erro: 'Erro ao buscar médicos' });
  }
};
