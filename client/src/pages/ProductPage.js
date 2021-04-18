import React, {useContext} from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { Loader, Grid, Image, Button, Container } from "semantic-ui-react";
import AddtoCart from "../components/AddtoCart";
import ImageCard from "../components/ImageCard";
import {AuthContext} from '../context/auth'
import {useMutation} from '@apollo/react-hooks'
import {Redirect} from 'react-router-dom'
function ProductPage(props) {
  const id = props.match.params.productID;
  const { loading, error, data } = useQuery(FETCH_PRODUCT, {
    variables: {
      productId: id,
    },
  });
  
  const {user} = useContext(AuthContext);
  const[addtoCart,{loadingaddtocart}] = useMutation(ADDTOCART,{
    update(_,result){
      // props.history.push('../cart')
    },
    onError(err){
       
    },
    variables:{
        productID:id
    }

})
const handleClick=(e)=>{
    e.preventDefault()
    AddtoCart(id, user, addtoCart)
  }

  const redirectTohome = () =>{
    localStorage.removeItem('redirectfromproduct')
    localStorage.setItem('redirectfromproduct', id)
    props.history.push('/login')
  }
  if (loading) {
    return <Loader />;
  } else {
    
    const product = data.getProduct;
    if(!product){
      return(<div>Cannot find Product. Error 404. <a href = '../../'>GO HOME</a></div>)
    }
    return (
      <div className="produt-row">
        <Grid>
          <Grid.Column width={4}>
            <ImageCard ImageLink={product.ImageLink} />
          </Grid.Column>
          <Grid.Column width={9}>{product.description}</Grid.Column>
          <Grid.Column width={3}>
            <Container>
              <Button primary onClick = {user?handleClick: redirectTohome}>Add to Cart</Button>
            </Container>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

const FETCH_PRODUCT = gql`
  query getProduct($productId: ID!) {
    getProduct(productId: $productId) {
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

const ADDTOCART = gql`
    mutation addtoCart($productID: ID!){
        addtoCart(productID: $productID)
    }


`

export default ProductPage;

