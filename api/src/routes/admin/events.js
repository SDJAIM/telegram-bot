'use strict'
const express = require('express')
const router = express.Router()
const eventController = require('../../controllers/admin/event-controller')
const { validateAdmin } = require('../../middlewares/user-tracking')

router.get('/', validateAdmin, eventController.list)
router.post('/', validateAdmin, eventController.create)
router.get('/:id', validateAdmin, eventController.show)
router.put('/:id', validateAdmin, eventController.update)
router.delete('/:id', validateAdmin, eventController.delete)

module.exports = router
