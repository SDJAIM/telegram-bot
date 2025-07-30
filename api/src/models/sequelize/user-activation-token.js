'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class UserActivationToken extends Model {
    static associate (models) {
      UserActivationToken.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      })
    }
  }
  UserActivationToken.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    expirationDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    used: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    deletedAt: {
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'UserActivationToken',
    paranoid: true,
    tableName: 'UserActivationTokens'
  })

  return UserActivationToken
}
