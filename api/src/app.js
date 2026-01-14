const express = require('express')
const app = express()
const userAgentMiddleware = require('./middlewares/user-agent')
const errorHandlerMiddleware = require('./middlewares/error-handler')
const userTrackingMiddleware = require('./middlewares/user-tracking')
const exposeServiceMiddleware = require('./middlewares/expose-services')
const { createClient } = require('redis')
const redisClient = createClient({ url: process.env.REDIS_URL })
const subscriberClient = createClient({ url: process.env.REDIS_URL })
require('./events')(redisClient, subscriberClient)

app.use((req, res, next) => {
  req.redisClient = redisClient
  next()
})

const router = require('./routes')

app.use(express.json({ limit: '10mb', extended: true }))
app.use(userAgentMiddleware)
app.use(userTrackingMiddleware)
app.use(...Object.values(exposeServiceMiddleware))

app.use('/api', router)

app.use(errorHandlerMiddleware)

module.exports = app
