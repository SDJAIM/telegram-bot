const mongooseDb = require('../../models/mongoose')

const Hero = mongooseDb.Hero

exports.findOne = async (req, res, next) => {
  try {
    const whereStatement = {}
    whereStatement.deletedAt = { $exists: false }
    whereStatement.name = req.params.name

    console.log('whereStatement', whereStatement)

    const response = await Hero.findOne(whereStatement)
      .lean()
      .exec()

    res.status(200).send(response)
  } catch (err) {
    next(err)
  }
}
