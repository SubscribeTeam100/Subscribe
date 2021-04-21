
import React,{useContext} from 'react'
import {Segment, Grid, Container, Card} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import { AuthContext } from "../context/auth"
import gql from 'graphql-tag'

export default function SellerDashboard(){
    const { user } = useContext(AuthContext);
    function OnAGlance(){
      
      return(
          <Card></Card>
      )  //TODO:: add a at A glance here(monthly selling, increase from last month, etc)
    }
        return(
            <div>

                <OnAGlance /> 
                <Container textAlign = 'center' >
        <Grid divided >
        <Grid.Row stretched>
          <Grid.Column stretched>
            
          </Grid.Column>
          </Grid.Row>
          </Grid>
          <Grid columns = {1} >
          <Grid.Row stretched>
          <Grid.Column > 
            <Segment padded = 'very' as = {Link} to = {'seller/summary'}><h3>Summary</h3></Segment>
            <Segment padded = 'very' as = {Link} to = {'seller/selling'}><h3>Selling</h3></Segment>
            <Segment padded = 'very' as={Link} to = {'seller/subscriptions'}><h3>All Subscription</h3></Segment>
            <Segment padded = 'very' as={Link} to = {'seller/profile'} ><h3>Profile</h3></Segment>
            <Segment padded = 'very' as = {Link} to = {'seller/suggestion'}><h3>Give a suggestion :)</h3></Segment>
            
            
          </Grid.Column>
          </Grid.Row>
      </Grid>
        </Container>
                //TODO: seller page here
               
            </div>
        )
    
}

