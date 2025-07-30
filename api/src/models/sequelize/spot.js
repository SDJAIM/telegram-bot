'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    static associate (models) {
      Spot.belongsTo(models.Town, {
        foreignKey: 'townId',
        as: 'town'
      })
    }
  }
  Spot.init({
    townId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'towns',
        key: 'id'
      }
    },
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    address: DataTypes.STRING,
    latitude: DataTypes.FLOAT,
    longitude: DataTypes.FLOAT,
    environment: {
      type: DataTypes.ENUM('indoor', 'outdoor', 'mixed'),
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    deletedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Spot',
    paranoid: true,
    underscored: true,
  })
  return Spot
}
