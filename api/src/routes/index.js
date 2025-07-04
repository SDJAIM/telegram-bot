const express = require('express')
const router = express.Router()

router.use('/admin/users', require('./admin/users'))
router.use('/admin/customers', require('./admin/customers'))
router.use('/admin/faqs', require('./admin/faqs'))
// router.use('/admin/bots', require('./admin/bots'))
router.use('/admin/event-categories', require('./admin/event-categories'))
router.use('/admin/promoters', require('./admin/promoters'))

module.exports = router
