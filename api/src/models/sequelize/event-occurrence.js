module.exports = function (sequelize, DataTypes) {
  const Model = sequelize.define('EventOccurrence',
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
      startDateTime: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Por favor, rellena el campo "Fecha de inicio".'
          },
          isDate: {
            msg: 'Por favor, introduce una fecha válida.'
          }
        }
      },
      endDateTime: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Por favor, rellena el campo "Fecha de fin".'
          },
          isDate: {
            msg: 'Por favor, introduce una fecha válida.'
          },
          isAfterStartDateTime (value) {
            if (this.startDateTime && value <= this.startDateTime) {
              throw new Error('La fecha de fin debe ser posterior a la fecha de inicio.')
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
      tableName: 'event_occurrences',
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
          name: 'event_occurrences_eventId',
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
