const express = require("express");
const router = express.Router();
const consultaController = require("../controllers/consultaController");

router.post("/", consultaController.agendarConsulta);
router.get("/", consultaController.listarConsultas);
router.get("/usuario/:id", consultaController.consultasPorUsuario);
router.delete("/:id", consultaController.excluirConsulta);
router.put("/:id", consultaController.atualizarConsulta);

module.exports = router;
