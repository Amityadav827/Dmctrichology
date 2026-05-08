const express = require('express');
const router = express.Router();
const surgeonController = require('../controllers/surgeonController');

router.get('/', surgeonController.getSurgeons);
router.put('/', surgeonController.updateSurgeons);

module.exports = router;
