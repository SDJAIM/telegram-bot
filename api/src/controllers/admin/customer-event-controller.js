'use strict'
const { CustomerEvent: SequelizeCustomerEvent } = require('../../models/sequelize')
const { CustomerEvent: MongooseCustomerEvent } = require('../../models/mongoose')
const db = require('../../config/config.json').database

const list = async (req, res, next) => {
  try {
    const customerEvents = db === 'mongodb'
      ? await MongooseCustomerEvent.find({ deletedAt: null }).populate('event')
      : await SequelizeCustomerEvent.findAll({ where: { deletedAt: null }, include: ['event'] })
    res.json(customerEvents)
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

    const newCustomerEvent = db === 'mongodb'
      ? await MongooseCustomerEvent.create(data)
      : await SequelizeCustomerEvent.create(data)

    res.status(201).json(newCustomerEvent)
  } catch (error) {
    next(error)
  }
}

const show = async (req, res, next) => {
  try {
    const { id } = req.params
    const customerEvent = db === 'mongodb'
      ? await MongooseCustomerEvent.findById(id).populate('event')
      : await SequelizeCustomerEvent.findByPk(id, { include: ['event'] })

    if (!customerEvent) return res.status(404).json({ error: 'Customer event not found' })
    res.json(customerEvent)
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

    const updatedCustomerEvent = db === 'mongodb'
      ? await MongooseCustomerEvent.findByIdAndUpdate(id, data, { new: true })
      : await SequelizeCustomerEvent.update(data, { where: { id }, returning: true })

    if (!updatedCustomerEvent) return res.status(404).json({ error: 'Customer event not found' })
    res.json(updatedCustomerEvent)
  } catch (error) {
    next(error)
  }
}

const destroy = async (req, res, next) => {
  try {
    const { id } = req.params
    const deleted = db === 'mongodb'
      ? await MongooseCustomerEvent.findByIdAndUpdate(id, { deletedAt: new Date() })
      : await SequelizeCustomerEvent.update({ deletedAt: new Date() }, { where: { id } })

    if (!deleted) return res.status(404).json({ error: 'Customer event not found' })
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
