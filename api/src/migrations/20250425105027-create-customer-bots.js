'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('customer_bots', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      customerId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      botId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    })

    await queryInterface.addIndex('customer_bots', ['customerId'], {
      name: 'customer_bots_customerId'
    })

    await queryInterface.addIndex('customer_bots', ['botId'], {
      name: 'customer_bots_botId'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('customer_bots')
  }
}
