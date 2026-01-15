module.exports = (sequelize, DataTypes) => {
  const CustomerActivationToken = sequelize.define('CustomerActivationToken', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'customers',
        key: 'id'
      }
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    used: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    createdAt: {
      type: DataTypes.DATE
    },
    updatedAt: {
      type: DataTypes.DATE
    },
    deletedAt: {
      type: DataTypes.DATE
    }
  }, {
    tableName: 'customer_activation_tokens',
    timestamps: true,
    paranoid: true
  })

  CustomerActivationToken.associate = function (models) {
    CustomerActivationToken.belongsTo(models.Customer, {
      foreignKey: 'customerId',
      as: 'customer'
    })
  }

  return CustomerActivationToken
}
