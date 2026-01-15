const bcrypt = require('bcrypt')

module.exports = function (sequelize, DataTypes) {
  const Model = sequelize.define('CustomerCredential',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      customerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'customers',
          key: 'id'
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: {
            args: true,
            msg: 'Debe ser un e-mail válido'
          }
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [8, 100],
            msg: 'La contraseña debe tener al menos 8 caracteres'
          }
        }
      },
      lastPasswordChange: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
        get () {
          return this.getDataValue('lastPasswordChange')
            ? this.getDataValue('lastPasswordChange').toISOString().split('T')[0]
            : null
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
      },
      deletedAt: {
        type: DataTypes.DATE
      }
    }, {
      sequelize,
      tableName: 'customer_credentials',
      timestamps: true,
      paranoid: true,
      hooks: {
        beforeCreate: async (credential) => {
          if (credential.password) {
            const salt = await bcrypt.genSalt(10)
            credential.password = await bcrypt.hash(credential.password, salt)
          }
        },
        beforeUpdate: async (credential) => {
          if (credential.changed('password')) {
            const salt = await bcrypt.genSalt(10)
            credential.password = await bcrypt.hash(credential.password, salt)
            credential.lastPasswordChange = new Date()
          }
        }
      },
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'id' }]
        },
        {
          name: 'customer_credentials_customer_id',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'customerId' }]
        },
        {
          name: 'customer_credentials_email',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'email' }]
        }
      ]
    }
  )

  Model.associate = function (models) {
    Model.belongsTo(models.Customer, {
      foreignKey: 'customerId',
      as: 'customer'
    })
  }

  Model.prototype.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password)
  }

  return Model
}
