'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('customers', 'name', {
      type: Sequelize.STRING(255),
      allowNull: false,
      defaultValue: 'Usuario',
      comment: 'Nombre del cliente'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('customers', 'name')
  }
}
