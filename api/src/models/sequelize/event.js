'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    static associate (models) {
      Event.belongsTo(models.Town, { foreignKey: 'townId' })
      Event.belongsTo(models.Spot, { foreignKey: 'spotId' })
      Event.belongsTo(models.EventCategory, { foreignKey: 'categoryId' })
      Event.hasMany(models.EventPrice, { foreignKey: 'eventId' })
      Event.hasMany(models.EventOccurrence, {
        foreignKey: 'eventId',
        as: 'occurrences'
      })
    }
  }

  Event.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    townId: DataTypes.INTEGER,
    spotId: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Event',
    paranoid: true
  })

  return Event
}
