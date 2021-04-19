const gql = require("graphql-tag");
const {graphql, GraphQLList} = require("graphql")
module.exports = gql`
  input RegisterInput {
    username: String!
    email: String!
    password: String!
    confirmPassword: String!
    phone: String
  }
  input ProductInput {
    name: String!
    description: String!
    price: String!
    isVisible: Boolean!
    tags: [String]
    ImageLink: [String]
  }

  input ReviewInput {
    title: String
    rating: Int!
    description: String
    productID: ID!
  }

  input AddressInput {
    name: String!
    Address1: String!
    Address2: String
    city: String!
    state: String!
    country: String!
    zip: String!
    phone: String!
    email: String!
  }
  input SettlementInput {
    number: String!
    CVV: String!
    expMonth: String!
    expYear: String!
  }
  input SubscriptionInput {
    productID: String!
    addressID: String!
    frequency: String!
    sellerID: String!
    settlement: SettlementInput
    nextDeliveryscheduledfor: String
  }
  input CartItem{
    productID: ID!
    quantity:ID!
  }

  type UserReviewsInfo {
    reviewID: ID!
    productID: ID!
  }
  type ProductReviewsInfo {
    reviewID: ID!
    userID: ID
  }
  type DeliveryInfo{
    createdAt: String!
    shipped: Boolean
    addressID: ID!
    tracking: String,
    trackingCarrier:String,
    settlementID:String
    scheduledfor: String

  }
  type Address {
    id: ID!
    createdAt: String!
    name: String!
    Address1: String!
    Address2: String
    city: String!
    state: String!
    country: String!
    zip: String!
    phone: String!
    email: String!
  }
  type Subscription {
    id: ID!
    frequency: String!
    settlementID: String
    productID: String!
    sellerID: String!
    addressID: String!
    userID: String!
    createdAt: String!
    isActive: Boolean!
    delivered:[DeliveryInfo]
    nextDelivery: DeliveryInfo
  }

  type Review {
    id: ID!
    title: String
    rating: Int
    description: String
    username: String
    userID: String
    createdAt: String
    productID: String
  }
  type CartItemsInfo {
    productID: String
    quantity: Int
  }

  type User {
    id: ID!
    username: String!
    isSeller: Boolean!
    email: String!
    createdAt: String!
    phone: String!
    token: String!
    addressID: [String]
    reviews: [UserReviewsInfo]
    subscriptions: [String]
    Cart: [CartItemsInfo]
  }

  type Product {
    id: ID!
    description: String!
    createdAt: String!
    name: String!
    sellerID: String!
    isVisible: Boolean!
    reviews: [ProductReviewsInfo]
    reviewPoints: Int
    overallRating: Float
    subscriptions: [String]
    tags: [String]
    ImageLink: [String]
    price: String
  }

  type Query {
    getProducts: [Product]
    getSeller(sellerID: ID!): User
    getSellerSubscriptions: [Subscription]
    getUserSubscriptions: [Subscription]
    getUserReviews: [Review]
    getSellerProducts: [Product]
    getAddress(addressId: ID!, subscriptionId: ID!): Address
    getReview(reviewId: ID): Review
    getProductReviews(productId: ID): [Review]
    getProduct(productId: ID): Product
    getCart: [CartItemsInfo]
    getProductfromCart: [Product]
    getUserAddresses: [Address]
    getSubscriptionProducts: [Product]
    getSubscription(subscriptionId: ID!): Subscription
  }

  type Mutation {
    register(registerInput: RegisterInput!): User!
    login(email: String!, password: String!): User!
    addProduct(productInput: ProductInput!): Product!
    deleteProduct(productId: ID!): String!
    addSubscription(subscriptionInput: SubscriptionInput!): Subscription!
    deleteSubscription(subscriptionId: ID!): String!
    pauseSubscription(subscriptionId: ID!): Subscription
    resumeSubscription(subscriptionId:ID!): Subscription
    # //TODO: pause subscription for a timeframe. Implement it with subscriptionshipped and subscription thingys.
    upgradeToSeller: User!
    addAddress(addressInput: AddressInput!): User!
    deleteAddress(addressId: ID!): String
    # addSettlement(settlementInput:SettlementInput!, addressInput: AddressInput!): User!
    addReview(reviewInput: ReviewInput!): Product!
    deleteReview(reviewId: ID!, productId: ID!): Product!
    addtoCart(productID: ID!): String
    clearCart: String
    deletefromCart(productID: ID!): String
    changeItemsinCart(productID:ID!, quantity: Int!): String
    subscriptionShipped(subscriptionID: ID, tracking: String!, trackingCarrier: String!):Subscription
    
  }
`;
