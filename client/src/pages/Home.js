import React from 'react'
import {useQuery} from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { Container, Grid,  Loader } from 'semantic-ui-react'
import ProductCard from '../components/ProductCard'

function Home() {
    const {loading, data:{getProducts: products} = {}} = useQuery(get_products)
    return (
       <Container>
            <Grid columns = {5}>
            <Grid.Row>
            </Grid.Row>
            <Grid.Row>
           {loading?(<h1>LOADING....</h1>) :(
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
       </Container>
       )
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
  }
} 
`
export default Home;