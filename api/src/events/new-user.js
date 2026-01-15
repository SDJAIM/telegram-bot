const EmailService = require('../services/email-service')

exports.handleEvent = async (redisClient, subscriberClient) => {
  try {
    await subscriberClient.subscribe('new-user', async (message, channel) => {
      if (channel === 'new-user') {
        try {
          const data = JSON.parse(message)
          const emailService = new EmailService(process.env.EMAIL_TYPE || 'gmail')
          emailService.sendEmail(data, 'user', 'activationUrl', { name: data.name })
        } catch (err) {
          console.error('Error procesando mensaje de new-user:', err)
        }
      }
    })
    console.log('✓ Suscrito al canal: new-user')
  } catch (err) {
    console.error('Error al suscribirse al canal new-user:', err)
  }
}
