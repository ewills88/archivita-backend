const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

// Initialize Sequelize connection
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false, // Disable SQL logs in console
});

// Define User Model
const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, { timestamps: true });

// ✅ Hash password before saving
User.beforeCreate(async (user) => {
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

// Import Subscription Model
const Subscription = require('./Subscription');

// Define relationship: A User can have multiple subscriptions
User.hasMany(Subscription, { foreignKey: 'userId', onDelete: 'CASCADE' });
Subscription.belongsTo(User, { foreignKey: 'userId' });

// Sync database
sequelize.sync()
  .then(() => console.log('✅ Database & User Table Synced'))
  .catch(err => console.error('❌ Database Sync Error:', err));

module.exports = { User, Subscription, sequelize };
