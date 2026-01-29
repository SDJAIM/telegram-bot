const sequelizeDb = require('../../models/sequelize')
const SentEmail = sequelizeDb.SentEmail
const Op = sequelizeDb.Sequelize.Op

exports.create = async (req, res, next) => {
  try {
    const data = await SentEmail.create(req.body)
    res.status(201).send(data)
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      err.statusCode = 422
    }
    next(err)
  }
}

exports.findAll = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.size) || 10
    const offset = (page - 1) * limit
    const whereStatement = {}

    // Filter by userType if provided
    if (req.query.userType) {
      whereStatement.userType = req.query.userType
    }

    // Filter by userId if provided
    if (req.query.userId) {
      whereStatement.userId = req.query.userId
    }

    // Filter by emailTemplate if provided
    if (req.query.emailTemplate) {
      whereStatement.emailTemplate = { [Op.substring]: req.query.emailTemplate }
    }

    // Filter by read status if provided
    if (req.query.readed !== undefined) {
      whereStatement.readed = req.query.readed === 'true'
    }

    const result = await SentEmail.findAndCountAll({
      where: whereStatement,
      attributes: ['id', 'userId', 'userType', 'emailTemplate', 'sendAt', 'readed', 'readedAt', 'uuid', 'createdAt', 'updatedAt'],
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    })

    result.meta = {
      total: result.count,
      pages: Math.ceil(result.count / limit),
      currentPage: page,
      size: limit
    }

    res.status(200).send(result)
  } catch (err) {
    next(err)
  }
}

exports.findOne = async (req, res, next) => {
  try {
    const id = req.params.id
    const data = await SentEmail.findByPk(id)

    if (!data) {
      const err = new Error(`Email con id=${id} no encontrado`)
      err.statusCode = 404
      throw err
    }

    res.status(200).send(data)
  } catch (err) {
    next(err)
  }
}

exports.update = async (req, res, next) => {
  try {
    const id = req.params.id
    const [numberRowsAffected] = await SentEmail.update(req.body, { where: { id } })

    if (numberRowsAffected !== 1) {
      const err = new Error(`No se puede actualizar el email con id=${id}. Tal vez no se ha encontrado.`)
      err.statusCode = 404
      throw err
    }

    res.status(200).send({
      message: 'Email actualizado correctamente.'
    })
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      err.statusCode = 422
    }

    next(err)
  }
}

exports.delete = async (req, res, next) => {
  try {
    const id = req.params.id
    const numberRowsAffected = await SentEmail.destroy({ where: { id } })

    if (numberRowsAffected !== 1) {
      const err = new Error(`No se puede borrar el email con id=${id}. Tal vez no se ha encontrado.`)
      err.statusCode = 404
      throw err
    }

    res.status(200).send({
      message: 'Email borrado correctamente.'
    })
  } catch (err) {
    next(err)
  }
}
