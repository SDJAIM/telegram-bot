'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class EventPrice extends Model {
    static associate (models) {
      EventPrice.belongsTo(models.Event, {
        foreignKey: 'eventId',
        as: 'event'
      })
    }
  }
  EventPrice.init({
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'events',
        key: 'id'
      }
    },
    description: DataTypes.STRING,
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    deletedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'EventPrice',
    paranoid: true,
    underscored: true,
  })
  return EventPrice
}
