const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');

router.get('/:key', settingController.getSetting);

module.exports = router;
