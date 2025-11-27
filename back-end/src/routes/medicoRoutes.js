const express = require('express');
const router = express.Router();
const medicoController = require('../controllers/medicoController');

router.get('/', medicoController.listarMedicos);
router.get('/especialidade/:id', medicoController.buscarPorEspecialidade);

module.exports = router;
