const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Basic setup using ethereal/gmail for the 2FA system
    // In production, user will populate EMAIL_USER and EMAIL_PASS
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER || 'test@gmail.com', // Provide instructions to user to set this
            pass: process.env.EMAIL_PASS || 'fakedummy123',
        },
    });

    const message = {
        from: `AstroInsight Security <noreply@astroinsight.com>`,
        to: options.email,
        subject: options.subject,
        html: options.message,
    };

    try {
        await transporter.sendMail(message);
    } catch (error) {
        console.error("Email send failed (Check .env configuration):", error);
        // We log the error but do not throw to prevent crashing if user hasn't set env vars yet
    }
};

module.exports = sendEmail;
