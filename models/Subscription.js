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
    delivered: [{
        scheduledfor: String,
        shipped: Boolean,
        addressID:String,
        tracking: String,
        trackingCarrier: String,
        settlementID:String
    }],
    nextDelivery:{
        scheduledfor: String,
        shipped: Boolean,
        addressID: String,
        tracking:String,
        trackingCarrier: String,
        settlementID:String
    },
    payment:[{
        
    }]
})
module.exports = model ('Subscription', subscriptionSchema)