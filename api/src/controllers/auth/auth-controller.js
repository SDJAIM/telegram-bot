const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const sequelizeDb = require('../../models/sequelize')
const EmailService = require('../../services/email-service')

const User = sequelizeDb.User
const UserCredential = sequelizeDb.UserCredential
const UserActivationToken = sequelizeDb.UserActivationToken
const UserResetPasswordToken = sequelizeDb.UserResetPasswordToken

const SALT_ROUNDS = 10
const JWT_EXPIRATION = '24h'
const ACTIVATION_TOKEN_EXPIRATION_HOURS = 24
const RESET_TOKEN_EXPIRATION_HOURS = 1

const generateToken = () => crypto.randomBytes(32).toString('hex')

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

    const existingCredential = await UserCredential.findOne({
      where: { email },
      transaction
    })

    if (existingCredential) {
      const err = new Error('El email ya está registrado')
      err.statusCode = 409
      throw err
    }

    const user = await User.create({ name, email }, { transaction })

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    await UserCredential.create({
      userId: user.id,
      email,
      password: hashedPassword,
      lastPasswordChange: new Date()
    }, { transaction })

    const activationToken = generateToken()
    const expirationDate = new Date()
    expirationDate.setHours(expirationDate.getHours() + ACTIVATION_TOKEN_EXPIRATION_HOURS)

    await UserActivationToken.create({
      userId: user.id,
      token: activationToken,
      expirationDate,
      used: false
    }, { transaction })

    await transaction.commit()

    try {
      const emailService = new EmailService(process.env.EMAIL_TYPE || 'smtp')
      emailService.sendEmail(
        { id: user.id, email: user.email, language: 'es' },
        'user',
        'activationUrl',
        { activationToken, userName: user.name }
      )
    } catch (emailErr) {
      console.error('Error enviando email de activacion:', emailErr)
    }

    res.status(201).json({
      message: 'Usuario registrado correctamente. Revisa tu email para activar la cuenta.',
      userId: user.id
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

    const activationToken = await UserActivationToken.findOne({
      where: { token, used: false },
      include: [{ model: User, as: 'user' }]
    })

    if (!activationToken) {
      const err = new Error('Token de activación inválido o ya utilizado')
      err.statusCode = 400
      throw err
    }

    if (new Date() > activationToken.expirationDate) {
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

    const credential = await UserCredential.findOne({
      where: { email },
      include: [{ model: User, as: 'user' }]
    })

    if (!credential) {
      const err = new Error('Credenciales inválidas')
      err.statusCode = 401
      throw err
    }

    const hasActiveToken = await UserActivationToken.findOne({
      where: { userId: credential.userId, used: true }
    })

    if (!hasActiveToken) {
      const err = new Error('Debes activar tu cuenta antes de iniciar sesión')
      err.statusCode = 403
      throw err
    }

    const isValidPassword = await bcrypt.compare(password, credential.password)

    if (!isValidPassword) {
      const err = new Error('Credenciales inválidas')
      err.statusCode = 401
      throw err
    }

    const tokenPayload = {
      userId: credential.user.id,
      email: credential.email,
      name: credential.user.name
    }

    const accessToken = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: JWT_EXPIRATION
    })

    res.status(200).json({
      message: 'Login exitoso',
      token: accessToken,
      user: {
        id: credential.user.id,
        name: credential.user.name,
        email: credential.email
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

    const credential = await UserCredential.findOne({
      where: { email },
      include: [{ model: User, as: 'user' }]
    })

    if (!credential) {
      return res.status(200).json({
        message: 'Si el email existe, recibirás un enlace para restablecer tu contraseña.'
      })
    }

    const resetToken = generateToken()
    const expirationDate = new Date()
    expirationDate.setHours(expirationDate.getHours() + RESET_TOKEN_EXPIRATION_HOURS)

    await UserResetPasswordToken.create({
      userId: credential.userId,
      token: resetToken,
      expirationDate,
      used: false
    })

    try {
      const emailService = new EmailService(process.env.EMAIL_TYPE || 'smtp')
      emailService.sendEmail(
        { id: credential.user.id, email: credential.email, language: 'es' },
        'user',
        'resetPassword',
        { resetToken, userName: credential.user.name }
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

    const resetToken = await UserResetPasswordToken.findOne({
      where: { token, used: false }
    })

    if (!resetToken) {
      const err = new Error('Token inválido o ya utilizado')
      err.statusCode = 400
      throw err
    }

    if (new Date() > resetToken.expirationDate) {
      const err = new Error('El token ha expirado')
      err.statusCode = 400
      throw err
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    await UserCredential.update(
      { password: hashedPassword, lastPasswordChange: new Date() },
      { where: { userId: resetToken.userId } }
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
    res.status(200).json({
      user: req.user
    })
  } catch (err) {
    next(err)
  }
}
