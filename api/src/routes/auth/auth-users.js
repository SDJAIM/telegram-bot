const express = require('express')
const router = express.Router()
const controller = require('../../controllers/auth/auth-user-controller.js')

router.post('/signin', controller.signin)
router.post('/reset', controller.reset)
router.get('/check-signin', controller.checkSignin)

module.exports = router
