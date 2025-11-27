const express = require('express');
const router = express.Router();
const especialidadeController = require('../controllers/especialidadeController');

router.get('/', especialidadeController.getEspecialidades);

module.exports = router;
