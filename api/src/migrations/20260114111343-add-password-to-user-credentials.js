'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('user_credentials', 'password', {
      type: Sequelize.STRING(255),
      allowNull: true, // Temporalmente permite null
      comment: 'Contraseña hasheada con bcrypt'
    })

    // Para usuarios existentes, asignar un valor por defecto
    await queryInterface.sequelize.query(`
      UPDATE user_credentials 
      SET password = 'migracion-pendiente'
      WHERE password IS NULL
    `)

    // Ahora hacerla NOT NULL
    await queryInterface.changeColumn('user_credentials', 'password', {
      type: Sequelize.STRING(255),
      allowNull: false,
      comment: 'Contraseña hasheada con bcrypt'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('user_credentials', 'password')
  }
}
