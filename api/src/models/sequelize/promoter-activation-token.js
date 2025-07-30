'use strict'

const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class PromoterActivationToken extends Model {
    static associate (models) {
      PromoterActivationToken.belongsTo(models.Promoter, {
        foreignKey: 'promoterId',
        as: 'promoter'
      })
    }
  }

  PromoterActivationToken.init({
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
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'PromoterActivationToken',
    tableName: 'PROMOTER_ACTIVATION_TOKENS',
    paranoid: true,
    timestamps: true
  })

  return PromoterActivationToken
}
