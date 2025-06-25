const express = require('express')
const router = express.Router()

router.use('/admin/users', require('./admin/users'))
router.use('/admin/customers', require('./admin/customers'))
router.use('/admin/faqs', require('./admin/faqs'))
router.use('/customer/users', require('./customer/users'))

module.exports = router
