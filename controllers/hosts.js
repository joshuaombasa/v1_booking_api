const Host = require('../models/host')
const hostRouter = require('express').Router()
const bcrypt = require('bcrypt')


hostRouter.get('/', async (request, response, next) => {
    try {
        const hosts = await Host.find({})
        response.json(hosts)
    } catch (error) {
        next(error)
    }
})

hostRouter.get('/:id', async (request, response, next) => {
    try {
        const host = await Host.findById(request.params.id)
        if (!host) {
            return response.status(404).end()
        }
        response.json(host)
    } catch (error) {
        next(error)
    }
})

hostRouter.post('/', async (request, response, next) => {
    const { username, name, password } = request.body
    const saltrounds = 10
    const passwordHash = bcrypt.hash(password,10)
    const host = new Host({
        username,
        name,
        passwordHash
    })
    try {
        const savedHost = await host.save()
        response.status(201).json(savedHost)
    } catch (error) {
        next(error)
    }
})

hostRouter.put('/:id', async (request, response, next) => {
    const { username, name, password } = request.body
    const host = {
        username,
        name,
        password
    }
    try {
        const updatedHost = await Host.findByIdAndUpdate(
            request.params.id,
            host,
            {new:true}
        )
        response.status(200).json(updatedHost)
    } catch (error) {
        next(error)
    }
})

hostRouter.delete('/:id', async (request, response, next) => {
    try {
        await Host.findByIdAndDelete(request.params.id)
        response.status(204).end()
    } catch (error) {
        next(error)
    }
})

module.exports = hostRouter