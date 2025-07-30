const sequelizeDb = require('../../models/sequelize')
const mongooseDb = require('../../models/mongoose')
const UserSequelize = sequelizeDb.User
const UserMongoose = mongooseDb.User
const Op = sequelizeDb.Sequelize.Op

// Helper to determine which DB to use
const getActiveUserModel = () => {
  return process.env.DB_TYPE === 'mongodb' ? UserMongoose : UserSequelize
}

exports.create = async (req, res, next) => {
  try {
    const User = getActiveUserModel()
    const data = await User.create(req.body)
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
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.size) || 10
    const offset = (page - 1) * limit
    const whereStatement = {}

    for (const key in req.query) {
      if (req.query[key] !== '' && req.query[key] !== 'null' && key !== 'page' && key !== 'size') {
        whereStatement[key] = { [Op.substring]: req.query[key] }
      }
    }

    const condition = Object.keys(whereStatement).length > 0
      ? { [Op.and]: [whereStatement] }
      : {}

    const User = getActiveUserModel()

    if (process.env.DB_TYPE === 'mongodb') {
      const query = {}
      for (const key in req.query) {
        if (req.query[key] !== '' && req.query[key] !== 'null' && key !== 'page' && key !== 'size') {
          query[key] = new RegExp(req.query[key], 'i')
        }
      }

      const [data, total] = await Promise.all([
        User.find(query)
          .skip(offset)
          .limit(limit)
          .sort({ createdAt: -1 })
          .select('_id name email createdAt updatedAt'),
        User.countDocuments(query)
      ])

      return res.status(200).send({
        rows: data,
        count: total,
        meta: {
          total,
          pages: Math.ceil(total / limit),
          currentPage: page,
          size: limit
        }
      })
    }

    const result = await User.findAndCountAll({
      where: condition,
      attributes: ['id', 'name', 'email', 'createdAt', 'updatedAt'],
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
    const User = getActiveUserModel()
    const data = process.env.DB_TYPE === 'mongodb'
      ? await User.findById(id)
      : await User.findByPk(id)

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
    const User = getActiveUserModel()
    let numberRowsAffected
    if (process.env.DB_TYPE === 'mongodb') {
      const result = await User.updateOne({ _id: id }, req.body)
      numberRowsAffected = result.modifiedCount
    } else {
      const [result] = await User.update(req.body, { where: { id } })
      numberRowsAffected = result
    }

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
    const User = getActiveUserModel()
    let numberRowsAffected
    if (process.env.DB_TYPE === 'mongodb') {
      const result = await User.deleteOne({ _id: id })
      numberRowsAffected = result.deletedCount
    } else {
      numberRowsAffected = await User.destroy({ where: { id } })
    }

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
