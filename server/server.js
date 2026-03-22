  require('dotenv').config();
  const express = require('express');
  const cors = require('cors');
  const connectDB = require('./config/db');

  // Connect to database
  connectDB();

  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Routes
  app.use('/api/auth', require('./routes/authRoutes'));
  app.use('/api/insight', require('./routes/insightRoutes'));
  app.use('/api/admin', require('./routes/adminRoutes'));
  app.use('/api/chat', require('./routes/chatRoutes'));
  app.use('/api/compatibility', require('./routes/compatibilityRoutes'));

  // Basic route for testing
  app.get('/', (req, res) => {
    res.send('AstroInsight API is running...');
  });

  // Error handling middleware
  app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  });

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
