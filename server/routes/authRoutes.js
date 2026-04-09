const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/authMiddleware');
const sendEmail = require('../utils/sendEmail');

// @route   POST /api/auth/register
// @desc    Register a user
// @access  Public
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body; 
    
    if (password.length <= 4) {
        return res.status(400).json({ msg: 'Password must be more than 4 characters.' });
    }
    if (!/[@#$]/.test(password)) {
        return res.status(400).json({ msg: 'Password must contain a special character (@, #, $).' });
    }

    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({ name: req.body.name, email: req.body.email, password: req.body.password });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);

        await user.save();
        
        const payload = { user: { id: user.id, role: user.role } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5 days' }, (err, token) => {
            if (err) throw err;
            res.json({ token, role: user.role, name: user.name });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = { user: { id: user.id, role: user.role } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5 days' }, (err, token) => {
            if (err) throw err;
            res.json({ token, role: user.role, name: user.name });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP and return JWT
// @access  Public
router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ email }).select('+otp +otpExpires');
        if (!user) return res.status(400).json({ msg: 'User not found' });

        if (!user.otp || !user.otpExpires) {
            return res.status(400).json({ msg: 'No OTP generated. Please login or register again.' });
        }

        if (Date.now() > user.otpExpires.getTime()) {
            user.otp = undefined;
            user.otpExpires = undefined;
            await user.save();
            return res.status(400).json({ msg: 'OTP has expired. Please request a new one.' });
        }

        const isMatch = await bcrypt.compare(otp, user.otp);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid OTP' });

        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        const payload = { user: { id: user.id, role: user.role } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5 days' }, (err, token) => {
            if (err) throw err;
            res.json({ token, role: user.role, name: user.name });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/auth/me
// @desc    Get logged in user
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/auth/resend-otp
router.post('/resend-otp', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'User not found' });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = await bcrypt.hash(otp, 10);
        user.otpExpires = Date.now() + 10 * 60 * 1000;
        await user.save();

        console.log(`\n=== DEVELOPMENT MODE LOG ===\nResent OTP for ${email}: ${otp}\n============================\n`);

        await sendEmail({
            email: user.email,
            subject: 'AstroInsight Code Resent',
            message: `<h2>Cosmic Verification</h2><p>Your new access code is: <strong style="font-size: 24px;">${otp}</strong></p><p>This code will expire in 10 minutes.</p>`
        });
        res.json({ msg: 'New OTP sent to email' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'User not found. Please register.' });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = await bcrypt.hash(otp, 10);
        user.otpExpires = Date.now() + 10 * 60 * 1000;
        await user.save();

        console.log(`\n=== DEVELOPMENT MODE LOG ===\nForgot Password OTP for ${email}: ${otp}\n============================\n`);

        await sendEmail({
            email: user.email,
            subject: 'AstroInsight Password Reset',
            message: `<h2>Cosmic Password Recovery</h2><p>Your password reset code is: <strong style="font-size: 24px;">${otp}</strong></p><p>This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>`
        });
        res.json({ msg: 'Recovery OTP sent to email', requiresOtp: true });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
    const { email, otp, newPassword } = req.body;
    if (newPassword.length <= 4 || !/[@#$]/.test(newPassword)) {
        return res.status(400).json({ msg: 'Password must be > 4 characters and contain a special character (@, #, $).' });
    }
    try {
        const user = await User.findOne({ email }).select('+otp +otpExpires');
        if (!user) return res.status(400).json({ msg: 'User not found' });
        if (!user.otp || !user.otpExpires || Date.now() > user.otpExpires.getTime()) {
            return res.status(400).json({ msg: 'OTP has expired or is invalid.' });
        }
        const isMatch = await bcrypt.compare(otp, user.otp);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid OTP' });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.json({ msg: 'Password successfully reset' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
