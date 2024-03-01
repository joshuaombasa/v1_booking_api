const mongoose = require('mongoose')
const Hotel = require('../models/hotel')

const someHotels = [
    {
        name:'Rio',
        location:'Upperhil, Nairobi',
        price: '100'
    },
    {
        name:'Intercontinental',
        location:'Central Business District, Nairobi',
        price: '100'
    },
]

const hotelsInDB = async() => {
    const hotelObjects  = await Hotel.find({})
    const hotelObjectsToSend = hotelObjects.map(hotel => hotel.toJSON())
    return hotelObjectsToSend
}

const nonExistentId = async() => {
    const hotel = new Hotel({
        name:'Blue',
        location:'Ngara, Nairobi',
        price: '300'
    })

    const savedHotel = await hotel.save()
    await Hotel.findByIdAndDelete(savedHotel._id)
    return savedHotel._id.toString()
}

module.exports = {
    someHotels,
    hotelsInDB,
    nonExistentId
}