module.exports = function (sequelize, DataTypes) {
  const Model = sequelize.define('Promoter',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Por favor, rellena el campo "Nombre".'
          },
          notEmpty: {
            msg: 'Por favor, rellena el campo "Nombre".'
          }
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: {
            msg: 'Debe ser un e-mail válido'
          },
          notNull: {
            msg: 'Por favor, rellena el campo "Email".'
          },
          notEmpty: {
            msg: 'Por favor, rellena el campo "Email".'
          }
        }
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
      tableName: 'users',
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
    Model.hasOne(models.PromoterCredential, { as: 'promoterCredential', foreignKey: 'promoterId' })
    Model.hasMany(models.PromoterActivationToken, { as: 'promoterActivationTokens', foreignKey: 'promoterId' })
    Model.hasOne(models.PromoterActivationToken, { as: 'promoterActivationToken', foreignKey: 'promoterId', scope: { used: false } })
    Model.hasMany(models.PromoterResetPasswordToken, { as: 'promoterResetPasswordTokens', foreignKey: 'promoterId' })
    Model.hasOne(models.PromoterResetPasswordToken, { as: 'promoterResetPasswordToken', foreignKey: 'promoterId', scope: { used: false } })
    Model.hasMany(models.PromoterSpot, { as: 'promoterSpots', foreignKey: 'promoterId' })
    Model.hasMany(models.Event, { as: 'events', foreignKey: 'promoterId' })
    Model.hasMany(models.Email, { as: 'promoterEmails', foreignKey: 'userId' })
  }

  return Model
}
