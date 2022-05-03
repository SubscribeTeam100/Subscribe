const Product = require('../../models/Product')
const Review = require('../../models/Review')
const Seller = require('../../models/Seller')
const User = require('../../models/User')
const {productInputValidator} = require('../validator/productValidator')
const {UserInputError} = require('apollo-server');
const authHeader = require('../validator/auth-user');
const { findOneAndUpdate } = require('../../models/Product');

module.exports = {
Query:{
        async getProducts(){
            try{
                const product = await Product.find();
                return product
            }catch(err){
                throw new Error(err)
            }
        },

        async getReview(_,{reviewId}, context){
            review = await Review.findById(reviewId);
            return review
        },

        async getProductReviews(_, {productId}, context){
            const product = await Product.findById(productId);
            
            if(product){
                reviews = await Review.find({productID:product.id})
                return reviews;
            }else throw new error("Cannot find product")
        },

        async getProduct(_,{productId}){
            const product = Product.findById(productId)
            if(product){
                return product
            }else throw new Error("Cannot find product")
        },

        
    },
Mutation:{
        async addProduct(_, {productInput: { name, description, price, isVisible, tags, ImageLink}}, context){
            console.log('yaa samma aauncha')
            const user = authHeader(context);
            
            const {errors,valid} = productInputValidator(name, description, price)
            if(!valid){
                throw new ("Errors", {errors})
            }

            if(valid){
                if(user){
                    const isSeller = user.isSeller;
                    const seller = await Seller.find({userID: user.id})
                    console.log(seller)
                    if(isSeller){
                        const { errors, valid} = productInputValidator(name, description, price)
                        
                        if(!valid){
                            throw new UserInputError('Errors: ', {errors})
                        }
        
                            const newProduct = new Product({
                                name,
                                description,
                                price,
                                createdAt: new Date().toISOString(),
                                sellerID: user.id,
                                isVisible,
                                reviewPoints: 0,
                                overallRating: 0.0,
                                tags,
                                ImageLink
                            })
                    
                        const result = await newProduct.save()
                        console.log(seller)
                        await seller[0].products.unshift(result._id)
                        await seller[0].save()
                        return{
                            ...result._doc,
                            id: result._id,
                            
                        }
                    }
                    else throw new Error("user is not a seller")
                    
                }
            }else throw new UserInputError("Error: Please check your input", {errors})
          


        },

        async deleteProduct(_,{productId}, context){
            const user = authHeader(context);
            if(user){
                const product = await Product.findById(productId);
                if(product){
                   
                    if(product.sellerID = user.id){
                        await product.delete();
                    return("Successfully deleted product")
                    }else throw new Error("User not authorized to delete the listing")
                }else throw new Error('cannot find product')
            }else throw new Error('user not logged in')
        },
        
        
        
        async addReview(_,{reviewInput:{title, rating, description, productID}}, context){
            if(rating >5 || rating < 0){
                throw new UserInputError("Invalid Rating")
            }
            let user = authHeader(context)
            
            if(user){
                let product = await Product.findById(productID);
                user = await User.findById(user.id)
                
                
                if(product){
                    

                    if(product.reviews.find((review) => review.userID === user.id)){
                        throw new UserInputError("Review from the user already exists")
                    }
                    if(product.sellerID === user.id){
                        throw new Error("Cannot review your own listing!")
                        
                    }
                    
                    else{
                       
                        let newReviewPoint = (product.reviewPoints);
                        newReviewPoint = newReviewPoint + rating
                        
                        product = await Product.findOneAndUpdate({_id: product.id}, {reviewPoints: newReviewPoint}, {new:true})
                       
                        
                        let numberofReviews  = product.reviews.length +1.0
                        
                        let newOverallRating = product.reviewPoints / numberofReviews;
                        
                        product =await Product.findOneAndUpdate({_id: product.id}, {overallRating : newOverallRating},{new:true})
                        await product.save()
                        
                        const newReview = new Review({
                            productID : product.id,
                            title,
                            rating,
                            description,
                            userID: user.id,
                            username: user.username,
                            createdAt: new Date().toISOString()
                        })
                        const res = await newReview.save()
                        
                        
                        await user.reviews.unshift({
                           reviewID: res._id,
                           productID
                        })
                            
                        await user.save()

                        await product.reviews.unshift({
                            reviewID: res._id,
                            userID: user.id
                        })
                        await product.save()
                        return{
                            ...product._doc,
                            id: product.id
                        }
                    }
                }
                else throw new Error('Cannot find product')
                
            }
        },

        async deleteReview(_,{reviewId, productId}, context){
            let user = authHeader(context);
           if(user){
            user = await User.findById(user.id)
            
            let product= await Product.findById(productId);
               if(product){
                    const reviewinproduct = product.reviews.find((review)=> review.reviewID === reviewId)
                    const reviewinuser = user.reviews.find((review)=> review.reviewID === reviewId)
                    const review = await Review.findById(reviewId)
                    if(reviewinproduct && reviewinuser &&review){
                        numberofReviews = product.reviews.length -1;
                        product = await Product.findOneAndUpdate({_id: product.id}, {reviewPoints : (product.reviewPoints - review.rating)},{new:true})
                        if(numberofReviews === 0){
                            product =await Product.findOneAndUpdate({_id: product.id}, {overallRating : 0},{new:true})
                        }else {
                            product =await Product.findOneAndUpdate({_id: product.id}, {overallRating : (product.reviewPoints/numberofReviews)},{new:true})
                        }
                        
                        product.reviews = product.reviews.filter((review)=> review.userID !== user.id)
                        await product.save()
                        user.reviews = user.reviews.filter((review) => review.productID!== product.id)
                        await user.save()
                       
                        await review.delete()
                        
                        return product;
                    }else throw new UserInputError("Review not found",{errors})
               }
           }

        }
    }
}
