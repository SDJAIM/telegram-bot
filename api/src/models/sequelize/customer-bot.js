'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class CustomerBot extends Model {
    static associate (models) {
      // Belongs to Customer
      CustomerBot.belongsTo(models.Customer, {
        foreignKey: 'customerId',
        as: 'customer'
      })

      // Belongs to Bot
      CustomerBot.belongsTo(models.Bot, {
        foreignKey: 'botId',
        as: 'bot'
      })

      // Has many chat messages
      CustomerBot.hasMany(models.CustomerBotChat, {
        foreignKey: 'customerBotId',
        as: 'customerBotChats'
      })
    }
  }

  CustomerBot.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'customers',
        key: 'id'
      }
    },
    botId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'bots',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'suspended'),
      defaultValue: 'active',
      allowNull: false
    },
    deletedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'CustomerBot',
    paranoid: true,
    tableName: 'customer_bots',
    timestamps: true
  })

  return CustomerBot
}
