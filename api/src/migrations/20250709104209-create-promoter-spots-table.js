'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('PromoterSpots', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      promoterId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Promoters',
          key: 'id'
        }
      },
      spotId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Spots',
          key: 'id'
        }
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
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('PromoterSpots')
  }
}
