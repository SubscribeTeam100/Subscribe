const {model, Schema} = require('mongoose')
const reviewSchema = new Schema({
    title: String,
    rating: Number,
    description: String,
    username: String,
    userID: String,
    createdAt: String,
    productID: String,
    
})

module.exports = model('Review', reviewSchema)