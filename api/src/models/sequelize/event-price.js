module.exports = function (sequelize, DataTypes) {
  const Model = sequelize.define('EventPrice',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      eventId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Por favor, rellena el campo "Precio".'
          },
          isDecimal: {
            msg: 'El campo "Precio" debe ser un número decimal.'
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
      tableName: 'event_prices',
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
          name: 'event_prices_eventId',
          using: 'BTREE',
          fields: [
            { name: 'eventId' }
          ]
        }
      ]
    }
  )

  Model.associate = function (models) {
    Model.belongsTo(models.Event, { as: 'event', foreignKey: 'eventId' })
  }

  return Model
}
