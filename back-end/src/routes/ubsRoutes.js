const express = require('express');
const router = express.Router();
const { buscarUbsProximas } = require('../controllers/ubsController');

router.get('/proximas', buscarUbsProximas);

module.exports = router;
