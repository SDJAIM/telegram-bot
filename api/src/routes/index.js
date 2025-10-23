const express = require('express')
const router = express.Router()

router.use('/admin/users', require('./admin/users'))
router.use('/admin/customers', require('./admin/customers'))
router.use('/admin/faqs', require('./admin/faqs'))
router.use('/admin/heroes', require('./admin/heroes'))
router.use('/admin/languages', require('./admin/languages'))
router.use('/admin/towns', require('./admin/towns'))

router.use('/customer/faqs', require('./customer/faqs'))
router.use('/customer/heroes', require('./customer/heroes'))
router.use('/customer/chats', require('./customer/chats'))
router.use('/customer/search', require('./customer/search'))

module.exports = router
