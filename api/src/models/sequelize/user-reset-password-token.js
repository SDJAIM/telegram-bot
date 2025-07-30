'use strict'

const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class UserResetPasswordToken extends Model {
    static associate (models) {
      this.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      })
    }
  }

  UserResetPasswordToken.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'USERS',
        key: 'id'
      }
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false
    },
    expirationDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    used: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'UserResetPasswordToken',
    tableName: 'USER_RESET_PASSWORD_TOKENS',
    timestamps: true,
    paranoid: false
  })

  return UserResetPasswordToken
}
