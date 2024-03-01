const mongoose = require('mongoose')

const hotelSchema = new mongoose.Schema({
    name : {type: String, required: true},
    location : {type: String, required: true},
    price : {type: String, required: true},
    Owner : {type: mongoose.Schema.Types.ObjectId, ref: 'Host'},
})

hotelSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Hotel', hotelSchema)