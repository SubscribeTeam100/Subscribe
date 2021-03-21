const {model, Schema} = require('mongoose')
const User = require('./User')

// const reviewSchema = new Schema({
//     title: String,
//     rating: Number,
//     description: String,
//     username: String,
//     userID: String,
//     createdAt: String,
    
// })
const productSchema = new Schema({
    description: String,
    name: String,
    createdAt: String,
    sellerID: String,
    isVisible: Boolean,  
    reviewPoints: Number, 
    reviews: [{
        reviewID: String,
        userID: String,
    }],
    price: String,
    overallRating: Number,
    subscriptions:[String],
    tags: [String]
})

module.exports = model ('Product', productSchema)