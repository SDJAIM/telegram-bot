const express = require('express')
const router = express.Router()

router.use('/admin/users', require('./admin/users'))
router.use('/admin/customers', require('./admin/customers'))
router.use('/admin/bots', require('./admin/bots'))
router.use('/admin/faqs', require('./admin/faqs'))
router.use('/admin/customer-bot-chats', require('./admin/customer-bot-chats'))
router.use('/admin/customer-bots', require('./admin/customer-bots'))
router.use('/admin/customer-events', require('./admin/customer-events'))
router.use('/admin/emails', require('./admin/emails'))
router.use('/admin/languages', require('./admin/languages'))
router.use('/customer/customers', require('./customer/customer'))

router.use('/auth', require('./auth/auth-activates'))
router.use('/auth/user', require('./auth/auth-users'))
router.use('/auth/customer', require('./auth/auth-customers'))

module.exports = router
