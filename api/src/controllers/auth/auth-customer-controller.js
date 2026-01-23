const bcrypt = require('bcryptjs')
const sequelizeDb = require('../../models/sequelize')
const CustomerCredential = sequelizeDb.CustomerCredential
const Customer = sequelizeDb.Customer

exports.signin = async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res.status(400).send({ message: 'Los campos no pueden estar vacios.' })
    }

    if (!/^\S+@\S+\.\S+$/.test(req.body.email)) {
      return res.status(400).send({ message: 'La dirección de correo electrónico no es válida.' })
    }

    const data = await CustomerCredential.findOne({
      where: {
        email: req.body.email,
        deletedAt: null
      }
    })

    if (!data) {
      return res.status(404).send({ message: 'Usuario o contraseña incorrecta' })
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      data.password
    )

    if (!passwordIsValid) {
      return res.status(404).send({
        message: 'Usuario o contraseña incorrecta'
      })
    }

    req.session.customer = { id: data.id, admin: true }

    console.log(req.session)

    res.status(200).send({
      redirection: '/cliente'
    })
  } catch (err) {
    console.log(err)
    res.status(500).send({ message: err.message || 'Algún error ha surgido al recuperar los datos.' })
  }
}

exports.checkSignin = (req, res) => {
  if (req.session.customer) {
    res.status(200).send({
      redirection: '/cliente'
    })
  } else {
    res.status(401).send({
      redirection: '/login'
    })
  }
}

exports.reset = async (req, res) => {
  CustomerCredential.findOne({
    where: {
      email: req.body.email,
      deletedAt: null
    }
  }).then(async data => {
    if (!data) {
      return res.status(404).send({ message: 'Usuario no encontrado' })
    }

    await req.authorizationService.createResetPasswordToken(data.id, 'customer')

    res.status(200).send({ message: 'Se ha enviado un correo electrónico con las instrucciones para restablecer la contraseña.' })
  }).catch(err => {
    console.log(err)
    res.status(500).send({ message: err.message || 'Algún error ha surgido al recuperar los datos.' })
  })
}
exports.logout = (req, res) => {
  if (!req.session) {
    return res.sendStatus(204)
  }

  delete req.session.customer

  req.session.destroy(err => {
    if (err) {
      console.error(err)
      return res.status(500).send({
        message: 'Error cerrando sesión'
      })
    }

    res.clearCookie('connect.sid')
    res.sendStatus(204)
  })
}
exports.profile = async (req, res) => {
  try {
    const credential = await CustomerCredential.findByPk(req.session.customer.id)

    if (!credential) {
      return res.status(404).send({ message: 'Usuario no encontrado' })
    }

    const customer = await Customer.findByPk(credential.customerId)

    res.status(200).send({
      name: customer.name,
      email: customer.email
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: 'Error al obtener perfil' })
  }
}
