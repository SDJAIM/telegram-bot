const Language = require('../../models/mongoose/language')
const { NotFoundError } = require('../../middlewares/error-handler')

const getAllLanguages = async (req, res, next) => {
  try {
    const languages = await Language.find({ deletedAt: null })
    res.json(languages)
  } catch (error) {
    next(error)
  }
}

const getLanguageById = async (req, res, next) => {
  try {
    const language = await Language.findOne({
      _id: req.params.id,
      deletedAt: null
    })
    if (!language) throw new NotFoundError('Language not found')
    res.json(language)
  } catch (error) {
    next(error)
  }
}

const createLanguage = async (req, res, next) => {
  try {
    const language = new Language(req.body)
    await language.save()
    res.status(201).json(language)
  } catch (error) {
    next(error)
  }
}

const updateLanguage = async (req, res, next) => {
  try {
    const language = await Language.findOneAndUpdate(
      { _id: req.params.id, deletedAt: null },
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    )
    if (!language) throw new NotFoundError('Language not found')
    res.json(language)
  } catch (error) {
    next(error)
  }
}

const deleteLanguage = async (req, res, next) => {
  try {
    const language = await Language.findOneAndUpdate(
      { _id: req.params.id, deletedAt: null },
      { deletedAt: Date.now() },
      { new: true }
    )
    if (!language) throw new NotFoundError('Language not found')
    res.json({ message: 'Language deleted successfully' })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAllLanguages,
  getLanguageById,
  createLanguage,
  updateLanguage,
  deleteLanguage
}
