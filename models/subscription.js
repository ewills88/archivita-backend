const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('./user'); // Import existing Sequelize instance
const User = require('./user'); // Import User model

const Subscription = sequelize.define('Subscription', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  stripeSubscriptionId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  planType: {
    type: DataTypes.ENUM('basic', 'standard-monthly', 'standard-annual', 'premium-monthly', 'premium-annual', 'one-time'),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('active', 'canceled', 'expired'),
    defaultValue: 'active',
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true, // Null for active plans
  },
}, { timestamps: true });

// Define relationship: A User can have multiple subscriptions
User.hasMany(Subscription, { foreignKey: 'userId', onDelete: 'CASCADE' });
Subscription.belongsTo(User, { foreignKey: 'userId' });

module.exports = Subscription;
