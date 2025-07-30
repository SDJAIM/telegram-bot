'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('PROMOTER_ACTIVATION_TOKENS', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      promoterId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'PROMOTERS',
          key: 'id'
        }
      },
      token: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      expirationDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      used: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
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
        type: Sequelize.DATE,
        allowNull: true
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('PROMOTER_ACTIVATION_TOKENS')
  }
}
