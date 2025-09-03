'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('event_occurrences', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      eventId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      startDateTime: {
        type: Sequelize.DATE,
        allowNull: false
      },
      endDateTime: {
        type: Sequelize.DATE,
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

    await queryInterface.addIndex('event_occurrences', ['eventId'], {
      name: 'event_occurrences_eventId'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('event_occurrences')
  }
}
