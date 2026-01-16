const express = require('express')
const router = express.Router()
const controller = require('../../controllers/auth/auth-activate-controller.js')

router.post('/activate', controller.activate)
router.post('/reset', controller.reset)

module.exports = router
