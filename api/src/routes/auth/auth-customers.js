const express = require('express')
const router = express.Router()
const controller = require('../../controllers/auth/auth-customer-controller.js')

router.post('/signin', controller.signin)
router.post('/reset', controller.reset)
router.get('/check-signin', controller.checkSignin)
router.delete('/logout', controller.logout)
router.get('/profile', controller.profile)

module.exports = router
