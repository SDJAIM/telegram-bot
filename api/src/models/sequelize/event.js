module.exports = function (sequelize, DataTypes) {
  const Model = sequelize.define('Event',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      promoterId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Por favor, rellena el campo "Promotor".'
          }
        }
      },
      townId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Por favor, rellena el campo "Localidad".'
          }
        }
      },
      spotId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Por favor, rellena el campo "Lugar".'
          }
        }
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Por favor, rellena el campo "Categoría".'
          }
        }
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Por favor, rellena el campo "Título".'
          },
          notEmpty: {
            msg: 'Por favor, rellena el campo "Título".'
          }
        }
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
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
      tableName: 'events',
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
          name: 'events_promoterId',
          using: 'BTREE',
          fields: [
            { name: 'promoterId' }
          ]
        },
        {
          name: 'events_spotId',
          using: 'BTREE',
          fields: [
            { name: 'spotId' }
          ]
        },
        {
          name: 'events_categoryId',
          using: 'BTREE',
          fields: [
            { name: 'categoryId' }
          ]
        },
        {
          name: 'events_townId',
          using: 'BTREE',
          fields: [
            { name: 'townId' }
          ]
        }
      ]
    }
  )

  Model.associate = function (models) {
    Model.belongsTo(models.Promoter, { as: 'promoter', foreignKey: 'promoterId' })
    Model.belongsTo(models.Town, { as: 'town', foreignKey: 'townId' })
    Model.belongsTo(models.Spot, { as: 'spot', foreignKey: 'spotId' })
    Model.belongsTo(models.EventCategory, { as: 'category', foreignKey: 'categoryId' })
    Model.hasMany(models.EventPrice, { as: 'prices', foreignKey: 'eventId' })
    Model.hasMany(models.EventOccurrence, { as: 'occurrences', foreignKey: 'eventId' })
    Model.belongsToMany(models.Customer, { as: 'customers', through: models.CustomerEvent, foreignKey: 'eventId' })
  }

  return Model
}
