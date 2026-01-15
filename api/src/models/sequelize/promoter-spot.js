'use strict'

const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class PromoterSpot extends Model {
    static associate (models) {
      PromoterSpot.belongsTo(models.Promoter, {
        foreignKey: 'promoterId',
        as: 'promoter'
      })
      PromoterSpot.belongsTo(models.Spot, {
        foreignKey: 'spotId',
        as: 'spot'
      })
    }
  }
  PromoterSpot.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    promoterId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'promoters',
        key: 'id'
      }
    },
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'spots',
        key: 'id'
      }
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    deletedAt: {
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'PromoterSpot',
    tableName: 'promoter_spots',
    paranoid: true
  })
  return PromoterSpot
}
