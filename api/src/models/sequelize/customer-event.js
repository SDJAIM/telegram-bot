'use strict'

module.exports = (sequelize, DataTypes) => {
  const CustomerEvent = sequelize.define('CustomerEvent', {
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'customers',
        key: 'id'
      }
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'events',
        key: 'id'
      }
    },
    deletedAt: DataTypes.DATE
  }, {
    paranoid: true,
    underscored: true,
    tableName: 'customer_events'
  })

  return CustomerEvent
}
