const gql = require('graphql-tag')

module.exports = gql`
    input RegisterInput{
        username: String!
        email: String!
        password: String!
        confirmPassword: String!
        phone: String
    }
    input ProductInput{
        name: String!
        description: String!
        price: String!
        isVisible: Boolean!
        tags: [String]
    }

    input ReviewInput{
        title: String,
        rating: Int!,
        description: String,
        productID: ID!
    }


    input AddressInput{
            name: String!,
            Address1: String!,
            Address2: String!,
            city: String!,
            state: String!,
            country: String!,
            zip: String!,
            phone: String!,
            email: String!,
    }
    input SettlementInput{
       
        number: String!,
        CVV: String!,
        expMonth: String!,
        expYear: String!  
    }
    input SubscriptionInput{
        productID: String!,
        addressID: String!,
        frequency: String!,
        sellerID: String!,
        settlement: SettlementInput,
        
    }

    type UserReviewsInfo{
        reviewID: ID!,
        productID: ID!
    }
    type ProductReviewsInfo{
        reviewID :ID!,
        userID:ID
    }

    type Address{
        id: ID!
        createdAt: String!,
        name: String!,
        Address1: String!,
        Address2: String!,
        city: String!,
        state: String!,
        country: String!,
        zip: String!,
        phone: String!,
        email: String!, 
        
    }
    type Subscription{
        id: ID!
        frequency: String!,
        settlementID: String,
        productID: String!,
        sellerID: String!,
        addressID: String!,
        userID: String!,
        createdAt: String!,
        isActive: Boolean!
    }


    type Review{
        id:ID!,
        title: String,
        rating: Int,
        description: String,
        username: String,
        userID: String,
        createdAt: String,
        productID:String
    }



    type User{
        id: ID!
        username: String!
        isSeller:Boolean!
        email: String!
        createdAt: String!
        phone: String!
        token: String!
        addressID: [String]
       reviews:[UserReviewsInfo]
       subscriptions:[String]
    }
    
    type Product{
        id: ID!
        description: String!
        createdAt:String!
        name: String!
        sellerID: String!
        isVisible: Boolean!
        reviews: [ProductReviewsInfo]
        reviewPoints: Int
        overallRating: Float
        subscriptions:[String],
        tags: [String]
    }

    type Query{
        getProducts: [Product],
        getSellerSubscriptions: [Subscription]
        getUserSubscriptions: [Subscription]
        getUserReviews: [Review]
        getSellerProducts: [Product]
        getAddress(addressId: ID!, subscriptionId: ID!): [Product]
        getReview(reviewId: ID):Review,
        getProductReviews(productId: ID): [Review]
        getProduct(productId:ID): Product
        
    }

    type Mutation{
        register(registerInput: RegisterInput!): User!
        login(email: String!, password: String!): User!
        addProduct(productInput: ProductInput!): Product!, 
        deleteProduct(productId: ID!): String!,
        addSubscription(subscriptionInput: SubscriptionInput!): Subscription!,
        deleteSubscription(subscriptionId: ID!): String!
        pauseSubscription(subscriptionId: ID!): Subscription!
        upgradeToSeller: User!
        addAddress(addressInput:AddressInput!): User!,
        # addSettlement(settlementInput:SettlementInput!, addressInput: AddressInput!): User!
        addReview(reviewInput:ReviewInput!): Product!
        deleteReview(reviewId: ID!, productId: ID!): Product!
        
    }
`