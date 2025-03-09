const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const morgan = require('morgan'); // Logging Middleware
const usersRoutes = require('./routes/users'); // Import User Routes

const app = express();

// ✅ Security Middleware
app.use(cors({ origin: process.env.ALLOWED_ORIGINS || '*' })); // Allow CORS from env
app.use(helmet()); // Secure HTTP headers
app.use(express.json()); // Parse JSON requests
app.use(morgan('dev')); // Log HTTP requests

// ✅ Rate-Limiting (Prevent abuse)
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 50, // Reduce max requests per IP
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// ✅ JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Access Denied' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid Token' });
    req.user = user;
    next();
  });
};

// ✅ API Routes
app.use('/api/users', usersRoutes); // User Routes
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Access granted!', user: req.user });
});

// ✅ 404 Route Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route Not Found' });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
