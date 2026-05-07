const express = require('express');
const { getHero, updateHero } = require('../controllers/heroController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getHero)
  .put(protect, updateHero);

module.exports = router;
