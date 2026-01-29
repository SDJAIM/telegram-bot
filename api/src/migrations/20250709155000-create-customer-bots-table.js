'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('customer_bots', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      customerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'customers',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      botId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'bots',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive', 'suspended'),
        defaultValue: 'active',
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    })

    // Add unique constraint to prevent duplicate customer-bot pairs
    await queryInterface.addIndex('customer_bots', ['customerId', 'botId'], {
      unique: true,
      name: 'customer_bots_customer_bot_unique'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('customer_bots')
  }
}
