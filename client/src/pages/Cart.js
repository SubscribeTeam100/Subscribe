import React, { useState, useContext } from "react";
import { AuthContext } from "../context/auth";
import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { Loader, Segment, Grid, Input, Icon, Button } from "semantic-ui-react";

export default function Cart(props) {
  let products = [];
  let cartItems = [];
 
  const [error, setError] = useState({});
  const { user } = useContext(AuthContext);
  if (!user) {
    props.history.push("/login");
  }
  
  
  const { loading: LOADINGPRODUCTINFO, data } = useQuery(GET_CART_PRODUCT_INFO);
  const { loading, data: cartdata } = useQuery(GET_CART);
  const [changeQuantitycallback, { loading: loadingQuantity }] = useMutation(
    Change_Quantity,
    {
      update(_, result) {
        
      
      },
      onError(err) {
        console.log("error:", err);
      },
    }
  );
  const [removeItemCallback, {loading: loadingRemoveItem}] = useMutation(
    Remove_Item,{
      update(_,result){
       window.location.reload(true)
      },onError(err){
        alert("error");
        console.log("removeItemError: ", err)
      }
    }
  )

  if (loading || LOADINGPRODUCTINFO) {
    return <Loader />;
  }
  if (!loading && !LOADINGPRODUCTINFO) {
    cartItems = cartdata.getCart;
    products = data.getProductfromCart;
  }
  
  
  function CartProductCard(product) {
    const LocalCart = JSON.parse(localStorage.getItem("cart"));
    product = product.product;
    //TODO: maybe update cart
    const getQuantity = (productid) => {
      let asd = LocalCart.find((item) => item.productID == productid);
      return asd.quantity;
    };
    let a = (getQuantity(product.id))
    const [quantity, setQuantitys] = useState(a);

   

    function changeQuantity(event) {
      event.preventDefault();
      if (loadingQuantity) {
        return <Loader />;
      }
      if (event.target) {
        if (!event.target.value) {
          changeQuantitycallback({
            variables: { productID: event.target.name, quantity: 1 },
          });
        } else {
          changeQuantitycallback({
            variables: {
              productID: event.target.name,
              quantity: parseInt(event.target.value),
            },
          });
        }
        setQuantitys(parseInt(event.target.value));

        let changeLocalCart = LocalCart.find(
          (item) => item.productID == event.target.name
        );
        changeLocalCart.quantity = parseInt(event.target.value);

        localStorage.removeItem("cart");
        localStorage.setItem("cart", JSON.stringify(LocalCart));
        
      }
    }
    function handleremoveItem(event){
    
      console.log("handleremoveItrem",event);
      removeItemCallback({variables:{productID: event.target.name}})
      let localcart = JSON.parse(localStorage.getItem("cart"))
      let changelocalCart = LocalCart.find((item) => item.productID == event.target.name);
      console.log(changelocalCart)
      localcart = localcart.filter(cartitem => cartitem.productID !== changelocalCart.productID);
      localStorage.removeItem('cart')
      localStorage.setItem("cart", JSON.stringify(localcart))
      
    }
   
    return (
      <div key={product.id} >
        <div className="product">
          <Grid columns="equal">
            <Grid.Row>
              <Grid.Column>
                {" "}
                {product.name} 
                <p>{product.price}</p>
              </Grid.Column>
              <Grid.Column>
                <Input
                  type="number"
                  name={product.id}
                  style={{ width: "15vw" }}
                  value={quantity}
                  placeholder={getQuantity(product.id)}
                  onChange={changeQuantity}
                  label="Quantity"
                  
                />
                <p>
                  <Button name = {product.id} onClick = {handleremoveItem}  size = 'tiny'>
                   
                    DeleteItem
                  </Button>
                </p>
              </Grid.Column>
              <Grid.Column>
                
                subtotal: <div className = {product.id}>{(product.price * getQuantity(product.id)).toFixed(2)}</div>
               
               
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
        <Grid></Grid>
        
      </div>
    );
  }
  function GetTotal(products){
    products = products.products
    let total = 0;
  
    
    if(LOADINGPRODUCTINFO){
      return <Loader active/>
    }
    let LocalCart = JSON.parse(localStorage.getItem('cart'))

    const getQuantity = (productid) => {
      let asd = LocalCart.find((item) => item.productID == productid);
      return asd.quantity;
    };
    for(let i in products){
    
      let subtotal = products[i].price * getQuantity(products[i].id)
     total  = (total+subtotal)
      
    }
   

    return (total.toFixed(2));
  }

  function handleCheckout() {
    //TODO: handle Checkout   
    
    console.log("checkout");
  }
 
  
  
  return (
    <div>
      <div id="cart-wrap">
        {products.map((product) => (
          <div className="cart-item">
            <CartProductCard  product={product}/>
            
          </div>
        ))}
        <br></br>
        
        <h3>TOTAL : <GetTotal products = {products}/></h3>    
        <Button primary onClick={handleCheckout}>
          Checkout
        </Button>
      </div>
    </div>
  );
}

const GET_CART_PRODUCT_INFO = gql`
  query getProductfromCart {
    getProductfromCart {
      name
      price
      id
    }
  }
`;
const GET_CART = gql`
  query getCart {
    getCart {
      productID
      quantity
    }
  }
`;

const Change_Quantity = gql`
  mutation changeItemsinCart($productID: ID!, $quantity: Int!) {
    changeItemsinCart(productID: $productID, quantity: $quantity)
  }
`;

const Remove_Item = gql`
  mutation deletefromCart($productID:ID!){
    deletefromCart(productID: $productID)
  }
`;