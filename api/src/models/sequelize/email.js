'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Email extends Model {
    static associate (models) {
      // associations can be defined here
    }
  }
  Email.init({
    subject: DataTypes.STRING,
    path: DataTypes.STRING,
    deletedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Email',
    paranoid: true,
    tableName: 'emails'
  })
  return Email
}
