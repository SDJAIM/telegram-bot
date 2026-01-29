const sequelizeDb = require('../../models/sequelize')
const Customer = sequelizeDb.Customer

exports.create = async (req, res, next) => {
  try {
    const data = await Customer.create(req.body)
    data.dataValues.botId = req.body.botId
    req.redisClient.publish('new-customer', JSON.stringify(data))

    res.status(200).send(data)
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      err.statusCode = 422
    }
    next(err)
  }
}
