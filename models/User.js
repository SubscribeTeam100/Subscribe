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
const sellerSchema = new Schema({
    subscriptions: [String],
    payment_history:[{
        payment_date: String,
        payment_amount: String,
        payment_process: String,

    }],
    payment_method:[String],
    
    products: [String],
    rating: [String],
    subscription_record:[{
        month: String,
        subscribers: Number,
        active: Number,
        paused: Number,
        cancelled: Number,
    }]

})
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
    seller:[sellerSchema]
})
module.exports = model ('User', userSchema)