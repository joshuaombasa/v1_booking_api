const mongoose = require('mongoose')


const hostSchema = new mongoose.Schema({
    username: {type: String, required: true},
    name: {type: String, required: true},
    passwordHash: {type: String, required: true},
    hotels: [{type:mongoose.Schema.Types.ObjectId, ref: 'Hotel'}]
})

hostSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
})

module.exports = mongoose.model('Host', hostSchema)