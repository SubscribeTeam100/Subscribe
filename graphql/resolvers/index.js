const productsResolvers = require('./products')
const usersResolvers = require('./users')
const subscriptionsResolvers = require('./subscriptions')


module.exports = {
    Query:{
        ...usersResolvers.Query,
        ...productsResolvers.Query,
        ...subscriptionsResolvers.Query
    },
    Mutation:{
        ...usersResolvers.Mutation,
        ...productsResolvers.Mutation,
        ...subscriptionsResolvers.Mutation,
        
    }
}