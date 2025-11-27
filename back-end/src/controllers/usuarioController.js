const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { limparCPF, encryptCPF, decryptCPF } = require("../utils/cpfUtils");

const jwtSecret = process.env.JWT_SECRET;

// =========================
//  CRIAR USUÁRIO
// =========================
async function criarUsuario(req, res) {
  try {
    const { nome, cpf, senha, telefone, data_nascimento } = req.body;

    const cpfLimpo = limparCPF(cpf);
    const telefoneLimpo = telefone.replace(/\D/g, "");

    // Verifica duplicidade pelo CPF criptografado
    const cpfCriptografado = encryptCPF(cpfLimpo);

    const exist = await db.query(
      "SELECT id FROM usuarios WHERE cpf = $1",
      [cpfCriptografado]
    );

    if (exist.rows.length > 0) {
      return res.status(409).json({ erro: "CPF já cadastrado" });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    const query = `
      INSERT INTO usuarios (nome, cpf, senha, telefone, data_nascimento)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, nome, cpf, telefone, data_nascimento;
    `;
    const values = [nome, cpfCriptografado, hashedPassword, telefoneLimpo, data_nascimento];

    const result = await db.query(query, values);

    // Descriptografar antes de devolver
    result.rows[0].cpf = cpfLimpo;

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return res.status(500).json({ erro: "Erro interno" });
  }
}

// =========================
//  LOGIN
// =========================
async function loginUsuario(req, res) {
  try {
  const { cpf, senha } = req.body;

    const cpfLimpo = limparCPF(cpf);
    const cpfCriptografado = encryptCPF(cpfLimpo);

    const result = await db.query("SELECT * FROM usuarios WHERE cpf = $1", [cpfCriptografado]);

    if (result.rows.length === 0) {
      return res.status(401).json({ erro: "CPF ou senha inválidos" });
    }

    const user = result.rows[0];
    const senhaOk = await bcrypt.compare(senha, user.senha);

    if (!senhaOk) {
      return res.status(401).json({ erro: "CPF ou senha inválidos" });
    }

    const token = jwt.sign(
      { id: user.id, cpf: user.cpf, nome: user.nome },
      jwtSecret,
      { expiresIn: "8h" }
    );

    // Remover senha e DESCRIPTOGRAFAR CPF
    const { senha: _, ...usuarioFinal } = user;
    usuarioFinal.cpf = decryptCPF(user.cpf);

    return res.json({ usuario: usuarioFinal, token });
  } catch (error) {
    console.error("Erro ao realizar login:", error);
    return res.status(500).json({ erro: "Erro interno" });
  }
}

// =========================
//  ATUALIZAR USUÁRIO
// =========================
async function atualizarUsuario(req, res) {
  try {
  const { id } = req.params;
    const { nome, cpf, senha, telefone, data_nascimento } = req.body;

    const cpfCriptografado = cpf ? encryptCPF(limparCPF(cpf)) : null;
    const telefoneLimpo = telefone ? telefone.replace(/\D/g, "") : null;
    const hashedPassword = senha ? await bcrypt.hash(senha, 10) : null;

    const query = `
      UPDATE usuarios
      SET
        nome = COALESCE($1, nome),
        cpf = COALESCE($2, cpf),
        senha = COALESCE($3, senha),
        telefone = COALESCE($4, telefone),
        data_nascimento = COALESCE($5, data_nascimento)
      WHERE id = $6
      RETURNING id, nome, cpf, telefone, data_nascimento;
    `;
    const values = [
      nome,
      cpfCriptografado,
      hashedPassword,
      telefoneLimpo,
      data_nascimento,
      id,
    ];

    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    // Descriptografa antes de enviar
    result.rows[0].cpf = decryptCPF(result.rows[0].cpf);

    return res.json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    return res.status(500).json({ erro: "Erro interno" });
  }
}

// =========================
//  EXCLUIR USUÁRIO
// =========================
async function excluirUsuario(req, res) {
  try {
  const { id } = req.params;
    const { senha } = req.body;

    const result = await db.query("SELECT * FROM usuarios WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    const user = result.rows[0];
    const senhaOk = await bcrypt.compare(senha, user.senha);

    if (!senhaOk) return res.status(401).json({ erro: "Senha incorreta" });

    const consultas = await db.query(
      "SELECT id FROM consultas WHERE usuario_id = $1",
      [id]
    );

    if (consultas.rows.length > 0) {
      return res.status(400).json({
        erro: "Você possui consultas agendadas. Cancele antes de apagar sua conta.",
      });
    }

    await db.query("DELETE FROM usuarios WHERE id = $1", [id]);

    return res.json({ mensagem: "Usuário excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);
    return res.status(500).json({ erro: "Erro interno" });
  }
}

module.exports = {
  criarUsuario,
  loginUsuario,
  atualizarUsuario,
  excluirUsuario,
};
