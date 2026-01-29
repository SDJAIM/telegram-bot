const services = {
  telegramService: new (require('../services/telegram-service'))(
    process.env.TELEGRAM_ADMIN_TOKEN,
    process.env.TELEGRAM_ADMIN_CHAT_ID
  ),
  customerTelegramBotService: new (require('../services/customer-telegram-bot-service'))(
    process.env.TELEGRAM_CUSTOMER_BOT_TOKEN,
    process.env.TELEGRAM_CUSTOMER_BOT_NAME
  )
}

function createServiceMiddleware (serviceName) {
  return (req, res, next) => {
    req[serviceName] = services[serviceName]
    next()
  }
}

module.exports = Object.keys(services).reduce((middlewares, serviceName) => {
  middlewares[`${serviceName}Middleware`] = createServiceMiddleware(serviceName)
  return middlewares
}, {})
