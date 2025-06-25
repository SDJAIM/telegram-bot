const express = require('express')
const router = express.Router()
const controller = require('../../controllers/customer/user-controller.js')

router.get('/', controller.findAll)
router.get('/:id', controller.findOne)

module.exports = router
