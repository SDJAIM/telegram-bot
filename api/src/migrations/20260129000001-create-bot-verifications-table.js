'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('bot_verifications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: 'Email address of the customer attempting to verify'
      },
      verificationCode: {
        type: Sequelize.STRING(6),
        allowNull: false,
        comment: '6-digit verification code (000000-999999)'
      },
      telegramUserId: {
        type: Sequelize.STRING(255),
        allowNull: true,
        unique: true,
        comment: 'Telegram user ID after successful verification'
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

    // Index on email for lookup during /login
    await queryInterface.addIndex('bot_verifications', ['email'], {
      name: 'bot_verifications_email'
    })

    // Index on verificationCode for lookup during /login
    await queryInterface.addIndex('bot_verifications', ['verificationCode'], {
      name: 'bot_verifications_code'
    })

    // Index on telegramUserId for checking if user is verified
    await queryInterface.addIndex('bot_verifications', ['telegramUserId'], {
      name: 'bot_verifications_telegram_user_id',
      unique: true
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('bot_verifications')
  }
}
