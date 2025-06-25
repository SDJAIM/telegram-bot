const sequelizeDb = require('../../models/sequelize')
const User = sequelizeDb.User

exports.findAll = async (req, res, next) => {
  try {
    const result = await User.findAll({
      attributes: ['id', 'name', 'email'],
      order: [['createdAt', 'DESC']]
    })

    res.status(200).send(result)
  } catch (err) {
    next(err)
  }
}

exports.findOne = async (req, res, next) => {
  try {
    const id = req.params.id
    const data = await User.findByPk(id)

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
