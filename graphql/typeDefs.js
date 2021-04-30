const gql = require("graphql-tag");
const { GraphQLJSON, GraphQLJSONObject } = require('graphql-type-json');
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
    quantity: Int!
   
  }
  input CartItem{
    productID: ID!
    quantity:ID!
  }




# paypal_respnse type defs starts
  type shipping_address{
   
    line1: String
    line2: String
    city: String
    state: String
    postal_code: String
    country_code: String
  }
  type payerinfo{
    email: String
    first_name: String
    last_name: String
    shipping_address: shipping_address

  }
  type payer{
    payment_method: String
    status: String
    payerinfo: payerinfo


  }
  type amount{
    currency: String
    value: String

  }
  type charge_models{
    type: String
    amount: amount

  }
  type payment_definitions{
    type: String
    frequency: String
    amount: amount
    cycles: String
    charge_models:[charge_models]
    
  }
  type merchant_preferences{
    setup_fee:amount
    max_fail_attempts: String
    auto_bill_amount: String

  }
  type plan{
    payment_definitions: [payment_definitions]
    merchant_preferences: merchant_preferences
    currency_code: String

  }
  type links{
    href: String
    rel: String
    mthod: String
  }
  type agreement_details{
    outstanding_balance: amount
    cycles_remaining: String
    cycles_completed: String
    next_billing_date: String
    last_payment_date: String
    last_payment_amount: amount
    failed_payment_count:String


  }
  type paypal_response{
    id: String
    state: String
    description:String
    start_date: String
    payer: payer
    shipping_address: shipping_address
    plan: plan
    links: [links]
    agreement_details: agreement_details
    httpStatusCode: Int
  }

# paypal_response type defs end here



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
    paypal_response: [paypal_response]
    paypal_payment_url: String

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
  type payment_history{
        payment_date: String,
        payment_amount: String,
        payment_process: String,

  }
  type subscription_record{
    month: String,
    subscribers: Int
    active: Int,
    paused: Int
    cancelled: Int

  }

  type seller{
    subscriptions: [String],
    payment_history:[payment_history],
    products: [String],
    rating: [String],
    subscription_record:[subscription_record]
    payment_method:[String]

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
    seller: seller
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
    getSeller(sellerID: ID): User
    getSellerActiveSubscriptions: [Subscription]
    getSellerActiveSubscriptionsProducts: [Product]
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
    addSubscription(subscriptionInput: SubscriptionInput!): String
    activateSubscription(subscriptionID: ID!, paymentToken: String!): String
    deleteSubscription(subscriptionId: ID!): String!
    pauseSubscription(subscriptionId: ID!): String
    resumeSubscription(subscriptionId:ID!): String
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
