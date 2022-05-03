const Suggestion = require('../../models/Suggestion')
const authHeader = require('../validator/auth-user')

module.exports = {
    Mutation: {
        async newSuggestion_Seller(_,{title, content}, context){
            let user = authHeader(context)
            if (user){
                let suggestion = new Suggestion({
                    title,
                    content,
                    branch : 'Seller',
                    userID: user.id
                })
                await suggestion.save();
                return 'Thank you for your suggestion!'
            }else throw new Error("User not signed in", {errors:{general:"User not signed in"}})
        }
    }
}