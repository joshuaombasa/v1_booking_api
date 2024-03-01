const Host = require('../models/host')
const loginRouter = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()


loginRouter.post('/', async (request, response, next) => {
    const { username, password } = request.body
    try {
        const host = await Host.findOne({ username })
        const isPasswordCorrect = await bcrypt.compare(password, host.passwordHash)
        if (!(isPasswordCorrect && host)) {
            return response.status(401).json({ error: 'invalid credentials' })
        }
        const hostObjectForToken = {
            username: host.username,
            id: host._id
        }
        const token = jwt.sign(hostObjectForToken, process.env.SECRET, { validFor: 60 * 60 })
        response.status(200).json({ token, username: host.username, name: host.name, })

    } catch (error) {
        next(error)
    }
})

module.exports = loginRouter