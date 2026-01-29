const TelegramBot = require('node-telegram-bot-api')
const sequelizeDb = require('../models/sequelize')
const BotVerification = sequelizeDb.BotVerification

class CustomerTelegramBotService {
  constructor (token, botName) {
    if (!token) {
      console.warn('TELEGRAM_CUSTOMER_BOT_TOKEN not configured. Customer bot will not start.')
      this.bot = null
      return
    }

    this.token = token
    this.botName = botName || 'ChatBot'
    this.bot = new TelegramBot(this.token, { polling: true })

    console.log(`Customer Telegram bot "${this.botName}" initialized and listening...`)

    this.bot.on('message', (msg) => this.handleMessage(msg))
    this.bot.on('polling_error', (error) => {
      console.error('Telegram polling error:', error.code)
    })
  }

  async handleMessage (msg) {
    try {
      if (!this.bot) return

      const telegramUserId = msg.from.id.toString()
      const chatId = msg.chat.id

      // Check if user is already verified
      const verification = await BotVerification.findOne({
        where: { telegramUserId }
      })

      if (!verification) {
        // User NOT verified - only allow /login command
        const messageText = (msg.text || '').trim()

        if (messageText.toLowerCase().startsWith('/login')) {
          await this.handleLogin(msg, telegramUserId)
        } else {
          await this.sendLoginInstructions(chatId)
        }
        return
      }

      // User IS verified - proceed with normal bot logic
      await this.handleVerifiedUserMessage(msg, verification)
    } catch (error) {
      console.error('Error handling message:', error)
      await this.bot.sendMessage(msg.chat.id, 'Ocurrió un error. Por favor, intenta de nuevo.')
    }
  }

  async sendLoginInstructions (chatId) {
    const text =
      'Para poder usar el bot debes escribir: /login email:codigo\n\n' +
      'Ejemplo: /login carlossedagambin@gmail.com:768390'

    await this.bot.sendMessage(chatId, text)
  }

  async handleLogin (msg, telegramUserId) {
    const chatId = msg.chat.id
    const messageText = (msg.text || '').trim()

    try {
      // Parse /login email:code
      // Format: /login email:code (spaces around : are optional)
      const loginRegex = /^\/login\s+(.+?)\s*:\s*(.+)$/i
      const match = messageText.match(loginRegex)

      if (!match) {
        await this.bot.sendMessage(
          chatId,
          'Formato incorrecto. Usa: /login email:codigo\n\nEjemplo: /login tu@email.com:123456'
        )
        return
      }

      const email = match[1].trim()
      const code = match[2].trim()

      // Validate email format
      const emailRegex = /^\S+@\S+\.\S+$/
      if (!emailRegex.test(email)) {
        await this.bot.sendMessage(chatId, 'El formato del email no es válido.')
        return
      }

      // Validate code format (must be exactly 6 digits)
      const codeRegex = /^\d{6}$/
      if (!codeRegex.test(code)) {
        await this.bot.sendMessage(chatId, 'El código debe tener exactamente 6 dígitos.')
        return
      }

      // Check if this telegramUserId is already linked to another account
      const existingVerification = await BotVerification.findOne({
        where: { telegramUserId }
      })

      if (existingVerification) {
        await this.bot.sendMessage(
          chatId,
          'Ya estás vinculado a una cuenta. Si necesitas cambiar de cuenta, contacta al soporte.'
        )
        return
      }

      // Lookup verification record by email and code
      const verification = await BotVerification.findOne({
        where: {
          email,
          verificationCode: code,
          telegramUserId: null // Only match unlinked records
        }
      })

      if (!verification) {
        // Don't reveal which part was wrong for security
        await this.bot.sendMessage(chatId, 'Email o código incorrectos. Por favor, verifica e intenta de nuevo.')
        return
      }

      // SUCCESS - Link the telegramUserId
      await verification.update({ telegramUserId })

      await this.bot.sendMessage(
        chatId,
        '¡Verificación exitosa! Tu cuenta de Telegram ha sido vinculada correctamente. Ya puedes usar el bot.'
      )
    } catch (error) {
      console.error('Error in handleLogin:', error)
      await this.bot.sendMessage(chatId, 'Ocurrió un error durante la verificación. Por favor, intenta de nuevo.')
    }
  }

  async handleVerifiedUserMessage (msg, verification) {
    const chatId = msg.chat.id

    // Placeholder for verified user logic
    // This is where you would implement the actual bot functionality
    // For now, just echo back or provide a simple response

    if (msg.text === '/start') {
      await this.bot.sendMessage(
        chatId,
        `¡Hola! Estás verificado con el email: ${verification.email}\n\nBienvenido al bot. Aquí puedes interactuar con nuestros servicios.`
      )
      return
    }

    // Echo for now (replace with actual bot logic)
    await this.bot.sendMessage(
      chatId,
      `Mensaje recibido: ${msg.text || '(sin texto)'}\n\n(Aquí iría la lógica del bot para usuarios verificados)`
    )
  }

  async sendMessage (chatId, text) {
    if (!this.bot) {
      console.warn('Cannot send message: bot not initialized')
      return
    }
    await this.bot.sendMessage(chatId, text)
  }
}

module.exports = CustomerTelegramBotService
