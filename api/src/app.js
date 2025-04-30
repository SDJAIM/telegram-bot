const express = require('express')
const app = express()
const userAgentMiddleware = require('./middlewares/user-agent')
const errorHandlerMiddleware = require('./middlewares/error-handler')
const userTrackingMiddleware = require('./middlewares/user-tracking')

const router = require('./routes')

app.use(express.json({ limit: '10mb', extended: true }))
app.use(userAgentMiddleware)
app.use(userTrackingMiddleware)

app.use('/api', router)

app.use(errorHandlerMiddleware)

module.exports = app
