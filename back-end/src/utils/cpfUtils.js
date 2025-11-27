const crypto = require("crypto");

function limparCPF(cpf) {
  if (!cpf) return "";
  return cpf.replace(/\D/g, "");
}

const key = Buffer.from(process.env.CPF_SECRET_KEY, "utf8");
const iv = Buffer.from(process.env.CPF_IV, "utf8");

// Criptografa CPF limpo
function encryptCPF(cpf) {
  const clean = limparCPF(cpf);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(clean, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

// Descriptografa
function decryptCPF(hash) {
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  let decrypted = decipher.update(hash, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

module.exports = { limparCPF, encryptCPF, decryptCPF };
