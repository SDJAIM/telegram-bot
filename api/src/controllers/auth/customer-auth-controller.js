const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const sequelizeDb = require('../../models/sequelize')
const EmailService = require('../../services/email-service')

const Customer = sequelizeDb.Customer
const CustomerCredential = sequelizeDb.CustomerCredential
const CustomerActivationToken = sequelizeDb.CustomerActivationToken
const CustomerResetPasswordToken = sequelizeDb.CustomerResetPasswordToken
const BotVerification = sequelizeDb.BotVerification

const SALT_ROUNDS = 10
const JWT_EXPIRATION = '24h'
const ACTIVATION_TOKEN_EXPIRATION_HOURS = 24
const RESET_TOKEN_EXPIRATION_HOURS = 1

const generateToken = () => crypto.randomBytes(32).toString('hex')

// Generate a secure 6-digit verification code (000000-999999)
const generateVerificationCode = () => {
  const code = crypto.randomInt(0, 1000000)
  return code.toString().padStart(6, '0')
}

exports.register = async (req, res, next) => {
  const transaction = await sequelizeDb.sequelize.transaction()

  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      const err = new Error('Todos los campos son obligatorios')
      err.statusCode = 422
      throw err
    }

    if (password.length < 8) {
      const err = new Error('La contraseña debe tener al menos 8 caracteres')
      err.statusCode = 422
      throw err
    }

    const existingCredential = await CustomerCredential.findOne({
      where: { email },
      transaction
    })

    if (existingCredential) {
      const err = new Error('El email ya está registrado')
      err.statusCode = 409
      throw err
    }

    const customer = await Customer.create({ name, email }, { transaction })

    // El password se hasheará automáticamente por el hook beforeCreate del modelo
    await CustomerCredential.create({
      customerId: customer.id,
      email,
      password,
      lastPasswordChange: new Date()
    }, { transaction })

    const activationToken = generateToken()
    const expirationDate = new Date()
    expirationDate.setHours(expirationDate.getHours() + ACTIVATION_TOKEN_EXPIRATION_HOURS)

    await CustomerActivationToken.create({
      customerId: customer.id,
      token: activationToken,
      expiresAt: expirationDate,
      used: false
    }, { transaction })

    await transaction.commit()

    // Generate 6-digit verification code for Telegram bot
    const verificationCode = generateVerificationCode()

    try {
      await BotVerification.create({
        email: customer.email,
        verificationCode,
        telegramUserId: null
      })
    } catch (botVerErr) {
      console.error('Error creando verificacion de bot:', botVerErr)
      // Continue even if bot verification creation fails
    }

    // Get bot name from environment or use default
    const botName = process.env.TELEGRAM_CUSTOMER_BOT_NAME || 'ChatBot'

    try {
      const emailService = new EmailService(process.env.EMAIL_TYPE || 'smtp')
      emailService.sendEmail(
        { id: customer.id, email: customer.email, language: 'es' },
        'customer',
        'activationTelegramBot',
        {
          activationToken,
          userName: customer.name,
          email: customer.email,
          verificationCode,
          botName
        }
      )
    } catch (emailErr) {
      console.error('Error enviando email de activacion:', emailErr)
    }

    res.status(201).json({
      message: 'Usuario registrado correctamente. Revisa tu email para activar la cuenta.',
      customerId: customer.id
    })
  } catch (err) {
    await transaction.rollback()

    if (err.name === 'SequelizeValidationError') {
      err.statusCode = 422
      err.message = err.errors.map(e => ({ path: e.path, message: e.message }))
    }

    next(err)
  }
}

