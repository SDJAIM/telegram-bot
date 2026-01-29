'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class CustomerBotChat extends Model {
    static associate (models) {
      // Belongs to CustomerBot (junction table)
      CustomerBotChat.belongsTo(models.CustomerBot, {
        foreignKey: 'customerBotId',
        as: 'customerBot'
      })
    }
  }

  CustomerBotChat.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    customerBotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'customer_bots',
        key: 'id'
      }
    },
    emisor: {
      type: DataTypes.ENUM('customer', 'bot'),
      allowNull: false,
      comment: 'Who sent the message: customer or bot'
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    deletedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'CustomerBotChat',
    paranoid: true,
    tableName: 'customer_bot_chats',
    timestamps: true
  })

  return CustomerBotChat
}
