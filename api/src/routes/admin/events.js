'use strict'
const express = require('express')
const router = express.Router()
const eventController = require('../../controllers/admin/event-controller')

router.get('/', eventController.list)
router.post('/', eventController.create)
router.get('/:id', eventController.show)
router.put('/:id', eventController.update)
router.delete('/:id', eventController.delete)

module.exports = router
