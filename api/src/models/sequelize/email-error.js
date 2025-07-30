'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class EmailError extends Model {
    static associate (models) {
      // No associations needed
    }
  }
  EmailError.init({
    userType: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    emailTemplate: DataTypes.STRING,
    error: DataTypes.TEXT,
    deletedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'EmailError',
    paranoid: true,
    tableName: 'email_errors'
  })
  return EmailError
}
