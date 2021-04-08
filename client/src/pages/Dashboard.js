import React,{useContext} from 'react'
import {Grid, Segment, Container } from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import { AuthContext } from "../context/auth"
function Dashboard() {
  const { user } = useContext(AuthContext);




  return (
    <div>
        //TODO: add icons and short descriptions
    <Container textAlign = 'center' >
    <Grid divided >
    <Grid.Row stretched>
      <Grid.Column stretched>
        <Segment padded = 'very' as={Link} to = {'dashboard/profile'}><h3>Profile</h3>
            
        </Segment>
      </Grid.Column>
      </Grid.Row>
      </Grid>
      <Grid columns = {1} >
      <Grid.Row stretched>
      <Grid.Column >
        <Segment padded = 'very' as = {Link} to = {user.isSeller?'dashboard/seller': '/BeASeller-ref-dashboard'}><h3>{user.isSeller? 'Selling' : 'Become a Seller'}</h3></Segment>
        <Segment padded = 'very' as={Link} to = {'dashboard/subscriptions'}><h3>Subscription</h3></Segment>
      
        
        
        
      </Grid.Column>
      </Grid.Row>
  </Grid>
    </Container>
      
    </div>);
}

export default Dashboard;