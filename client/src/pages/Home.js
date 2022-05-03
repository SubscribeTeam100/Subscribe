import React from 'react'
import {useQuery} from '@apollo/react-hooks'
import gql from 'graphql-tag'

import { Container, Grid,  Loader } from 'semantic-ui-react'
import ProductCard from '../components/ProductCard'
function Home(){
    console.log('avc')
    const {loading, data:{getProducts: products} = {}} = useQuery(get_products)
    if(!loading){
      console.log(products)
    }
    let width = window.innerWidth
    console.log('screewidth :', width)
    
    return (
       <Container>
            <Grid  container columns = {(width < 700) ? 1 : 5} >
            <h1>The current width is : {width}</h1>
            <Grid.Row>
              
            </Grid.Row>
            <Grid.Row>
           {loading?(<h1><Loader/></h1>) :(
               products &&
               products.map((product)=>(
                 
                      <Grid.Column key = {product.id} style={{ height: "auto"}}>
                  
                  <ProductCard product = {product}/>
              </Grid.Column>
                 
               )
                  
                  
               )
               
           )}
            
            
            
          </Grid.Row>
          </Grid>
          
       </Container>)
}


const get_products = gql`

{
  getProducts{
    id
    name
   	isVisible
    reviewPoints
    overallRating
    sellerID
    description
    ImageLink
  }
} 


`

export default Home;