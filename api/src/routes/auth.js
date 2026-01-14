const express = require('express')
const router = express.Router()
const controller = require('../controllers/auth/auth-controller.js')
const { verifyToken } = require('../middlewares/auth.js')

router.post('/register', controller.register)
router.get('/activate/:token', controller.activate)
router.post('/login', controller.login)
router.post('/forgot-password', controller.forgotPassword)
router.post('/reset-password/:token', controller.resetPassword)
router.get('/me', verifyToken, controller.me)

module.exports = router
