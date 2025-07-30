const Town = require('../../models/sequelize/town')
const { successResponse, errorResponse } = require('../../middlewares/error-handler')

exports.create = async (req, res) => {
  try {
    const town = await Town.create(req.body)
    return successResponse(res, town)
  } catch (error) {
    return errorResponse(res, error)
  }
}

exports.read = async (req, res) => {
  try {
    const town = await Town.findByPk(req.params.id)
    return successResponse(res, town)
  } catch (error) {
    return errorResponse(res, error)
  }
}

exports.update = async (req, res) => {
  try {
    const town = await Town.update(req.body, {
      where: { id: req.params.id }
    })
    return successResponse(res, town)
  } catch (error) {
    return errorResponse(res, error)
  }
}

exports.delete = async (req, res) => {
  try {
    await Town.destroy({
      where: { id: req.params.id }
    })
    return successResponse(res, { message: 'Town deleted successfully' })
  } catch (error) {
    return errorResponse(res, error)
  }
}

exports.list = async (req, res) => {
  try {
    const towns = await Town.findAll()
    return successResponse(res, towns)
  } catch (error) {
    return errorResponse(res, error)
  }
}
