import React, { useState, useContext } from "react";
import { AuthContext } from "../context/auth";
import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { Loader, Card,Segment, Grid, Input, Icon, Button } from "semantic-ui-react";
import moment from 'moment';

export default function Subscriptions(props){
    const {user} = useContext(AuthContext);
 
    const {data: userSubdata, loading: getUserSubscriptions_loading} = useQuery(GET_SUBSCRIPTION);
 
    if(!user){
        return (<h1>Please <a href = '../login'>Login</a></h1>)
    }
    if(getUserSubscriptions_loading ){
        return(<Loader active />)
    }
    
    function SubscriptionCard(subscription, index){
       
        const {data: productdata, loading: getProduct_loading} = useQuery(FETCH_PRODUCT, {variables:{productId:subscription.subscription.productID}})
       
        if(getProduct_loading){
            return (<Loader active />)
        }else{
            console.log(index.index);
            
            return(
            <div className="Subscription-card">
                
               <Card
               color = {subscription.subscription.isActive? 'green' : 'red'}
               
               header={productdata.getProduct.name}
               meta={productdata.getProduct.price}
               description = {`purchased ${moment(userSubdata.getUserSubscriptions.createdAt ).toString().slice(0,-18)}`}
               
               extra = {<Button color = 'gray' href = {`/subscriptions/${subscription.subscription.id}`}>Manage Subscription</Button>}/>
               
                
            </div>
            )
        }
        }

        return(
            <div>
                <div className = 'subscription-container'>
                    <h2> USER SUBSCRIPTIONS:</h2>
                {userSubdata.getUserSubscriptions.length > 0 ? userSubdata.getUserSubscriptions.map((subscription, index) =>(
                    <div>
    
                        <SubscriptionCard subscription = {subscription} i={index} />
                        
                        <hr></hr>
                    </div>
    
                    
                )
                ) : (
                    <div>You have no active subscriptions.<a href = '../home'>What would you like? </a></div>
                )}
            </div>
            </div>
        )
        
    
}
const GET_SUBSCRIPTION = gql`
    query getUserSubscriptions{
        getUserSubscriptions{
            id
            frequency
            settlementID
            productID
            sellerID
            addressID
            userID
            createdAt
            isActive
        }
    }


`

const FETCH_PRODUCT = gql`
  query getProduct($productId: ID!) {
    getProduct(productId: $productId) {
        id
      description
      createdAt
      name
      sellerID
      isVisible
      reviews {
        reviewID
        userID
      }
      reviewPoints
      overallRating
      tags
      ImageLink
    }
  }
`;