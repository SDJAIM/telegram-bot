module.exports = function (sequelize, DataTypes) {
  const BotVerification = sequelize.define('BotVerification',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notNull: {
            msg: 'El email es obligatorio.'
          },
          notEmpty: {
            msg: 'El email no puede estar vacío.'
          },
          isEmail: {
            msg: 'El formato del email no es válido.'
          }
        }
      },
      verificationCode: {
        type: DataTypes.STRING(6),
        allowNull: false,
        validate: {
          notNull: {
            msg: 'El código de verificación es obligatorio.'
          },
          is: {
            args: /^\d{6}$/,
            msg: 'El código debe tener exactamente 6 dígitos.'
          }
        }
      },
      telegramUserId: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
        validate: {
          isUnique: async function (value) {
            if (!value) return // Allow null
            const existing = await BotVerification.findOne({
              where: { telegramUserId: value }
            })
            if (existing && existing.id !== this.id) {
              throw new Error('Este usuario de Telegram ya está vinculado a otra cuenta.')
            }
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
      tableName: 'bot_verifications',
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'id' }]
        },
        {
          name: 'bot_verifications_email',
          using: 'BTREE',
          fields: [{ name: 'email' }]
        },
        {
          name: 'bot_verifications_code',
          using: 'BTREE',
          fields: [{ name: 'verificationCode' }]
        },
        {
          name: 'bot_verifications_telegram_user_id',
          unique: true,
          using: 'BTREE',
          fields: [{ name: 'telegramUserId' }]
        }
      ]
    }
  )

  BotVerification.associate = function (models) {
    // No associations needed for now
  }

  return BotVerification
}
