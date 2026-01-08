const EmailService = require('../services/email-service')

exports.handleEvent = async (redisClient, subscriberClient) => {
  subscriberClient.subscribe('new-user', (err) => {
    if (err) {
      console.error('Error al suscribirse al canal:', err)
    }
  })

  subscriberClient.on('message', async (channel, message) => {
    if (channel === 'new-user') {
      const data = JSON.parse(message)
      const emailService = new EmailService('gmail')

      emailService.sendEmail(data, 'user', 'activationUrl', { name: data.name })
    }
  })
}
