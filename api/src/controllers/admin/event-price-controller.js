'use strict'
const { EventPrice: SequelizeEventPrice } = require('../../models/sequelize')
const { EventPrice: MongooseEventPrice } = require('../../models/mongoose')
const db = require('../../config/config.json').database

const list = async (req, res, next) => {
  try {
    const prices = db === 'mongodb'
      ? await MongooseEventPrice.find({ deletedAt: null }).populate('event')
      : await SequelizeEventPrice.findAll({ where: { deletedAt: null }, include: ['event'] })
    res.json(prices)
  } catch (error) {
    next(error)
  }
}

const create = async (req, res, next) => {
  try {
    const { eventId, description, price } = req.body
    const data = db === 'mongodb'
      ? { event: eventId, description, price }
      : { eventId, description, price }

    const newPrice = db === 'mongodb'
      ? await MongooseEventPrice.create(data)
      : await SequelizeEventPrice.create(data)

    res.status(201).json(newPrice)
  } catch (error) {
    next(error)
  }
}

const show = async (req, res, next) => {
  try {
    const { id } = req.params
    const price = db === 'mongodb'
      ? await MongooseEventPrice.findById(id).populate('event')
      : await SequelizeEventPrice.findByPk(id, { include: ['event'] })

    if (!price) return res.status(404).json({ error: 'Price not found' })
    res.json(price)
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const { id } = req.params
    const { eventId, description, price } = req.body
    const data = db === 'mongodb'
      ? { event: eventId, description, price }
      : { eventId, description, price }

    const updatedPrice = db === 'mongodb'
      ? await MongooseEventPrice.findByIdAndUpdate(id, data, { new: true })
      : await SequelizeEventPrice.update(data, { where: { id }, returning: true })

    if (!updatedPrice) return res.status(404).json({ error: 'Price not found' })
    res.json(updatedPrice)
  } catch (error) {
    next(error)
  }
}

const destroy = async (req, res, next) => {
  try {
    const { id } = req.params
    const deleted = db === 'mongodb'
      ? await MongooseEventPrice.findByIdAndUpdate(id, { deletedAt: new Date() })
      : await SequelizeEventPrice.update({ deletedAt: new Date() }, { where: { id } })

    if (!deleted) return res.status(404).json({ error: 'Price not found' })
    res.status(204).end()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  list,
  create,
  show,
  update,
  destroy
}
