const { PromoterSpot } = require('../../models/sequelize')

module.exports = {
  async create (req, res) {
    try {
      const record = await PromoterSpot.create(req.body)
      return res.status(201).json(record)
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  },

  async findAll (req, res) {
    try {
      const { page = 1, limit = 10 } = req.query
      const offset = (page - 1) * limit

      const records = await PromoterSpot.findAndCountAll({
        limit,
        offset,
        order: [['createdAt', 'DESC']]
      })
      return res.json(records)
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  },

  async findOne (req, res) {
    try {
      const record = await PromoterSpot.findByPk(req.params.id)
      if (!record) {
        return res.status(404).json({ error: 'Record not found' })
      }
      return res.json(record)
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  },

  async update (req, res) {
    try {
      const [updated] = await PromoterSpot.update(req.body, {
        where: { id: req.params.id }
      })
      if (!updated) {
        return res.status(404).json({ error: 'Record not found' })
      }
      const updatedRecord = await PromoterSpot.findByPk(req.params.id)
      return res.json(updatedRecord)
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  },

  async delete (req, res) {
    try {
      const deleted = await PromoterSpot.destroy({
        where: { id: req.params.id }
      })
      if (!deleted) {
        return res.status(404).json({ error: 'Record not found' })
      }
      return res.status(204).json()
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  }
}
