const express = require('express');
const router = express.Router();
const { getSectionData, updateSectionData, getAllSections } = require('../controllers/sectionController');

router.get('/', getAllSections);
router.get('/:sectionId', getSectionData);
router.put('/:sectionId', updateSectionData);

module.exports = router;
