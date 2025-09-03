const sequelizeDb = require('../../models/sequelize')
const CustomerEvent = sequelizeDb.CustomerEvent
const Op = sequelizeDb.Sequelize.Op

exports.create = async (req, res, next) => {
  try {
    const data = await CustomerEvent.create(req.body)
    res.status(200).send(data)
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      err.statusCode = 422
    }
    next(err)
  }
}

exports.findAll = async (req, res, next) => {
  try {
    const customerId = req.query.customerId

    const result = await CustomerEvent.findAll({
      where: {
        customerId: {
          [Op.eq]: customerId
        }
      },
      attributes: ['id', 'customerId', 'eventId'],
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: sequelizeDb.Event,
          as: 'event',
          include: [
            {
              model: sequelizeDb.Town,
              as: 'town',
              attributes: ['id', 'name']
            },
            {
              model: sequelizeDb.Promoter,
              as: 'promoter',
              attributes: ['id', 'name']
            }
          ]
        }
      ]
    })

    res.status(200).send(result)
  } catch (err) {
    next(err)
  }
}

exports.findOne = async (req, res, next) => {
  try {
    const id = req.params.id
    const data = await CustomerEvent.findByPk(id)

    if (!data) {
      const err = new Error()
      err.message = `No se puede encontrar el elemento con la id=${id}.`
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
    const [numberRowsAffected] = await CustomerEvent.update(req.body, { where: { id } })

    if (numberRowsAffected !== 1) {
      const err = new Error()
      err.message = `No se puede actualizar el elemento con la id=${id}. Tal vez no se ha encontrado.`
      err.statusCode = 404
      throw err
    }

    res.status(200).send({
      message: 'El elemento ha sido actualizado correctamente.'
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
    const numberRowsAffected = await CustomerEvent.destroy({ where: { id } })

    if (numberRowsAffected !== 1) {
      const err = new Error()
      err.message = `No se puede actualizar el elemento con la id=${id}. Tal vez no se ha encontrado.`
      err.statusCode = 404
      throw err
    }

    res.status(200).send({
      message: 'El elemento ha sido borrado correctamente.'
    })
  } catch (err) {
    next(err)
  }
}
