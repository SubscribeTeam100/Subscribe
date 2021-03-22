const User = require('../../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {UserInputError} = require('apollo-server')
const {KEY} = require('../../config')
const {validateRegisterInput, validateLogin} = require('../validator/uservalidator')
const authHeader = require('../validator/auth-user')
const Product = require('../../models/Product')
const Address = require('../../models/Address')
const Review = require('../../models/Review')

const {MONGODB} = require('../../config')
// const mongoose = require('mongoose')

function generateToken(user){
    const token = jwt.sign({
        id: user.id,
        username: user.username,
        email : user.email,
        isSeller: user.isSeller
    }, KEY,{expiresIn: '3h'})
    return token
}
module.exports = {
    Query: {
        
        async getUserReviews(_,{}, context){
            let user = authHeader(context);
            
            if(user){
                
                const reviews = await Review.find({userID: user.id});
                console.log(reviews)
                return reviews

            }
        },

        async getAddress(_,{ addressId, subscriptionId}, context){
            const user = authHeader(context);
            const sub = await Subscription.findById(subscriptionId);

            if(user.id === sub.sellerID){
                const sub = await Subscription.findById(subscriptionId);
                const address = await Address.findById(addressId)
                if(sub.userID === address.userID){
                    return address
                }else throw new Error("Address not authorized to view based on the current subscription")
            }throw new Error("Only authorized seller can view the address")
        },

        async getSellerProducts(_,{},context){
            const user = authHeader(context);
            if(user.isSeller){
                products = await Product.find({sellerID: user.id})
                return products;
            }else throw new Error("Sorry you're not a seller yet.")
        },
        
    },
   
    
    Mutation:{
        async register(_,{ registerInput: {username, email, password, confirmPassword, phone}}){
            const {errors, valid } = validateRegisterInput(username, email, password, confirmPassword, phone)
            console.log("errors here")
            if(!valid){
               
                throw new UserInputError('Errors', {errors})
            }
            password = await bcrypt.hash(password, 12)
            const user = await User.findOne({username});
            if(user){
                throw new UserInputError('Username is already taken',{
                    errors: {username: 'This username is taken'}}
                )
            }
            
            const newUser = new User({
                username,
                email,
                password,
                confirmPassword,
                phone,
                createdAt: new Date().toISOString(),
                isSeller: false
            })
            const res = await newUser.save();
            token = generateToken(res);
            return{
                ...res._doc,
                id: res._id,
                token
            }
        },

        async login(_,{email, password}){
            const {errors, valid} = validateLogin(email, password)
            if(!valid){
                throw new UserInputError('Errors', {errors})
            }
            const user = await User.findOne({email});
            if(!user){
                
                throw new UserInputError('Username not found', {errors:{username : 'Username and password cannot be found'}})
            }
            const isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch){
                throw new UserInputError('Wrong Credentials', {errors:{username : 'Username and password cannot be found'}})
            }
           
              const token =  generateToken(user)
            return{
                ...user._doc,
                id: user._id,
                token    
            }


        },
        async addAddress(_,{addressInput: {name, Address1, Address2, city, state, country, zip, phone, email}}, context){
            const presentuser = authHeader(context);
            if(presentuser){
                const user = await User.findById(presentuser.id);
                const newAddress = new Address({
                    name, Address1, Address2, city, state, country, zip, phone, email,
                    createdAt: new Date().toISOString(),
                    userID: user.id
                })
                const res = await newAddress.save();
                user.addressID.unshift(res._id)
                await user.save()
                return {
                    ...user._doc,
                    id: user._id
                }
            }



        },
        async upgradeToSeller(_,{},context){
            const presentuser = authHeader(context);
            
            if(presentuser){
                let user = await User.findById(presentuser.id);
                if(!user.isSeller){
                    
                  await User.findOneAndUpdate({username: user.username},{isSeller: true},{new: true})
                  user = await User.findOne({_id: user.id})
                   return user;
                }
                else return new Error('User is already upgraded to Seller', {errors})
            }else return new Error('User not logged in',{errors})
        },

        
        // async addSettlement(_, {settlementInput:{ number, CVV, expMonth, expYear}, addressInput:{name, Address1, Address2, city, state, country, zip, phone, email}}, context){
        //     number = await bcrypt.hash(number, 12)
        //     const currentuser = authHeader(context);
        //     //ADD CC validator
        //    if(currentuser){
        //     const user = await User.findById(currentuser.id)
        //     user.settlement.unshift({
        //         number, CVV, expMonth, expYear, 
        //         billingAddress:{
        //             name, Address1, Address2, city, state, country, zip 
        //         }
        //     })
        //    }
           
        // }
        
    }
}