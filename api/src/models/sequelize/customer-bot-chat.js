module.exports = function (sequelize, DataTypes) {
  const Model = sequelize.define('CustomerBotChat',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      customerBotId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      emisor: {
        type: DataTypes.STRING,
        allowNull: false
      },
      message: {
        type: DataTypes.TEXT,
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
      tableName: 'customer_bot_chats',
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
          name: 'customer_bot_chats_customerBotId',
          using: 'BTREE',
          fields: [
            { name: 'customerBotId' }
          ]
        }
      ]
    }
  )

  Model.associate = function (models) {
    Model.belongsTo(models.CustomerBot, { as: 'customerBot', foreignKey: 'customerBotId' })
  }

  return Model
}
