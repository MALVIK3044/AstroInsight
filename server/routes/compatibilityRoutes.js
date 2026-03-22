const express = require('express');
const router = express.Router();
const { generateCompatibility, getCompatibilityHistory } = require('../controllers/compatibilityController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getCompatibilityHistory)
  .post(protect, generateCompatibility);

module.exports = router;
