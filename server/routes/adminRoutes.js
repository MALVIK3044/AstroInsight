const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const User = require('../models/User');
const Insight = require('../models/Insight');

// Admin Auth Middleware Logic
const adminAuth = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (user && user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ msg: 'Access denied. Administrator privilege required.' });
        }
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// @route   GET /api/admin/stats
// @desc    Get overall website stats
// @access  Private Admin
router.get('/stats', auth, adminAuth, async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const insightCount = await Insight.countDocuments();

        // Calculate AI tokens approximation
        const insights = await Insight.find().select('aiResult createdAt');
        const totalTokens = insights.reduce((acc, curr) => acc + (curr.aiResult ? curr.aiResult.length : 0), 0) * 1.5;

        // Generate Engagement Chart Data (last 7 days counts)
        const chartData = {};
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            chartData[d.toISOString().split('T')[0]] = 0;
        }

        insights.forEach(ins => {
            const dateStr = new Date(ins.createdAt).toISOString().split('T')[0];
            if (chartData[dateStr] !== undefined) chartData[dateStr]++;
        });
        
        const engagementChart = Object.keys(chartData).map(date => ({ date, count: chartData[date] }));

        res.json({ 
            totalUsers: userCount, 
            totalInsights: insightCount,
            totalTokens: Math.floor(totalTokens),
            engagementChart
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private Admin
router.get('/users', auth, adminAuth, async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete a user and their historical insights
// @access  Private Admin
router.delete('/users/:id', auth, adminAuth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        await User.findByIdAndDelete(req.params.id);
        await Insight.deleteMany({ userId: req.params.id });

        res.json({ msg: 'User and their associated insight data securely removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'User not found' });
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/admin/users/:id/role
// @desc    Update user role
// @access  Private Admin
router.put('/users/:id/role', auth, adminAuth, async (req, res) => {
    try {
        const { role } = req.body;
        if (!['user', 'admin'].includes(role)) return res.status(400).json({ msg: 'Invalid role' });
        
        const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
        if (!user) return res.status(404).json({ msg: 'User not found' });
        res.json(user);
    } catch (err) {
        if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'User not found' });
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/admin/users/:id/tier
// @desc    Update user subscription tier
// @access  Private Admin
router.put('/users/:id/tier', auth, adminAuth, async (req, res) => {
    try {
        const { tier } = req.body;
        if (!['Free', 'Premium'].includes(tier)) return res.status(400).json({ msg: 'Invalid tier' });
        
        const user = await User.findByIdAndUpdate(req.params.id, { subscriptionPlan: tier }, { new: true }).select('-password');
        if (!user) return res.status(404).json({ msg: 'User not found' });
        res.json(user);
    } catch (err) {
        if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'User not found' });
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/admin/insights-feed
// @desc    Get latest global insights feed
// @access  Private Admin
router.get('/insights-feed', auth, adminAuth, async (req, res) => {
    try {
        const insights = await Insight.find()
            .populate('userId', 'name email role')
            .sort({ createdAt: -1 })
            .limit(50);
        res.json(insights);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
