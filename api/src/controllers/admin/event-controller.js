'use strict'
const Event = require('../../models/sequelize/event')
const { validationError, notFoundError } = require('../../middlewares/error-handler')

module.exports = {
  async list (req, res) {
    try {
      const events = await Event.findAll({
        paranoid: false,
        order: [['createdAt', 'DESC']]
      })
      res.json(events)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async create (req, res) {
    try {
      const event = await Event.create(req.body)
      res.status(201).json(event)
    } catch (error) {
      validationError(error, req, res)
    }
  },

  async show (req, res) {
    try {
      const event = await Event.findByPk(req.params.id, { paranoid: false })
      if (!event) return notFoundError('Event not found', req, res)
      res.json(event)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async update (req, res) {
    try {
      const event = await Event.findByPk(req.params.id)
      if (!event) return notFoundError('Event not found', req, res)

      await event.update(req.body)
      res.json(event)
    } catch (error) {
      validationError(error, req, res)
    }
  },

  async delete (req, res) {
    try {
      const event = await Event.findByPk(req.params.id)
      if (!event) return notFoundError('Event not found', req, res)

      await event.destroy()
      res.status(204).end()
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }
}
