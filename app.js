const mongoose = require('mongoose')
const cors = require('cors')
const express = require('express')

const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')

const hotelsRouter = require('./controllers/hotels')
const hostsRouter = require('./controllers/hosts')
const loginRouter = require('./controllers/login')

const app = express()
app.use(cors())
app.use(express.json())

mongoose.set('strictQuery', false)

mongoose.connect(config.MONGODB_URI)
 .then(() => logger.info('connected to MongoDB'))
 .catch(error => logger.error(error.message))



app.use(middleware.requestLogger)

app.use('/api/hotels', hotelsRouter)
app.use('/api/hosts', hostsRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpointHandler)
app.use(middleware.errorHandler)

module.exports = app