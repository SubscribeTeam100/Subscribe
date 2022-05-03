const {model, Schema} = require('mongoose')
const suggestionsSchema = new Schema({
    title: String,
    userID:String,
    content:String,
    branch:String
    
})

module.exports = model('Suggestion', suggestionsSchema)