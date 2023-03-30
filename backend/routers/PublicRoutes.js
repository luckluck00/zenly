const express = require('express');
const router = express.Router();
const publicController = require('../controllers/PublicController');
router.post('/login', publicController.login);
router.post('/register', publicController.register);
router.post('/validation', publicController.validation);
module.exports = router;