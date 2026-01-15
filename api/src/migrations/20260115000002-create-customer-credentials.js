'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('customer_credentials', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      customerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'customers',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: 'Contraseña hasheada con bcrypt'
      },
      lastPasswordChange: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true
      }
    })

    // Indexes
    await queryInterface.addIndex('customer_credentials', ['customerId'], {
      name: 'customer_credentials_customer_id',
      unique: true
    })

    await queryInterface.addIndex('customer_credentials', ['email'], {
      name: 'customer_credentials_email',
      unique: true
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('customer_credentials')
  }
}
