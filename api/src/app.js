const express = require('express')
const app = express()
const router = require('./routes')

app.use(express.json({ limit: '10mb', extended: true }))
app.use('/api', router)

module.exports = app
