'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('events', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      promoterId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      townId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      spotId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      categoryId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
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

    await queryInterface.addIndex('events', ['promoterId'], {
      name: 'events_promoterId'
    })

    await queryInterface.addIndex('events', ['townId'], {
      name: 'events_townId'
    })

    await queryInterface.addIndex('events', ['spotId'], {
      name: 'events_spotId'
    })

    await queryInterface.addIndex('events', ['categoryId'], {
      name: 'events_categoryId'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('events')
  }
}
