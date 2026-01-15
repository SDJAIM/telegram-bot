'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('customer_activation_tokens', {
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
      token: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
        comment: 'Token de activación único generado con crypto'
      },
      expiresAt: {
        type: Sequelize.DATE,
        allowNull: false,
        comment: 'Fecha de expiración del token (24 horas)'
      },
      used: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Indica si el token ya fue utilizado'
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
    await queryInterface.addIndex('customer_activation_tokens', ['customerId'], {
      name: 'customer_activation_tokens_customer_id'
    })

    await queryInterface.addIndex('customer_activation_tokens', ['token'], {
      name: 'customer_activation_tokens_token',
      unique: true
    })

    await queryInterface.addIndex('customer_activation_tokens', ['expiresAt'], {
      name: 'customer_activation_tokens_expires_at'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('customer_activation_tokens')
  }
}
