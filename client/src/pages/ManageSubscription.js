import React,{useContext} from 'react'
import gql from 'graphql-tag'
import { useMutation, useQuery } from "@apollo/react-hooks";
import { AuthContext } from "../context/auth"
import {Container, Loader, Card} from 'semantic-ui-react'
import moment from 'moment'

export default function ManageSuscription(props){
    let {user} = useContext(AuthContext)

    let subscriptionID = props.match.params.subscriptionID
    const {data: subscriptiondata, loading: subscription_loading} = useQuery(GETSUBSCTIPTION, {variables:{subscriptionId: subscriptionID}})
  
    if(user == null){
        return(<div>Please <a href = '../../login'>LOGIN</a> </div>)
    }
    if(subscription_loading){
        return(<Loader active/>)
    }
    if(!subscriptiondata){
        return (<div className = 'error404'>ERROR 404 This Page is unavailable</div>)
    }
    function SubscriptionProduct(productID){
        
        const {data:productdata, loading: product_loading} = useQuery(FETCH_PRODUCT,{variables:{productId: productID.productID }})

        if(product_loading){
            return (<Loader active/>)
        }
        return(<div className = 'SubscriptionProduct'>
            {productdata.getProduct.ImageLink[0]}
            <p>{productdata.getProduct.name}</p>
            <p>{productdata.getProduct.price}</p>
            <p>{productdata.getProduct.OverallRating}</p>
            

        </div>)
    }
    
    return(
        <div>
            <Container >
                <Card centered raised >
                    <h1 style = {{textAlign : 'center', color : 'gray', paddingTop: 10, paddingBottom : 0}}>Subscription Details</h1>
                    <Card style = {{padding: 10 }}>
                       <SubscriptionProduct productID  ={subscriptiondata.getSubscription.productID}  />
                    </Card>
                     <Card cenetered = 'false' style = {{padding: 10 }}>
                       <p><b>Created at</b> :  {`${moment(subscriptiondata.getSubscription.createdAt)}`}</p>
                       <p><b>Seller </b> : {subscriptiondata.getSubscription.sellerID}</p>
                       {/* <p><b>Last delivered</b>: {subscriptiondata.getSubscription.delivered[0]}</p>
                       <p><b>Next delivery</b>: {subscriptiondata.getSubscription.nextDelivery}</p> */}
                        <p><b></b></p>
                    </Card>
                    
                </Card>
            </Container>
        </div>
    )
}

const GETSUBSCTIPTION = gql`
    query getSubscription($subscriptionId: ID!){
        getSubscription(subscriptionId: $subscriptionId){
           
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