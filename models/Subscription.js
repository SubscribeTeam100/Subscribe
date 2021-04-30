const {model, Schema} = require('mongoose')

const subscriptionSchema = new Schema({
    createdAt: String,
    addressID: String,
    frequency: String,
    paymentID: String,
    userID: String,
    sellerID: String,
    productID: String,
    isActive: Boolean,
    tracking:[{
        trackingNumber: String,
        carrier: String,
        shippedOn: String,
    }],
    paypal_response:[Object],
    paypal_payment_url: String,
    quantity: Number
})
module.exports = model ('Subscription', subscriptionSchema)