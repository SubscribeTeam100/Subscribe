const {model, Schema} = require('mongoose')

const subscriptionSchema = new Schema({
    createdAt: String,
    addressID: String,
    frequency: String,
    paymentID: String,
    userID: String,
    sellerID: String,
    productID: String,
    isActive: Boolean
})
module.exports = model ('Subscription', subscriptionSchema)