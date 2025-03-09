require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 5000;

const { sequelize } = require('./models/User');

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, 
  ssl: false, // Set to true if using a production database
});

// Test Database Connection
pool.connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch(err => console.error("❌ PostgreSQL Connection Error:", err.message));

// Start Server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});

// Sync Database (creates tables if they don't exist)
sequelize.sync()
  .then(() => console.log('✅ PostgreSQL Database Synced'))
  .catch(err => console.error('❌ Database Sync Error:', err));