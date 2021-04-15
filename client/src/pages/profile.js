import React, { useState, useContext } from "react";
import { AuthContext } from "../context/auth";
import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { Loader, Card,Segment, Grid, Input, Icon, Button } from "semantic-ui-react";
import moment from 'moment';
export default function ProfilePage(){
    const {user} = useContext(AuthContext);
 
    const {data: userSubdata, loading: getUserSubscriptions_loading} = useQuery(GET_SUBSCRIPTION);
    const {data: userAddressesdata, loading: getUserAddresses_loading} = useQuery(GET_ADDRESSES);
    
    if(!user){
        return (<h1>Please <a href = '../login'>Login</a></h1>)
    }
    if(getUserSubscriptions_loading || getUserAddresses_loading){
        return(<Loader active />)
    }
    
    function SubscriptionCard(subscription){
       
    const {data: productdata, loading: getProduct_loading} = useQuery(FETCH_PRODUCT, {variables:{productId:subscription.subscription.productID}})
   
    if(getProduct_loading){
        return (<Loader active />)
    }else{
        return(
        <div className="Subscription-card">
            { console.log(productdata)}
           <Card
           color = {subscription.subscription.isActive? 'green' : 'red'}
           
           header={productdata.getProduct.name}
           meta={productdata.getProduct.price}
           description = {`purchased ${moment(productdata.getProduct.createdAt).fromNow(true)} ago`}
           
           extra = {<Button color = 'gray' href = {`/subscriptions/${subscription.subscription.id}`}>manageSubscription</Button>}/>
           
            
        </div>
        )
    }
    }

    



    return(
        <div>
            <div className = 'subscription-container'>
                <h2> USER SUBSCRIPTIONS:</h2>
            {userSubdata.getUserSubscriptions.length > 0 ? userSubdata.getUserSubscriptions.map((subscription) =>(
                <div>

                    <SubscriptionCard subscription = {subscription} />
                    
                    <hr></hr>
                </div>

                
            )
            ) : (
                <div>You have no active subscriptions.<a href = '../home'>What would you like? </a></div>
            )}
        </div>
        <hr/><hr/>
            <div className = 'address-container'>
                <h2> User Addresses: </h2>
                {userAddressesdata.getUserAddresses.length > 0? userAddressesdata.getUserAddresses.map(address =>(
                    <div>
                        <Card>
                        <p>{address.name}</p>
                        <p>{address.Address1}</p>
                        <p>{address.Address2? address.Address2 : ''}</p>
                        <p>{address.city}</p>
                        <p>{address.zip}</p>
                        <p>{address.country}</p>
                        <p>{address.email}</p>
                        <p>{address.phone}</p>

                        <Button color = 'gray'> Manage Address</Button>
                        </Card>
                        <hr/>
                    </div>
                )) : (
                    <div>
                        Where should we deliver? <a href = '#'><u>Add Address</u></a>
                    </div>
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

const GET_ADDRESSES= gql`
    query getUserAddresses{
        getUserAddresses{
            id
    
            createdAt
            name
            
            Address1
            Address2
            city
            
            state
            country
            zip
            phone
            email
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