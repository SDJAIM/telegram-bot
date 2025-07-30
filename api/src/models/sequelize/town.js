'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Town extends Model {
    static associate (models) {
      // associations can be defined here
    }
  }
  Town.init({
    name: DataTypes.STRING,
    deletedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Town',
    paranoid: true,
    underscored: true,
  })
  return Town
}
