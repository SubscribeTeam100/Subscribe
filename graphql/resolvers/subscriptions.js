const Subscription = require('../../models/Subscription')
const User = require('../../models/User')
const Address = require('../../models/Address')
const Product = require('../../models/Product')
const Create = require('../../paypal/create')
const Execute = require('../../paypal/execute')
const GET = require('../../paypal/get')
const Cancel = require('../../paypal/cancel')
const Suspend = require('../../paypal/suspend')
const Resume = require('../../paypal/resume')
const Seller = require('../../models/Seller')
//paypal
const authHeader = require('../validator/auth-user');
const { UserInputError } = require('apollo-server')
const e = require('express')
//




// const {KEY} = require('../../config')

module.exports = {
    Query: {

        async getUserSubscriptions(_, { }, context) {
            const user = authHeader(context);
            if (user) {
                const subs = await Subscription.find({ userID: user.id }).sort({ createdAt: -1 })
                return subs;
            }

        },
        async getSubscriptionProducts(_, { }, context) {
            let user = authHeader(context);
            if (user) {
                let user = await User.findById(user.id);
                subscriptions = user.subscriptions;
                subscriptionProducts = []
                for (let i in subscriptions) {
                    currentsub = await Subscription.findById(subscriptions[i]);
                    if (currentsub) {
                        subscriptionProducts.push(currentsub);
                    }
                }
                return subscriptionProducts;

            } else throw new Error('User not logged in', { errors: { general: "User not logged in" } })
        },

        async getSubscription(_, { subscriptionId }, context) {
            let user = authHeader(context);
            if (user) {
                let subscription = await Subscription.findById(subscriptionId);
                if (subscription) {
                    if (subscription.paypal_response.length > 0) {

                        let billingAgreementId = subscription.paypal_response[0].id
                        let billingAgreement = await GET(billingAgreementId).then(data => {
                            return data;
                        })

                        if (billingAgreement.state === 'Active' && subscription.isActive) {
                            if (subscription.userID === user.id) {
                                return subscription
                            } else throw new Error('User not authorized to view this subscription', { errors: { general: "User not authorized to view this subscription" } })

                        } else if (billingAgreement.state !== 'Active' && subscription.isActive) {
                            subscription.isActive = false
                            subscription.paypal_response.pop()
                            subscription.paypal_response.unshift(bilingAgreement)
                            await subscription.save();
                            return subscription
                        } else return subscription

                    } else { return subscription }


                } else throw new Error('Cannot find Subscription', { errors: { general: "Cannot find Subscription" } })
            } else throw new Error('User not logged in', { errors })
        },


    },

    Mutation: {

        async addSubscription(_, { subscriptionInput: { productID, addressID, sellerID, frequency, quantity } }, context) {
            //TODO: add subscription input validator,
            //TODO: bring in addressinput, settlement input, settlement
            //TODO:
            if (frequency.trim() === '') {
                return new UserInputError("Please specify frequency")
            }
            let user = authHeader(context);
            if (user) {

                const newSubscription = new Subscription({

                    productID,
                    sellerID,
                    frequency,
                    addressID,
                    userID: user.id,
                    quantity,
                    isActive: false,
                    createdAt: new Date().toISOString(),

                })
                const res = await newSubscription.save();
                let subscription = res;
                let address = await Address.findById(addressID)
                let product = await Product.findById(productID)

               
                
                
                let data = await Create(product, subscription, address).then(async data => {

                    
                    return data

                })
                res.paypal_payment_url = data
                
                await res.save();

                
                
                if(data === null||data === undefined){
                    subscription = await Subscription.findById(subscription._id)
                    subscription.delete();
                    throw new Error('Error 400 from the server')
                }else{
                    
                    user = await User.findById(user.id);
                    console.log("user is ", user);
                    console.log('product  is ', product );
                    console.log('subscription is ', subscription);
                    //changing user document
                    await user.subscriptions.unshift(
                        res._id
                    )
                    user.Cart = user.Cart.filter(cartItem => cartItem.productID !== productID)
                    await user.save()

                    //changing product document
                    await product.subscriptions.unshift(
                        res._id
                    )
                    if(product.subscription_analytics.total_subscribers===undefined||product.subscription_analytics.total_subscribers===null){
                        product.subscription_analytics.total_subscribers = 1
                    }else product.subscription_analytics.total_subscribers++
                    await product.save()
                   
                    //changing seller document
                    let seller = await Seller.find({ userID: sellerID })
                    console.log("seller is", seller);

                    console.log(seller.subscriprion_record)

                    if (seller) {
                        seller = seller[0]
                        await seller.subscriptions.unshift(res._id)
                        let date = new Date()
                        if (seller.total_subscribers === null || seller.total_subscribers === undefined || !seller.total_subscribers) {
                            seller.total_subscribers = 1;
                            seller.subscription_record.unshift({
                                month: (date.getMonth() + 1),
                                subscribers: 1
                            })
                            

                        } else {
                            seller.total_subscribers++;
                            month = date.getMonth()
                            if (seller.subscription_record[0].month === (month + 1)) {
                                seller.subscription_record[0].subscribers++;
                            } else {
                                seller.subscription_record.unshift({
                                    month: month + 1,
                                    subscribers: 1

                                })
                            }
                        }
                        console.log("seller2 is", seller);
                        await seller.save();
                    

                    }
                    //changed seller document
                        
                   
                    return data

                }
               
            } else throw new Error("Please Log In")

        },
        // async unactivatedSubscription(_,{subscriptionID}, context){
        //     let subscription = await Subscription.findById(subscriptionID)
        //     let seller = await Seller.find({userID: subscription.sellerID})
        //     seller = seller[0]

        //     //updating sellerDocument
        //     if(seller.total_paused ===undefined||seller.total_paused === null){
        //         seller.total_paused = 1
        //     }else seller.total_paused++
        //     let date = new Date()
        //     let month = date.getMonth();
            
        //     if(seller.subscription_record[0].paused === undefined || seller.subscription_record[0].paused === null){
        //         seller.subscription_record[0].paused =1;
        //     }else {
        //         seller.subscription_record[0].paused++;
        //     }
        //     await seller.save()
        //     return('subscription is created but paused.')

           
            
        // },
        async activateSubscription(_, { paymentToken, subscriptionID }, context) {
            let subscription = await Subscription.findById(subscriptionID)
           
                let billingAgreement = await Execute(paymentToken).then(async data => {

                    await subscription.paypal_response.unshift(data);
                    if (data.state === 'Active') { subscription.isActive = true; }

                    await subscription.save();
                    return data
                })
                
                //updating seller document
                let seller = await Seller.find({userID: subscription.sellerID})
                seller = seller[0]

                let date = new Date()

                if(seller.total_active === undefined|| seller.total_active === null){
                    seller.total_active = 1;
                }else seller.total_active++;
                month = date.getMonth()
                if (seller.subscription_record[0].month === (month + 1)) {
                    if(seller.subscription_record[0].active === undefined||seller.subscription_record[0].active == null){
                        seller.subscription_record[0].active = 1;
                    }else seller.subscription_record[0].actve++;
                    
                } else {
                    seller.subscriprion_record.unshift({
                        month: month + 1,
                        active: 1

                    })
                }

                await seller.save()
                
                //changing the product document
                product = await Product.findById(subscription.productID)
                if(product){
                    if(product.subscription_analytics.active_subscribers === undefined|| product.subscription_analytics.active_subscribers === null){
                        product.subscription_analytics.active_subscribers = 1;
                    }else product.subscription_analytics.active_subscribers++;
                await product.save()
                }

                return ('SubscriptionActivated: Billing Agreement id is ' + billingAgreement.id)

            
           

        },

        async deleteSubscription(_, { subscriptionId }, context) {
            let user = authHeader(context);
            if (user) {
                const subscription = await Subscription.findById(subscriptionId);
                if (subscription) {

                    let productID = subscription.productID
                    let product = await Product.findById(productID)
                    let seller = await Seller.find({userID:subscription.sellerID})
                    seller = seller[0]
                    if (subscription.paypal_response.length > 0) {

                        let billingAgreementID = subscription.paypal_response[0].id

                        try {
                            if (subscription.userID === user.id) {
                                let response = await Cancel(billingAgreementID).then(async data => {
                                    return data
                                })

                                if (response.httpStatusCode === 204) {
                                   
                                    //changing user document
                                    let userID = subscription.userID
                                    user = await User.findById(userID)
                                    if (user) {

                                        user.subscriptions = user.subscriptions.filter(subscription => subscription !== subscriptionId)
                                        await user.save()

                                    }


                                   

                                    //changing product document
                                    if (product) {

                                        product.subscriptions = product.subscriptions.filter(subscription => subscription !== subscriptionId)
                                        if(product.subscription_analytics.active_subscribers !== 0 ){
                                            product.subscription_analytics.active_subscribers--
                                        }
                                        if(product.subscription_analytics.cancelled_subscribers === undefined ||product.subscription_analytics.cancelled_subscribers === null){
                                            product.subscription_analytics.cancelled_subscribers  = 1
                                        }else product.subscription_analytics.cancelled_subscribers++
                                        
                                        if(!subscription.isActive){
                                            product.subscription_analytics.paused_subscribers--
                                            
                                        }
                                        await product.save()

 
                                    }

                                    //changing seller document
                                    if(seller){
                                        seller.subscriptions = seller.subscriptions.filter(subscription => subscription !== subscriptionId)
                                        seller.total_active--
                                        if(seller.total_cancelled ===undefined|| seller.total_cancelled === null|| !seller.total_cancelled){
                                            seller.total_cancelled = 1

                                        }else seller.total_cancelled++;
                                        let date = new Date()
                                        let month = date.getMonth();
                                        if(seller.subscription_record[0].month === (month+1)){
                                            if(seller.subscription_record[0].active === undefined|| seller.subscription_record[0].active === null){
                                                seller.subscription_record[0].active = 0;
                                            }else{
                                                seller.subscription_record[0].active--;
                                            }
                                            
                                            if(seller.subscriprion_record[0].cancelled === undefined||seller.subscription_record[0].cancelled === null || !seller.subscription_record[0].cancelled){
                                                seller.subscription_record[0].cancelled = 1;
                                            }else seller.subscription_record[0].cancelled++;
                                        }else{
                                            await seller.subscription_record.unshift({
                                                month : month+1,
                                                cancelled: 1,
                                                active: -1

                                            })
                                        }
                                        await seller.save()

                                        
                                    }
                                    await subscription.delete();
                                    
                                    return 'successfully deleted the subscription and the payment agreement'
                                }
                            } else throw new Error("Subscription from another user cannot be deleted")
                        } catch (err) {

                            throw new Error(err)
                        }

                    } else {
                        await subscription.delete()
                        
                        return "deleted subscription. Paypal wasn't authorized yet."
                    }



                } throw new Error("Subscription not found")
            }
        },

        async pauseSubscription(_, { subscriptionId }, context) {
            const user = authHeader(context);
            if (user) {
                let sub = await Subscription.findById(subscriptionId);
                if (sub) {

                    if (sub.paypal_response.length > 0) {

                        let billingAgreementId = sub.paypal_response[0].id
                        try {
                            let response = await Suspend(billingAgreementId).then(async data => {
                                return data
                            })
                            if (response.httpStatusCode === 204) {
                                //changing subscription document
                                if (sub.isActive) {
                                    sub.isActive = false;
                                    await sub.save()

                                }
                                let billingAgreement = await GET(billingAgreementId).then(async data => {
                                    return data
                                })
                                await sub.paypal_response.pop()
                                await sub.paypal_response.unshift(billingAgreement)
                                await sub.save()

                                //changing seller document

                                let seller = await Seller.find({userID: sub.sellerID})
                                seller = seller[0]
                                if(seller){
                                    if(seller.total_paused === undefined ||seller.total_paused === null){
                                        seller.total_paused =1;
                                    }else seller.total_paused++;
                                    seller.total_active--;
                                    
                                    let date = new Date()
                                    if(seller.subscription_record[0].month === (date.getMonth()+1)){
                                        if(seller.subscription_record[0].active === null|| seller.subscription_record[0].active === undefined){
                                            seller.subscription_record[0].active=0;
                                            
                                        }else seller.subscription_record[0].active--;
                                        if(seller.subscription_record[0].paused === null || seller.subscription_record[0].paused === undefined){
                                            seller.subscription_record[0].paused = 1
                                        }else seller.subscription_record[0].paused++ 
                                    }else{
                                        seller.subscriprion_record.unshift({
                                            month : (date.getMonth()+1),
                                            active : 0,
                                            paused: 1

                                        })
                                    }
                                    await seller.save()
                                }
                                //changing product document
                                let product = await Product.findById(sub.productID)
                                if(product.subscription_analytics.paused_subscribers === null|| product.subscription_analytics.paused_subscribers  === undefined){
                                    product.subscription_analytics.paused_subscribers = 1
                                }else product.subscription_analytics.paused_subscribers++;
                                product.subscription_analytics.active_subscribers--;
                                await product.save() 


                                return "Successfully paused subscription and paypal"
                            } else if (response === 'paypal agreement is not active to be suspended') {
                                return response;
                            }
                        } catch (err) {
                            console.log(err)
                            throw new Error(err, { errors: { general: "Couldn't suspend paypal agreement" } })
                        }

                    }



                } else throw new Error("Cannot find subscription")
            } else throw new Error("user not logged in")
        },
        async resumeSubscription(_, { subscriptionId }, context) {
            const user = authHeader(context);
            if (user) {
                let sub = await Subscription.findById(subscriptionId);
                if (sub) {
                    if (sub.paypal_response.length > 0) {

                        let billingAgreementId = sub.paypal_response[0].id
                        try {
                            let response = await Resume(billingAgreementId).then(async data => {
                                
                                return data
                            })

                            if (response.httpStatusCode === 204) {
                               
                                //updating subscription document
                                if (!sub.isActive) {
                                    sub.isActive = true;

                                    await sub.save()

                                }
                                let billingAgreement = await GET(billingAgreementId).then(async data => {
                                    return data
                                })
                                await sub.paypal_response.pop()
                                await sub.paypal_response.unshift(billingAgreement)
                                await sub.save()

                                //updating seller document
                                let seller = await Seller.find({userID: sub.sellerID})
                                seller = seller[0]
                                seller.total_active++;
                                seller.total_paused--;
                                
                                let date = new Date()
                                let month = date.getMonth()

                                if(seller.subscription_record[0].month === (month+1)){
                                    if(seller.subscription_record[0].active === undefined || seller.subscription_record[0].active === null){
                                        seller.subscription_record[0].active = 1;
                                    }else seller.subscription_record[0].active++;
                                    if(seller.subscription_record[0].paused === undefined || seller.subscription_record[0].paused === null){
                                        seller.subscription_record[0].paused = 0;
                                    }else seller.subscription_record[0].paused--;
                                    
                                }else{
                                    seller.subscription_record.unshift({
                                        month: month+1,
                                        active: 1,
                                        paused:0,

                                    })
                                }
                                await seller.save()

                                //updating product document
                                let product = await Product.findById(sub.productID)
                                if(product){
                                    product.subscription_analytics.active_subscribers++;
                                    product.subscription_analytics.paused_subscribers--;

                                }
                                await product.save()


                                return 'successfully resumed subscription and paypal payment'
                            } else if (response === 'Subscription is already active in PayPal') {
                                return response
                            }
                        } catch (err) {
                            console.log(err)
                            throw new Error(err, { errors: { general: "Couldn't resume paypal agreement" } })
                        }
                    }



                } else throw new Error("Cannot find subscription")
            } else throw new Error("user not logged in")
        },


        //TODO:: add seller dashboard backend 
        async subscriptionShipped(_, { subscriptionID, tracking, trackingCarrier }, context) {
            const user = authHeader(context);
            if (!user) {
                return;
            }
            if (!user.isSeller) {
                return;
            }
            let subscription = await Subscription.findById(subscriptionID);

            if (subscription) {
                if (subscription.sellerID != user.id) {
                    return;
                }
                nextdelivery = subscription.nextDelivery;
                nextdelivery.shipped = true
                nextdelivery.tracking = tracking,
                    nextdelivery.trackingCarrier = trackingCarrier,

                    await subscription.save()
                return subscription
            }

        },
        // async subscriptionDelivered(_,{subscriptionID}, context){
        //         let subscription = await Subscription.findById(subscriptionID)
        //         if(subscription){
        //             if(subscription.isActive){

        //             }
        //         }
        // }
    }
}
