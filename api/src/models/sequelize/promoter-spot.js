module.exports = function (sequelize, DataTypes) {
  const Model = sequelize.define('PromoterSpot',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      promoterId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      spotId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      createdAt: {
        type: DataTypes.DATE,
        get () {
          return this.getDataValue('createdAt')
            ? this.getDataValue('createdAt').toISOString().split('T')[0]
            : null
        }
      },
      updatedAt: {
        type: DataTypes.DATE,
        get () {
          return this.getDataValue('updatedAt')
            ? this.getDataValue('updatedAt').toISOString().split('T')[0]
            : null
        }
      }
    }, {
      sequelize,
      tableName: 'promoter_spots',
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [
            { name: 'id' }
          ]
        },
        {
          name: 'promoter_spots_promoterId',
          using: 'BTREE',
          fields: [
            { name: 'promoterId' }
          ]
        },
        {
          name: 'promoter_spots_spotId',
          using: 'BTREE',
          fields: [
            { name: 'spotId' }
          ]
        }
      ]
    }
  )

  Model.associate = function (models) {
    Model.hasOne(models.PromoterCredential, { as: 'promoterCredential', foreignKey: 'promoterId' })
    Model.hasMany(models.PromoterActivationToken, { as: 'promoterActivationTokens', foreignKey: 'promoterId' })
    Model.hasOne(models.PromoterActivationToken, { as: 'promoterActivationToken', foreignKey: 'promoterId', scope: { used: false } })
    Model.hasMany(models.PromoterResetPasswordToken, { as: 'promoterResetPasswordTokens', foreignKey: 'promoterId' })
    Model.hasOne(models.PromoterResetPasswordToken, { as: 'promoterResetPasswordToken', foreignKey: 'promoterId', scope: { used: false } })
  }

  return Model
}
