const sequelizeDb = require('../../models/sequelize')
const CustomerBotChat = sequelizeDb.CustomerBotChat
const Op = sequelizeDb.Sequelize.Op

exports.getAll = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.size) || 10
    const offset = (page - 1) * limit
    const whereStatement = {}

    // Filter by customerBotId if provided
    if (req.query.customerBotId) {
      whereStatement.customerBotId = req.query.customerBotId
    }

    // Filter by emisor if provided
    if (req.query.emisor) {
      whereStatement.emisor = req.query.emisor
    }

    const result = await CustomerBotChat.findAndCountAll({
      where: whereStatement,
      include: [
        {
          model: sequelizeDb.CustomerBot,
          as: 'customerBot',
          attributes: ['id', 'customerId', 'botId', 'status'],
          include: [
            {
              model: sequelizeDb.Customer,
              as: 'customer',
              attributes: ['id', 'name', 'email']
            },
            {
              model: sequelizeDb.Bot,
              as: 'bot',
              attributes: ['id', 'name', 'platform']
            }
          ]
        }
      ],
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

exports.getOne = async (req, res, next) => {
  try {
    const id = req.params.id
    const data = await CustomerBotChat.findByPk(id, {
      include: [
        {
          model: sequelizeDb.CustomerBot,
          as: 'customerBot',
          include: [
            {
              model: sequelizeDb.Customer,
              as: 'customer',
              attributes: ['id', 'name', 'email']
            },
            {
              model: sequelizeDb.Bot,
              as: 'bot',
              attributes: ['id', 'name', 'platform']
            }
          ]
        }
      ]
    })

    if (!data) {
      const err = new Error('Chat no encontrado')
      err.statusCode = 404
      throw err
    }

    res.status(200).send(data)
  } catch (err) {
    next(err)
  }
}

exports.create = async (req, res, next) => {
  try {
    const data = await CustomerBotChat.create(req.body)
    res.status(201).send(data)
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      err.statusCode = 422
    }
    next(err)
  }
}

exports.update = async (req, res, next) => {
  try {
    const id = req.params.id
    const [numberRowsAffected] = await CustomerBotChat.update(req.body, { where: { id } })

    if (numberRowsAffected !== 1) {
      const err = new Error('Chat no encontrado o no actualizado')
      err.statusCode = 404
      throw err
    }

    res.status(200).send({ message: 'Chat actualizado correctamente' })
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
    const numberRowsAffected = await CustomerBotChat.destroy({ where: { id } })

    if (numberRowsAffected !== 1) {
      const err = new Error('Chat no encontrado')
      err.statusCode = 404
      throw err
    }

    res.status(200).send({ message: 'Chat eliminado correctamente' })
  } catch (err) {
    next(err)
  }
}
