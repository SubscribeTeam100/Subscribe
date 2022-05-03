const {model, Schema} = require('mongoose')

// const addressSchema = new Schema({
//     name: String,
//         Address1: String,
//         Address2: String,
//         city: String,
//         state: String,
//         country: String,
//         zip: String,
//         phone: String,
//         email: String, 
//         createdAt: String 

// })

const userSchema = new Schema({
    username: String,
    password: String,
    email: String,
    createdAt: String,
    phone: String,
    isSeller: Boolean,
    addressID:[String],
   
    reviews: [{
        reviewID: String,
        productID: String,
    }],
    subscriptions:[String],
    Cart:[{
        productID: String,
        quantity: Number
    }],
    
})
module.exports = model ('User', userSchema)
