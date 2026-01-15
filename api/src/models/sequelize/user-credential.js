const bcrypt = require('bcrypt')

module.exports = function (sequelize, DataTypes) {
  const Model = sequelize.define('UserCredential',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'User',
          key: 'id'
        },
        validate: {
          notNull: {
            msg: 'Por favor, rellena el campo "Usuario".'
          },
          notEmpty: {
            msg: 'Por favor, rellena el campo "Usuario".'
          }
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: {
            args: true,
            msg: 'Debe ser um e-mail válido'
          },
          notNull: {
            msg: 'Por favor, rellena el campo "Email".'
          },
          notEmpty: {
            msg: 'Por favor, rellena el campo "Email".'
          }
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Por favor, rellena el campo "Contraseña".'
          },
          notEmpty: {
            msg: 'Por favor, rellena el campo "Contraseña".'
          },
          len: {
            args: [8, 255],
            msg: 'La contraseña debe tener al menos 8 caracteres'
          }
        }
      },
      lastPasswordChange: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        validate: {
          notNull: {
            msg: 'Por favor, rellena el campo "Último cambio de contraseña".'
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
      tableName: 'user_credentials',
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
      ],
      // AGREGAR HOOKS PARA HASH DE CONTRASEÑAS
      hooks: {
        beforeCreate: async (userCredential) => {
          if (userCredential.password) {
            const salt = await bcrypt.genSalt(10)
            userCredential.password = await bcrypt.hash(userCredential.password, salt)
          }
        },
        beforeUpdate: async (userCredential) => {
          if (userCredential.changed('password')) {
            const salt = await bcrypt.genSalt(10)
            userCredential.password = await bcrypt.hash(userCredential.password, salt)
            userCredential.lastPasswordChange = new Date()
          }
        }
      }
    }
  )

  // AGREGAR MÉTODO PARA COMPARAR CONTRASEÑAS
  Model.prototype.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password)
  }

  Model.associate = function (models) {
    Model.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    })
  }

  return Model
}
