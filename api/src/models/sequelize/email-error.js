module.exports = function (sequelize, DataTypes) {
  const Model = sequelize.define('EmailError', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    userType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    emailTemplate: {
      type: DataTypes.STRING,
      allowNull: false
    },
    error: {
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
    tableName: 'email_errors',
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
  })

  Model.associate = function (models) {
    Model.belongsTo(models.User, { as: 'user', foreignKey: 'userId' })
    Model.belongsTo(models.Promoter, { as: 'promoter', foreignKey: 'userId' })
    Model.belongsTo(models.Customer, { as: 'customer', foreignKey: 'userId' })
  }

  return Model
}
