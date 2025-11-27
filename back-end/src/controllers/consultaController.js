const db = require("../config/db");

// Agendar nova consulta
exports.agendarConsulta = async (req, res) => {
  const { usuario_id, medico_id, data_hora } = req.body;

  try {
    const result = await db.query(
      "INSERT INTO consultas (usuario_id, medico_id, data_hora) VALUES ($1, $2, $3) RETURNING *",
      [usuario_id, medico_id, data_hora]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// Listar todas as consulta
exports.listarConsultas = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM consultas ORDER BY data_hora");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// Excluir consulta
exports.excluirConsulta = async (req, res) => {
  const consultaId = req.params.id;

  try {
    await db.query("DELETE FROM consultas WHERE id = $1", [consultaId]);
    res.status(204).send(); // Sem conteúdo, sucesso
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// Atualizar data/hora da consulta
exports.atualizarConsulta = async (req, res) => {
  const consultaId = req.params.id;
  const { data_hora } = req.body;

  try {
    const result = await db.query(
      "UPDATE consultas SET data_hora = $1 WHERE id = $2 RETURNING *",
      [data_hora, consultaId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.consultasPorUsuario = async (req, res) => {
  const usuarioId = req.params.id;
  if (!usuarioId || usuarioId === "undefined") {
    return res.status(400).json({ erro: "ID do usuário não enviado, inválido ou undefined." });
  }
  try {
    const result = await db.query(
      "SELECT c.id, c.data_hora, m.nome AS medico, e.nome AS especialidade FROM consultas c INNER JOIN medicos m ON c.medico_id = m.id INNER JOIN especialidades e ON m.especialidade_id = e.id WHERE c.usuario_id = $1 ORDER BY c.data_hora",
      [usuarioId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("ERRO NO SQL consultasPorUsuario:", err);
    res.status(500).json({ erro: err.message });
  }
};

