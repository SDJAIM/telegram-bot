import express from 'express'
import { heroes } from './heroes.js'
import { faqs } from './faqs.js'
import { chat } from '../controllers/customer/ai-chat-controller.js'

const router = express.Router()

router.use('/heroes', heroes)
router.use('/faqs', faqs)
router.post('/chat', chat)

export default router
