const express = require('express')
const router = express.Router()
const controller = require('../../controllers/customer/chat-controller.js')

router.post('/human', controller.relayUserMessage)
router.get('/:threadId', controller.getChat)
router.post('/', controller.assistantResponse)

module.exports = router
