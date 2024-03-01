require('dotenv').config()
const logger = require('./logger')

const requestLogger= (request,response,next) => {
    logger.info('Method', request.method)
    logger.info('Path', request.path)
    logger.info('Body', request.body)
    logger.info('___')

    next()
}

const unknownEndpointHandler = (request,response) => {
    response.status(400).json({error: 'unknown endpoint'})
}

const errorHandler = (error,request,response, next) => {
    logger.error(error.message)
    if (error.name === 'CastError') {
        response.status(400).json({error: 'invalid id'})
    } else if (error.name === 'ValidationError'){
        response.status(400).json({error: error.message})
    }
    next(error)
}

module.exports = {
    requestLogger,
    unknownEndpointHandler,
    errorHandler
}
