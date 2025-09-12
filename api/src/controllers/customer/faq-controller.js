const mongooseDb = require('../../models/mongoose')
const Faq = mongooseDb.Faq

exports.findAll = async (req, res, next) => {
  try {
    const whereStatement = {}
    whereStatement.deletedAt = { $exists: false }

    const response = await Faq.find(whereStatement)
      .sort({ createdAt: -1 })
      .lean()
      .exec()

    res.status(200).send(response)
  } catch (err) {
    next(err)
  }
}
