const productsResolvers = require('./products')
const usersResolvers = require('./users')
const subscriptionsResolvers = require('./subscriptions')
const sellerResolvers = require('./seller')
const suggestionResolvers = require('./suggestions')

module.exports = {
    Query:{
        ...usersResolvers.Query,
        ...productsResolvers.Query,
        ...subscriptionsResolvers.Query,
        ...sellerResolvers.Query
    },
    Mutation:{
        ...usersResolvers.Mutation,
        ...productsResolvers.Mutation,
        ...subscriptionsResolvers.Mutation,
        ...sellerResolvers.Mutation,
        ...suggestionResolvers.Mutation
        
    }
}