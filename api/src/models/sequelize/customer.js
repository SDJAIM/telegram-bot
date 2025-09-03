module.exports = function (sequelize, DataTypes) {
  const Model = sequelize.define('Customer',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      prefix: {
        type: DataTypes.STRING,
        allowNull: false
      },
      telephone: {
        type: DataTypes.STRING,
        allowNull: false
      },
      birthdate: {
        type: DataTypes.DATE,
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
      tableName: 'customers',
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
        }
      ]
    }
  )

  Model.associate = function (models) {
    Model.hasOne(models.CustomerCredential, { as: 'customerCredential', foreignKey: 'customerId' })
    Model.hasMany(models.CustomerActivationToken, { as: 'customerActivationTokens', foreignKey: 'customerId' })
    Model.hasOne(models.CustomerActivationToken, { as: 'customerActivationToken', foreignKey: 'customerId', scope: { used: false } })
    Model.hasMany(models.CustomerResetPasswordToken, { as: 'customerResetPasswordTokens', foreignKey: 'customerId' })
    Model.hasOne(models.CustomerResetPasswordToken, { as: 'customerResetPasswordToken', foreignKey: 'customerId', scope: { used: false } })
    Model.hasMany(models.CustomerEvent, { as: 'customerEvents', foreignKey: 'customerId' })
    Model.belongsToMany(models.Event, { as: 'events', through: models.CustomerEvent, foreignKey: 'customerId' })
    Model.hasMany(models.CustomerBot, { as: 'customerBots', foreignKey: 'customerId' })
    Model.belongsToMany(models.Bot, { as: 'bots', through: models.CustomerBot, foreignKey: 'customerId' })
  }

  return Model
}
