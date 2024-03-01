const mongoose = require('mongoose')
const app = require('../app')
const supertest = require('supertest')
const Hotel = require('../models/hotel')
const helper = require('./test_helper')
const api = supertest(app)

beforeEach(async () => {
    await Hotel.deleteMany({})
    for (let hotel of helper.someHotels) {
        const hotelObject = new Hotel(hotel)
        await hotelObject.save()
    }

})

describe('when there are initially some hotels saved', () => {
    test('hotels are returned as json', async () => {
        await api.get('/api/hotels')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all hotels are returned', async () => {
        const response = await api.get('/api/hotels')
            .expect(200)
            .expect('Content-Type', /application\/json/)
        expect(response.body).toHaveLength(helper.someHotels.length)
    })

    test('a specific hotel is within the returned hotels', async () => {
        const response = await api.get('/api/hotels')
            .expect(200)
            .expect('Content-Type', /application\/json/)
        const names = response.body.map(r => r.name)
        expect(names).toContain(helper.someHotels[0].name)
    })
})

describe('viewing a specific boat', () => {
    test('is successful with a valid id', async () => {
        const hotelsAtStart = await helper.hotelsInDB()
        const response = await api.get(`/api/hotels/${hotelsAtStart[0].id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        expect(response.body).toEqual(hotelsAtStart[0])
    })

    test('fails with 404 if id does not exist', async () => {
        const nonExistentId = await helper.nonExistentId()
        await api.get(`/api/hotels/${nonExistentId}`)
            .expect(404)
    })

    test('fails with 400 if id is invalid', async () => {
        const inavlidId = 'f24f3gv35'
        await api.get(`/api/hotels/${inavlidId}`)
            .expect(400)
    })
})

describe('addition of a new boat', () => {
    test('succeeds with valid data', async () => {
        const hotelsAtStart = await helper.hotelsInDB()
        const boatData = {
            name: 'Sea Scar',
            location: 'Westlands, Nairobi',
            price: '500'
        }
        await api.post('/api/hotels')
            .send(boatData)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        const hotelsAtEnd = await helper.hotelsInDB()
        const names = hotelsAtEnd.map(h => h.name)
        expect(names).toContain(boatData.name)
        expect(hotelsAtEnd).toHaveLength(hotelsAtStart.length + 1)
    })

    test('fails with status code 400 if data is invalid', async () => {
        const hotelsAtStart = await helper.hotelsInDB()
        const boatData = {
            location: 'Karen, Nairobi',
            price: '5000'
        }
        await api.post('/api/hotels')
            .send(boatData)
            .expect(400)
        const hotelsAtEnd = await helper.hotelsInDB()
        const names = hotelsAtEnd.map(h => h.name)
        expect(names).not.toContain(boatData.name)
        expect(hotelsAtEnd).toHaveLength(hotelsAtStart.length)
    })
})

describe('deletion of a boat', () => {
    test('succeeds with status code 204 if id is valid', async() => {
        const hotelsAtStart = await helper.hotelsInDB()
        await api.delete(`/api/hotels/${hotelsAtStart[0].id}`)
                 .expect(204)
        const hotelsAtEnd = await helper.hotelsInDB()
        const names = hotelsAtEnd.map(h => h.name)
        expect(names).not.toContain(hotelsAtStart[0].name)
        expect(hotelsAtEnd).toHaveLength(hotelsAtStart.length - 1)
    })
})

afterAll(async () => {
    mongoose.connection.close()
})