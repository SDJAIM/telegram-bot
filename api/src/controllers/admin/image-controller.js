const moment = require('moment')
const mongooseDb = require('../../models/mongoose')
const Image = mongooseDb.Image

exports.create = async (req, res, next) => {
  try {
    const result = await req.imageService.uploadImage(req.files)

    for (const filename of result) {
      await Image.create({ filename })
    }

    res.status(200).send(result)
  } catch (err) {
    next(err)
  }
}

exports.findAll = async (req, res, next) => {
  try {
    const page = req.query.page || 1
    const limit = parseInt(req.query.size) || 10
    const offset = (page - 1) * limit
    const whereStatement = {}
    whereStatement.deletedAt = { $exists: false }

    const result = await Image.find(whereStatement)
      .skip(offset)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean()
      .exec()

    const count = await Image.countDocuments(whereStatement)

    const response = {
      rows: result.map(doc => ({
        ...doc,
        id: doc._id,
        _id: undefined,
        createdAt: moment(doc.createdAt).format('YYYY-MM-DD HH:mm'),
        updatedAt: moment(doc.updatedAt).format('YYYY-MM-DD HH:mm')
      })),
      meta: {
        total: count,
        pages: Math.ceil(count / limit),
        currentPage: page
      }
    }

    res.status(200).send(response)
  } catch (err) {
    next(err)
  }
}

exports.findOne = async (req, res, next) => {
  try {
    const fileName = req.params.filename

    const options = {
      root: __dirname + '../../../storage/images/gallery/thumbnail/',
      dotfiles: 'deny',
      headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
      }
    }

    res.sendFile(fileName, options)
  } catch (err) {
    next(err)
  }
}

exports.delete = async (req, res, next) => {
  try {
    const filename = req.params.filename

    await req.imageService.deleteImages(filename)
    await Image.deleteOne({ filename })

    res.status(200).send({
      message: 'El elemento ha sido borrado correctamente'
    })
  } catch (err) {
    next(err)
  }
}

exports.getImage = async (req, res) => {
  const fileName = req.params.filename

  const options = {
    root: __dirname + '../../../storage/images/resized/',
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  }

  res.sendFile(fileName, options)
}
