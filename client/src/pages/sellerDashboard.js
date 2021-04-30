
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

  if (!loading_sellerData && !loading_activeSubscription && !loading_activeProducts) {
    console.log(sellerData)
    console.log(activeSubscription)
    console.log(activeProducts.getSellerActiveSubscriptionsProducts)
  }
  function OnAGlance(seller) {
    seller = seller.seller
    return (
      <Container textAlign='center' style = {{paddingTop: '10px'}}>
        <Card fluid padded = 'very'>
          <Card.Header><h2>Hi! {seller.username} </h2></Card.Header>
          <Card.Content>Here's your recap

            //TODO::change this to make it better
            <p>Upcoming shipments: {activeProducts.getSellerActiveSubscriptionsProducts[0].id} and {activeProducts.getSellerActiveSubscriptionsProducts.length -1} more
            </p>
            <p>your total active subscriptinos : {}</p>
          </Card.Content>
        </Card>
      </Container>
    )  //TODO:: add a at A glance here(monthly selling, increase from last month, etc)
  }

  if (loading_sellerData || loading_activeSubscription || loading_activeProducts) {
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
                <Segment padded='very' as={Link} to={'seller/subscriptions'}><h3>All Subscription</h3></Segment>
                <Segment padded='very' as={Link} to={'seller/profile'} ><h3>Profile</h3></Segment>
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


