const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database'); // Adjust based on your setup
require('dotenv').config();

const router = express.Router();

// ✅ User Registration Route
router.post('/register', async (req, res) => {
  const { full_name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await db.query(
      'INSERT INTO users (full_name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
      [full_name, email, hashedPassword, 'student']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err });
  }
});

// ✅ User Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);

    if (user.rows.length === 0) return res.status(401).json({ message: 'Invalid email' });

    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) return res.status(401).json({ message: 'Invalid password' });

    const token = jwt.sign({ userId: user.rows[0].id, role: user.rows[0].role }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err });
  }
});

// ✅ Get User Info (Protected)
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await db.query('SELECT id, full_name, email, role FROM users WHERE id = $1', [req.user.userId]);
    res.json(user.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user', error: err });
  }
});

// ✅ JWT Authentication Middleware
function authenticateToken(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Access Denied' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(4
