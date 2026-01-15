const express = require('express')
const router = express.Router()
const controller = require('../controllers/auth/customer-auth-controller.js')
const { verifyCustomerToken } = require('../middlewares/auth.js')

router.post('/register', controller.register)
router.get('/activate/:token', controller.activate)
router.post('/login', controller.login)
router.post('/forgot-password', controller.forgotPassword)
router.post('/reset-password/:token', controller.resetPassword)
router.get('/me', verifyCustomerToken, controller.me)

module.exports = router
