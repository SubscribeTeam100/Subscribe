const {model, Schema} = require('mongoose')
const addressSchema = new Schema({
    name: String,
        Address1: String,
        Address2: String,
        city: String,
        state: String,
        country: String,
        zip: String,
        phone: String,
        email: String, 
        createdAt: String,
        userID: String
})

module.exports = model('Address', addressSchema)