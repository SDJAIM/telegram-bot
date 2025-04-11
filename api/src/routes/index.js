const express = require('express')
const router = express.Router()

const adminUsers = require('./admin/users')
const adminCustomers = require('./admin/customers')
const adminFaqs = require('./admin/faqs')

router.use('/admin/users', adminUsers)
router.use('/admin/customers', adminCustomers)
router.use('/admin/faqs', adminFaqs)

module.exports = router
