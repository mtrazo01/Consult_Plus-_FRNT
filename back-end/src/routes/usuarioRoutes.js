const express = require('express');
const router = express.Router();

const {
  criarUsuario,
  loginUsuario,
  atualizarUsuario,
  excluirUsuario,
} = require("../controllers/usuarioController");

const { verificarToken } = require("../middlewares/authMiddleware");

router.post("/", criarUsuario);
router.post("/login", loginUsuario);
router.put("/:id", verificarToken, atualizarUsuario);
router.delete("/:id", verificarToken, excluirUsuario);

module.exports = router;
