'use strict'
const { EventOccurrence } = require('../../models/sequelize')

module.exports = {
  async list (req, res) {
    try {
      const occurrences = await EventOccurrence.findAll({
        where: { deletedAt: null },
        include: ['event']
      })
      res.json(occurrences)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async create (req, res) {
    try {
      const occurrence = await EventOccurrence.create(req.body)
      res.status(201).json(occurrence)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  async get (req, res) {
    try {
      const occurrence = await EventOccurrence.findByPk(req.params.id, {
        include: ['event']
      })
      if (!occurrence) {
        return res.status(404).json({ error: 'Event occurrence not found' })
      }
      res.json(occurrence)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  async update (req, res) {
    try {
      const occurrence = await EventOccurrence.findByPk(req.params.id)
      if (!occurrence) {
        return res.status(404).json({ error: 'Event occurrence not found' })
      }
      await occurrence.update(req.body)
      res.json(occurrence)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  async delete (req, res) {
    try {
      const occurrence = await EventOccurrence.findByPk(req.params.id)
      if (!occurrence) {
        return res.status(404).json({ error: 'Event occurrence not found' })
      }
      await occurrence.destroy()
      res.status(204).end()
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }
}
