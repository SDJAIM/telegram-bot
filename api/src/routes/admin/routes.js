const express = require('express')
const router = express.Router()
const controller = require('../../controllers/admin/route-controller.js')

router.post('/', controller.findAll)

module.exports = router
