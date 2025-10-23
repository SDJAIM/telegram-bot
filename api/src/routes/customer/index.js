const express = require('express')
const { heroes } = require('./heroes.js')
const { faqs } = require('./faqs.js')
const { chat } = require('../controllers/customer/ai-chat-controller.js')
const search = require('./search.js')

const router = express.Router()

router.use('/heroes', heroes)
router.use('/faqs', faqs)
router.post('/chat', chat)
router.use('/search', search)

module.exports = router
