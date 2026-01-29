const AuthorizationService = require('../services/authorization-service')
const EmailService = require('../services/email-service')

exports.handleEvent = async (redisClient, subscriberClient) => {
  await subscriberClient.subscribe('new-customer', async (message) => {
    try {
      const data = JSON.parse(message)

      const authorizationService = new AuthorizationService()
      const activationUrl = await authorizationService.createActivationToken(data.id, 'customer')

      const emailService = new EmailService('gmail')
      await emailService.sendEmail(
        data,
        'customer',
        'activationUrl',
        { name: data.name, activationUrl }
      )
    } catch (error) {
      console.error('Error procesando mensaje:', error)
    }
  })
}
