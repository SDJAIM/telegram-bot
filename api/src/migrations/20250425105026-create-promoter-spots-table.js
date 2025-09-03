'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('promoter_spots', {
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
      spotId: {
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

    await queryInterface.addIndex('promoter_spots', ['promoterId'], {
      name: 'promoter_spots_promoterId'
    })

    await queryInterface.addIndex('promoter_spots', ['spotId'], {
      name: 'promoter_spots_spotId'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('promoter_spots')
  }
}
