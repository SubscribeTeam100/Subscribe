const Subscription = require('../../models/Subscription')
const User = require('../../models/User')
const Address = require('../../models/Address')
const Product = require('../../models/Product')
const authHeader = require('../validator/auth-user');
const {UserInputError} = require('apollo-server')
const Seller = require('../../models/Seller')
const GET = require('../../paypal/get')


module.exports = {
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
        async getSellerProducts(_, {}, context) {
            const user = authHeader(context);
            if (user.isSeller) {
              products = await Product.find({ sellerID: user.id });
              return products;
            } else throw new Error("Sorry you're not a seller yet.");
          },
        async getSeller(_,{sellerID}, context){
            let user = authHeader(context)
            if(sellerID){
              let seller = await User.findById(sellerID)
              
              if(seller && seller.isSeller) return seller
            }else if(user && !sellerID){
              if(user.isSeller){
                seller = await User.findById(user.id)
                return seller
              }
            }else throw new Error('User Unavailable', {errors :{general:"User Unavailable"}})
        },
        async getSellerActiveSubscriptionsProducts(_,{},context){
            let user = authHeader(context)
            
            if(user){
                let subs = await Subscription.find({sellerID: user.id, isActive: true}).sort({"paypal_response[0].agreement_details.next_billing_date": 1, createdAt: 1})
                
                let products = []
                for(let i in subs){
                    let product = await Product.findById(subs[i].productID)
                    if(product){products.push(product)}
                }
                
                return products
            }else throw new UserInputError("invalid request")
        },
        async getSellerDocument(_,{}, context){
          const user = authHeader(context)
          let seller = await Seller.find({userID: user.id})
          if(seller){
            console.log(seller)
            return seller[0];
          }else throw new Error("Seller not found",{errors:{general:"Seller not found"}})
        },
        
    },
    Mutation:{
        async upgradeToSeller(_, {}, context) {
            const presentuser = authHeader(context);
      
            if (presentuser) {
              let user = await User.findById(presentuser.id);
              if (!user.isSeller) {
                await User.findOneAndUpdate(
                  { username: user.username },
                  { isSeller: true },
                  { new: true }
                );
                user = await User.findOne({ _id: user.id });
                let date = new Date()
                let month = date.getMonth()
                const seller = new Seller({
                  userID: user.id,
                  total_active: 0,
                  total_subscribers: 0,
                  total_paused: 0,
                  total_cancelled: 0,
                  
                })
                seller.subscription_record.unshift({
                  month : month+1,
                  subscribers: 0,
                  active: 0,
                  paused: 0,
                  cancelled: 0,
                })
                await seller.save()
               
                return user;
              } else return new UserInputError("User is already upgraded to Seller", { errors });
            } else return new UserInputError("User not logged in", { errors });
          },
    }
}