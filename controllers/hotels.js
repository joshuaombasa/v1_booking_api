const Hotel = require('../models/hotel')
const hotelsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
require('dotenv').config()
const Host = require('../models/host')

function getToken(request) {
    const authorization = request.get(`authorization`)
    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ','')
    }

    return null
}

hotelsRouter.get('/', async (request, response, next) => {
    try {
        const hotels = await Hotel.find({})
        response.json(hotels)
    } catch (error) {
        next(error)
    }
})

hotelsRouter.get('/:id', async (request, response, next) => {
    try {
        const hotel = await Hotel.findById(request.params.id)
        if (!hotel) {
           return response.status(404).end()
        }
        response.json(hotel)
    } catch (error) {
        next(error)
    }
})

hotelsRouter.post('/', async (request, response, next) => {
    const {name, location, price} = request.body

    const decoded = jwt.verify(getToken(request), process.env.SECRET)

    if (!decoded.id) {
        return response.status(401).json({error: 'invalid token'})
    }

    const host = await Host.findById(decoded.id)

    const hotel = new Hotel({
        name,
        location,
        price,
        host: decoded.id
    })
    try {
        const savedHotel = await hotel.save()
        host.hotels = host.hotels.concat(decoded.id)
        await host.save()
        response.status(201).json(savedHotel)
    } catch (error) {
        next(error)
    }
})

hotelsRouter.delete('/:id', async (request, response, next) => {
    try {
        await Hotel.findByIdAndDelete(request.params.id)
        response.status(204).end()
    } catch (error) {
        next(error)
    }
})

module.exports = hotelsRouter