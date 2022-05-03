const {model, Schema} = require('mongoose')

const sellerSchema ={
    subscriptions: [String],
    payment_history:[{
        payment_date: String,
        payment_amount: String,
        payment_process: String,

    }],
    payment_method:[String],
    total_active:Number,
    total_subscribers: Number,
    total_paused: Number,
    total_cancelled: Number,
    products: [String],
    rating: [String],
    subscription_record:[{
        month: Number,
        subscribers: Number,
        active: Number,
        paused: Number,
        cancelled: Number,
    }],
    userID: String,
    PayoutAccount:{
        Bank:String,
        BusinessName:String,
        AccountNumber:String,
        
    }

}

module.exports = model('Seller', sellerSchema)