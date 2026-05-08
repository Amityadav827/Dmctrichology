const express = require('express');
const router = express.Router();
const consultationController = require('../controllers/consultationController');

router.get('/', consultationController.getConsultation);
router.put('/', consultationController.updateConsultation);

module.exports = router;
