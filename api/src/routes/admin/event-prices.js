'use strict'
const express = require('express')
const router = express.Router()
const controller = require('../../controllers/admin/event-price-controller')

router.get('/', controller.list)
router.post('/', controller.create)
router.get('/:id', controller.show)
router.put('/:id', controller.update)
router.delete('/:id', controller.delete)

module.exports = router
