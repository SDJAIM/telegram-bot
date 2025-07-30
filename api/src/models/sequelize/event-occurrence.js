'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class EventOccurrence extends Model {
    static associate (models) {
      EventOccurrence.belongsTo(models.Event, {
        foreignKey: 'eventId',
        as: 'event'
      })
    }
  }
  EventOccurrence.init({
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    startDateTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDateTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    deletedAt: {
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'EventOccurrence',
    paranoid: true
  })
  return EventOccurrence
}
