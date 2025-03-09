const { Sequelize } = require("sequelize");
require("dotenv").config(); // Load environment variables

// Initialize Sequelize with PostgreSQL connection
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false, // Disable logging for cleaner console output
});

// Test the database connection
sequelize.authenticate()
  .then(() => console.log("✅ Sequelize connected to PostgreSQL"))
  .catch(err => console.error("❌ Sequelize Connection Error:", err.message));

// Import models
const User = require("./user")(sequelize, Sequelize.DataTypes);

// Sync models with the database
sequelize.sync()
  .then(() => console.log("✅ Database Synced"))
  .catch(err => console.error("❌ Database Sync Error:", err));

// Export Sequelize instance and models
module.exports = { sequelize, User };