exports.activate = async (req, res, next) => {
  try {
    const { token } = req.params

    const activationToken = await CustomerActivationToken.findOne({
      where: { token, used: false },
      include: [{ model: Customer, as: 'customer' }]
    })

    if (!activationToken) {
      const err = new Error('Token de activación inválido o ya utilizado')
      err.statusCode = 400
      throw err
    }

    if (new Date() > activationToken.expiresAt) {
      const err = new Error('El token de activación ha expirado')
      err.statusCode = 400
      throw err
    }

    await activationToken.update({ used: true })

    res.status(200).json({
      message: 'Cuenta activada correctamente. Ya puedes iniciar sesión.'
    })
  } catch (err) {
    next(err)
  }
}

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      const err = new Error('Email y contraseña son obligatorios')
      err.statusCode = 422
      throw err
    }

    const credential = await CustomerCredential.findOne({
      where: { email },
      include: [{ model: Customer, as: 'customer' }]
    })

    // No revelar si el email existe o no
    if (!credential) {
      const err = new Error('Correo o contraseña inválidos')
      err.statusCode = 401
      throw err
    }

    const hasActiveToken = await CustomerActivationToken.findOne({
      where: { customerId: credential.customerId, used: true }
    })

    // No revelar que la cuenta existe pero no está activada (seguridad)
    if (!hasActiveToken) {
      const err = new Error('Correo o contraseña inválidos')
      err.statusCode = 401
      throw err
    }

    const isValidPassword = await bcrypt.compare(password, credential.password)

    if (!isValidPassword) {
      const err = new Error('Correo o contraseña inválidos')
      err.statusCode = 401
      throw err
    }

    const tokenPayload = {
      customerId: credential.customer.id,
      email: credential.email,
      name: credential.customer.name
    }

    const accessToken = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: JWT_EXPIRATION
    })

    res.status(200).json({
      message: 'Login exitoso',
      token: accessToken,
      user: {
        id: credential.customer.id,
        name: credential.customer.name,
        email: credential.email,
        createdAt: credential.customer.createdAt
      }
    })
  } catch (err) {
    next(err)
  }
}

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body

    if (!email) {
      const err = new Error('El email es obligatorio')
      err.statusCode = 422
      throw err
    }

    const credential = await CustomerCredential.findOne({
      where: { email },
      include: [{ model: Customer, as: 'customer' }]
    })

    if (!credential) {
      return res.status(200).json({
        message: 'Si el email existe, recibirás un enlace para restablecer tu contraseña.'
      })
    }

    const resetToken = generateToken()
    const expirationDate = new Date()
    expirationDate.setHours(expirationDate.getHours() + RESET_TOKEN_EXPIRATION_HOURS)

    await CustomerResetPasswordToken.create({
      customerId: credential.customerId,
      token: resetToken,
      expiresAt: expirationDate,
      used: false
    })

    try {
      const emailService = new EmailService(process.env.EMAIL_TYPE || 'smtp')
      emailService.sendEmail(
        { id: credential.customer.id, email: credential.email, language: 'es' },
        'customer',
        'resetPassword',
        { resetToken, userName: credential.customer.name }
      )
    } catch (emailErr) {
      console.error('Error enviando email de reset:', emailErr)
    }

    res.status(200).json({
      message: 'Si el email existe, recibirás un enlace para restablecer tu contraseña.'
    })
  } catch (err) {
    next(err)
  }
}

exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params
    const { password } = req.body

    if (!password) {
      const err = new Error('La nueva contraseña es obligatoria')
      err.statusCode = 422
      throw err
    }

    if (password.length < 8) {
      const err = new Error('La contraseña debe tener al menos 8 caracteres')
      err.statusCode = 422
      throw err
    }

    const resetToken = await CustomerResetPasswordToken.findOne({
      where: { token, used: false }
    })

    if (!resetToken) {
      const err = new Error('Token inválido o ya utilizado')
      err.statusCode = 400
      throw err
    }

    if (new Date() > resetToken.expiresAt) {
      const err = new Error('El token ha expirado')
      err.statusCode = 400
      throw err
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    await CustomerCredential.update(
      { password: hashedPassword, lastPasswordChange: new Date() },
      { where: { customerId: resetToken.customerId } }
    )

    await resetToken.update({ used: true })

    res.status(200).json({
      message: 'Contraseña actualizada correctamente. Ya puedes iniciar sesión.'
    })
  } catch (err) {
    next(err)
  }
}

exports.me = async (req, res, next) => {
  try {
    const customer = await Customer.findByPk(req.customer.id, {
      attributes: ['id', 'name', 'email', 'createdAt']
    })

    if (!customer) {
      const err = new Error('Usuario no encontrado')
      err.statusCode = 404
      throw err
    }

    res.status(200).json(customer)
  } catch (err) {
    next(err)
  }
}
