const express = require('express');
const router = express.Router();
const { generateInsight, getInsightHistory } = require('../controllers/insightController');
const { protect } = require('../middleware/authMiddleware');

router.post('/generate', protect, generateInsight);
router.get('/history', protect, getInsightHistory);

module.exports = router;
