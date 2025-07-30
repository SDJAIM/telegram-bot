'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class PromoterCredential extends Model {
    static associate (models) {
      PromoterCredential.belongsTo(models.Promoter, {
        foreignKey: 'promoterId',
        as: 'promoter'
      })
    }
  }

  PromoterCredential.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    promoterId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'PROMOTERS',
        key: 'id'
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastPasswordChange: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    deletedAt: {
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'PromoterCredential',
    tableName: 'PROMOTER_CREDENTIALS',
    paranoid: true
  })

  return PromoterCredential
}
