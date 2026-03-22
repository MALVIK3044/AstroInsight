const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Insight = require('../models/Insight');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
router.get('/users', protect, admin, async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all insights
// @route   GET /api/admin/insights
// @access  Private/Admin
router.get('/insights', protect, admin, async (req, res) => {
  try {
    const insights = await Insight.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.json(insights);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
router.delete('/users/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete an insight
// @route   DELETE /api/admin/insights/:id
// @access  Private/Admin
router.delete('/insights/:id', protect, admin, async (req, res) => {
  try {
    const insight = await Insight.findById(req.params.id);
    if (!insight) {
      return res.status(404).json({ message: 'Insight not found' });
    }
    await Insight.findByIdAndDelete(req.params.id);
    res.json({ message: 'Insight removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
