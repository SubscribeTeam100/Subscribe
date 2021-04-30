const Subscription = require('../../models/Subscription')
const User = require('../../models/User')
const Address = require('../../models/Address')
const Product = require('../../models/Product')
const Create = require('../../paypal/create')
const Execute = require('../../paypal/execute')
const GET= require('../../paypal/get')
const Cancel = require('../../paypal/cancel')
const Suspend = require('../../paypal/suspend')
const Resume = require('../../paypal/resume')
//paypal

//




// const {KEY} = require('../../config')
const authHeader = require('../validator/auth-user');
const {UserInputError} = require('apollo-server')

module.exports ={
    Query:{
        async getSellerActiveSubscriptions(_,{}, context){
            const user = authHeader(context);
            if(user){
                const subs = await Subscription.find({sellerID: user.id, isActive: true}).sort({createdAt: -1})
                 let returnSubs = [];
                 for(let i in subs){
                    
                     if(subs[i].paypal_response.length>0){
                      
                        let billingAgreementId = subs[i].paypal_response[0].id
                        let billingAgreement = await GET(billingAgreementId).then(data=>{
                            return data
                        })
                        
                        //update paypal_response
                        subs[i].paypal_response.pop()
                        subs[i].paypal_response.unshift(billingAgreement)
                        
                        await subs[i].save();

                        if(billingAgreement.state === 'Active'){
                            returnSubs.push(subs[i])
                        }else{
                            subs[i].isActive = false;
                            
                            await subs[i].save();
                        }
    
                     }else{
                         subs[i].isActive = false
                         await subs[i].save()
                     }
                    
                 }

               
                return returnSubs;
            }   

        },
        async getUserSubscriptions(_,{}, context){
            const user = authHeader(context);
            if(user){
                const subs = await Subscription.find({userID: user.id}).sort({createdAt: -1})
                return subs;
            }   

        },
        async getSubscriptionProducts(_,{},context){
            let user = authHeader(context);
            if(user){
                let user = await User.findById(user.id); 
                subscriptions = user.subscriptions;
                subscriptionProducts = []
                for(let i in subscriptions){
                    currentsub = await Subscription.findById(subscriptions[i]);
                    if(currentsub){
                        subscriptionProducts.push(currentsub);
                    }
                }
                return subscriptionProducts;
                
            }else throw new Error('User not logged in', {errors:{general: "User not logged in" }})
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
                        }else return subscription

                    } else {return subscription}


                } else throw new Error('Cannot find Subscription', { errors: { general: "Cannot find Subscription" } })
            } else throw new Error('User not logged in', { errors })
        },

        async getSellerActiveSubscriptionsProducts(_,{},context){
            let user = authHeader(context)
            
            if(user){
                let subs = await Subscription.find({sellerID: user.id, isActive: true}).sort({"paypal_response[0].agreement_details.next_billing_date": 1, createdAt: 1})
                console.log(subs)
                let products = []
                for(let i in subs){
                    let product = await Product.findById(subs[i].productID)
                    if(product){products.push(product)}
                }
                
                return products
            }else throw new UserInputError("invalid request")
        }
    },
    
    Mutation:{
        
        async addSubscription(_,{subscriptionInput:{productID,addressID, sellerID,  frequency, quantity}}, context){
            //TODO: add subscription input validator,
            //TODO: bring in addressinput, settlement input, settlement
            //TODO:
            if(frequency.trim() === ''){
                return new UserInputError("Please specify frequency")
            }
            let user = authHeader(context);
            if(user){
               
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
               
                //changing seller document
                let seller = await User.findById(sellerID)
                seller.subscriptions.unshift(res._id)
                seller.subscription_record[0].subscribers = seller.subscription_record[0].subscribers + 1
                await seller.save()
                //changed seller document
       
              let data = await Create(product, subscription, address).then(async data=>{
                
                user= await User.findById(user.id);
                
                await user.subscriptions.unshift(
                    res._id
                )
                user.Cart =  user.Cart.filter(cartItem => cartItem.productID !== productID)
                await user.save();

                await product.subscriptions.unshift(
                    res._id
                )
                
                await product.save()
                return data
                
               })
               res.paypal_payment_url = data
               await res.save();
               return data
               
            }else throw new Error("Please Log In")
            
        },
        async activateSubscription(_,{paymentToken, subscriptionID}, context){
            let subscription = await Subscription.findById(subscriptionID)
            try{
                let billingAgreement = await Execute(paymentToken).then(async data=>{
                   
                    await subscription.paypal_response.unshift(data);
                    if(data.state === 'Active'){subscription.isActive = true;}
                    
                    await subscription.save();
                    return data
                })
                return('SubscriptionActivated: Billing Agreement id is '+ billingAgreement.id)
                
            }
            catch(err){

                console.log(err);
                throw new Error(err,{errors:{general:"Billing Agreement execution failed"}})
            }
            
           
        },

        async deleteSubscription(_, {subscriptionId}, context){
            let user = authHeader(context);
            if(user){
                const subscription = await Subscription.findById(subscriptionId);
                if(subscription){
                    
                    let productID = subscription.productID
                    let product = await Product.findById(productID)
                    if(subscription.paypal_response.length>0){
                       
                        let billingAgreementID = subscription.paypal_response[0].id
                   
                    try{
                        let response = await Cancel(billingAgreementID).then(async data=>{
                            if(subscription.userID === user.id){
                                await subscription.delete();
                                
                            }else throw new Error("Subscription from another user cannot be deleted")
                            if(product){
                                
                                product.subscriptions = product.subscriptions.filter(subscription => subscription !== subscriptionId)
                                await product.save()
                                
                                
                            }
                            let userID = subscription.userID
                            user = await User.findById(userID)
                            if(user){
                            
                                user.subscriptions = user.subscriptions.filter(subscription => subscription !== subscriptionId)
                                await user.save()
                                    
                            }
                            return data
    
                        })
                        if(response.httpStatusCode === 204){
                            return 'successfully deleted the subscription and the payment agreement'
                        }
                    }catch(err){
                        
                        throw new error(err)
                    }
                   
                    }else {
                        await subscription.delete()
                    await subscription.save()
                    return "deleted subscription. Paypal wasn't authorized yet."
                    }
                    
                    
                    
                } throw new Error("Subscription not found")
           }   
        },

        async pauseSubscription(_, {subscriptionId}, context){
            const user = authHeader(context);
            if(user){
                let sub = await Subscription.findById(subscriptionId);
                if(sub){
                    
                    if(sub.paypal_response.length>0){
                        
                        let billingAgreementId = sub.paypal_response[0].id
                        try{
                            let response = await Suspend(billingAgreementId).then(async data=>{
                                if(sub.isActive){
                                    sub.isActive = false;
                                   
                                    await sub.save()
                                    
                                }
                                let billingAgreement = await GET(billingAgreementId).then(async data=>{
                                    return data
                                })
                                await sub.paypal_response.pop()
                                await sub.paypal_response.unshift(billingAgreement)
                                await sub.save()
    
                                return data
                            })
                            if(response.httpStatusCode === 204){
                                return "Successfully paused subscription and paypal"
                            }else if(response === 'paypal agreement is not active to be suspended'){
                                return response;
                            }
                        }catch(err){
                            console.log(err)
                            throw new Error(err,{errors:{general:"Couldn't suspend paypal agreement"}})
                        }
                      
                    }
                   
                   
                   
                }else throw new Error("Cannot find subscription")
            }else throw new Error("user not logged in")
        },
        async resumeSubscription(_, {subscriptionId}, context){
            const user = authHeader(context);
            if(user){
                let sub = await Subscription.findById(subscriptionId);
                if(sub){
                    if(sub.paypal_response.length>0){
                        
                        let billingAgreementId = sub.paypal_response[0].id
                        try{
                           let response = await Resume(billingAgreementId).then(async data =>{
                               if(!sub.isActive){
                                   sub.isActive = true;
                                   
                                   await sub.save()
                                   
                               }
                               let billingAgreement = await GET(billingAgreementId).then(async data=>{
                                   return data
                               })
                               await sub.paypal_response.pop()
                               await sub.paypal_response.unshift(billingAgreement)
                               await sub.save()
                               return data
                           })
                           if(response.httpStatusCode === 204){
                               return 'successfully resumed subscription and paypal payment'
                           }else if(response ===  'Subscription is already active in PayPal'){
                               return response
                           } 
                        }catch(err){
                            console.log(err)
                            throw new Error(err,{errors:{general:"Couldn't resume paypal agreement"}})
                        }
                    }
                   
                
                    
                }else throw new Error("Cannot find subscription")
            }else throw new Error("user not logged in")
        },


        //TODO:: add seller dashboard backend 
        async subscriptionShipped(_,{subscriptionID, tracking, trackingCarrier}, context){
            const user = authHeader(context);
            if(!user){
                return;
            }
            if(!user.isSeller){
                return;
            }
            let subscription = await Subscription.findById(subscriptionID);

            if(subscription){
                if(subscription.sellerID != user.id){
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
