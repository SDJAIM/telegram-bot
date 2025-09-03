module.exports = function (sequelize, DataTypes) {
  const Model = sequelize.define('Email', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Por favor, rellena el campo "Asunto".'
        },
        notEmpty: {
          msg: 'Por favor, rellena el campo "Asunto".'
        }
      }
    },
    path: {
      type: DataTypes.STRING,
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
    tableName: 'emails',
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
    Model.hasMany(models.SentEmail, { as: 'sentEmails', foreignKey: 'emailId' })
    Model.hasMany(models.EmailError, { as: 'emailErrors', foreignKey: 'emailId' })
    Model.belongsToMany(models.Customer, { through: models.SentEmail, as: 'customers', foreignKey: 'emailId' })
    Model.belongsToMany(models.Promoter, { through: models.SentEmail, as: 'promoters', foreignKey: 'emailId' })
  }

  return Model
}
