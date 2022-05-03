
import React, { useContext } from 'react'
import { Segment, Grid, Container, Card, Loader, Header } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { AuthContext } from "../context/auth"
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'



export default function SellerDashboard() {
  const { user } = useContext(AuthContext);
  const { data: sellerData, loading: loading_sellerData } = useQuery(GET_SELLER)
  const { data: activeSubscription, loading: loading_activeSubscription } = useQuery(GET_SELLER_ACTIVE_SUBSCRIPTIONS)
  const { data: activeProducts, loading: loading_activeProducts } = useQuery(GET_SELLER_ACTIVE_PRODUCTS)
  const {data: sellerDocument, loading: loading_sellerDocument} = useQuery(GET_SELLER_DOCUMENT)
  if (!loading_sellerData && !loading_activeSubscription && !loading_activeProducts && !loading_sellerDocument) {
    
  }
  function OnAGlance(seller) {
    seller = seller.seller
    if(sellerDocument.getSellerDocument.products.length === 0){
      return(
        <div>
          Let's <a href= 'seller/addProduct'> add your First Product</a>
        </div>
      )
    }
    if(sellerDocument.getSellerDocument.total_subscribers === null){
      return(
        <div>
          Lets get your first subscriber. <a>Share</a>
        </div>
      )
    }
    return (
      <Container textAlign='center' style = {{paddingTop: '10px'}}>
        <Card fluid padded = 'very'>
          <Card.Header><h2>Hi! {seller.username} </h2></Card.Header>
          <Card.Content>Here's your recap
            
            <p><b>Total Subscribers: </b> {sellerDocument.getSellerDocument.total_subscribers}</p>
            <p><b>Total active: </b> {sellerDocument.getSellerDocument.total_active}</p>
            <p><b>Total increase this month: </b>{sellerDocument.getSellerDocument.subscription_record[1]!=undefined ? (((sellerDocument.getSellerDocument.subscription_record[0].subscribers-sellerDocument.getSellerDocument.subscription_record[1].subscribers)/sellerDocument.getSellerDocument.subscription_record[1].subscribers)*100):( `${sellerDocument.getSellerDocument.subscription_record[0].subscribers}`)} </p>
            //TODO::change this to make it better
            <p>Upcoming shipments: {activeProducts.getSellerActiveSubscriptionsProducts.length>0? activeProducts.getSellerActiveSubscriptionsProducts[0].id  : 'No upcoming shipments'}
            </p>
            
          </Card.Content>
        </Card>
      </Container>
    ) 
  }
  if( user===null || !user.isSeller){
    return(
      <div>
        You have to be a seller to view this page
      </div>
    )
  }
  
  if (loading_sellerData || loading_activeSubscription || loading_activeProducts|| loading_sellerDocument) {
    return <Loader active />
  } else {
    
    
    
    return (
      <div>

        <OnAGlance seller={sellerData.getSeller} />
        <Container textAlign='center' >
          <Grid divided >
            <Grid.Row stretched>
              <Grid.Column stretched>

              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Grid columns={1} >
            <Grid.Row stretched>
              <Grid.Column >
               
                <Segment padded='very' as={Link} to={'seller/selling'}><h3>Selling</h3></Segment>
                <Segment padded='very' as={Link} to={'seller/products'}><h3>Products</h3></Segment>
                <Segment padded='very' as={Link} to={'seller/profile'} ><h3>Profile</h3></Segment>
                <Segment padded='very' as={Link} to={'seller/addProduct'}><h3>Add a product</h3></Segment>
                <Segment padded='very' as={Link} to={'seller/suggestion'}><h3>Give a suggestion :)</h3></Segment>


              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      //TODO: seller page here

      </div>
    )
  }


}


const GET_SELLER = gql`
  query getSeller{
    getSeller{
      id
      email
      username


    }
  }

`
const GET_SELLER_DOCUMENT = gql`
  query getSellerDocument{
    getSellerDocument{
      total_active
    total_subscribers
    total_paused
    total_cancelled
    products
    rating
    subscription_record{
        month
        subscribers
        active
        paused
        cancelled
    }
    userID
    }
  }
`

const GET_SELLER_ACTIVE_SUBSCRIPTIONS = gql`
  query getSellerActiveSubscriptions{
    getSellerActiveSubscriptions{
      id
      productID
      paypal_response{
        id
        agreement_details{
          last_payment_amount{
            value
          }
          next_billing_date
        }
      }
    }
  }
`
const GET_SELLER_ACTIVE_PRODUCTS = gql`
  query getSellerActiveSubscriptionsProducts{
    getSellerActiveSubscriptionsProducts{
      id
      name
    }
  }
`


