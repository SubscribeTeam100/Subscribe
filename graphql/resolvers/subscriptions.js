const Subscription = require('../../models/Subscription')
const User = require('../../models/User')
const Product = require('../../models/Product')

const bcrypt = require('bcryptjs')
// const {KEY} = require('../../config')
const authHeader = require('../validator/auth-user');
const {UserInputError} = require('apollo-server')

module.exports ={
    Query:{
        async getSellerSubscriptions(_,{}, context){
            const user = authHeader(context);
            if(user){
                const subs = await Subscription.find({sellerID: user.id}).sort({createdAt: -1})
                return subs;
            }   

        },
        async getUserSubscriptions(_,{}, context){
            const user = authHeader(context);
            if(user){
                const subs = await Subscription.find({userID: user.id}).sort({createdAt: -1})
                return subs;
            }   

        }
    },
    Mutation:{
        
        async addSubscription(_,{subscriptionInput:{productID,addressID, sellerID, settlementID, frequency}}, context){
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
                    isActive: true,
                    createdAt: new Date().toISOString()
                })
                const res = await newSubscription.save();
                 user= await User.findById(user.id);
                const product = await Product.findById(productID)
                
                await user.subscriptions.unshift(
                    res._id
                )
                await user.save();
                await product.subscriptions.unshift(
                    res._id
                )
                await product.save()
                return{
                    ...res._doc,
                    id: res._id,
    
                }
            }else throw new Error("Please Log In")
            
        },
        async deleteSubscription(_, {subscriptionId}, context){
            const user = authHeader(context);
            if(user){
                const subscription = await Subscription.findById(subscriptionId);
                if(subscription){
                    
                    if(subscription.userID === user.id){
                        await subscription.delete();
                        return "Subscription deleted Successfully"
                    }else throw new Error("Subscription from another user cannot be deleted")
                
                } throw new Error("Subscription not found")
           }   
        },

        async pauseSubscription(_, {subscriptionId}, context){
            const user = authHeader(context);
            if(user){
                let sub = await Subscription.findById(subscriptionId);
                if(sub){
                    if(sub.isActive){
                        sub = await Subscription.findOneAndUpdate({id: subscriptionId}, {isActive: false},{new: true});
                        return sub
                    }
                }
            }
        }
    }
}
