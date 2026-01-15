'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class SentEmail extends Model {
    static associate (models) {
      // associations can be defined here
    }
  }
  SentEmail.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sendAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    emailTemplate: {
      type: DataTypes.STRING,
      allowNull: false
    },
    readed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    readedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    uuid: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    deletedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'SentEmail',
    paranoid: true,
    tableName: 'emails'
  })
  return SentEmail
}
