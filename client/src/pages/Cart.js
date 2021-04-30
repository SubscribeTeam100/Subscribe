import React, { useState, useContext } from "react";
import { AuthContext } from "../context/auth";
import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { Loader, Segment, Grid, Input, Icon, Button , Card, Dropdown, Container} from "semantic-ui-react";

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
  const [addSubscription, {loading:addSubLoading}] = useMutation(ADD_SUBSCRIPTION,{
    update(_,result){
      console.log('result =', result)
      //TODO: removing item from localcart
        
      window.location.replace(result.data.addSubscription)


    },onError(err){
      alert('error')
      console.log("addSubscriptionError:", err)
    }
  })
  const {data: userAddressesdata, loading: getUserAddresses_loading} = useQuery(GET_ADDRESSES);

  if (loading || LOADINGPRODUCTINFO|| getUserAddresses_loading) {
    return <Loader active/>;
  }
  if (!loading && !LOADINGPRODUCTINFO && !addSubLoading && !getUserAddresses_loading) {
    cartItems = cartdata.getCart;
    products = data.getProductfromCart;
    
  }

  if(addSubLoading){
    return(
      <div>
        <Container>
          <div>Hang in Tight! We're processing your subscription!</div>
          <div><Loader active/></div>
        </Container>
      </div>
    )
  }
  
  
  function CartProductCard(product) {
    const LocalCart = JSON.parse(localStorage.getItem("cart"));
    product = product.product;
    let addresses = userAddressesdata.getUserAddresses
    console.log(addresses)
    const getQuantity = (productid) => {
      let asd = LocalCart.find((item) => item.productID == productid);
      return asd.quantity;
    };
    let a = (getQuantity(product.id))
    const frequncyoptions = [
      { key: 1, text: 'DAY', value: "DAY" },
      { key: 2, text: 'WEEK', value: "WEEK" },
      { key: 3, text: '2 WEEKS', value: 'BIWEEKLY' },
      {key: 4, text: 'MONTH', value: 'MONTH'}
    ]
    const [quantity, setQuantitys] = useState(a);
    const [activeAddress,setactiveAddress] = useState(addresses[0].id)
    const [frequency, setFrequency] = useState('MONTH')

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
      let localCart = JSON.parse(localStorage.getItem("cart"))
      let changelocalCart = localCart.find((item) => item.productID == event.target.name);
      console.log(changelocalCart)
      localCart = localCart.filter(cartitem => cartitem.productID !== changelocalCart.productID);
      localStorage.removeItem('cart')
      localStorage.setItem("cart", JSON.stringify(localCart))
      
    }
    function subscribe(){
      console.log(product)
      addSubscription({variables:{productID: product.id, addressID:activeAddress, frequency:frequency, sellerID: product.sellerID, quantity: quantity }})
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
        <h4>Deliver to: </h4>
          
        <Grid columns = 'equal'>
          <Grid.Row>
            
            {(addresses.length>0)? 
              (addresses.map(address=>(
                
                <Grid.Column>
                  
                  <Card onClick = {()=>setactiveAddress(address.id)} color = {activeAddress === address.id? 'green' : 'red'} fluid>
                  <div style = {{padding: '2px'}}>
                  <p>{address.name}</p>
                  <p>{address.Address1}</p>
                  <p>{address.city}</p>
                  <p style = {{color : 'green'}}>{activeAddress === address.id? <Icon name = 'check'></Icon>: <Icon name = 'close' color = 'red'/>}</p>
                  </div>
                </Card>
                </Grid.Column>
              )))
            :(<div>  <p/>Please <a href = '../dashboard/addAddress'>add a delivery address</a> </div>)}
          </Grid.Row>
        </Grid>
        <Grid>
                <Grid.Row>
                 <span><h4>Deliver every: </h4>  <Dropdown text = {frequency} options = {frequncyoptions} onChange = {(event) =>{setFrequency(event.target.value)}} defaultValue = {4} direction = 'right'/></span>
                </Grid.Row>
        </Grid>
        
        <Grid>
        <Grid.Row>
        <Button onClick = {subscribe} primary>Subscribe with PayPal! <Icon name = 'paypal' /> <Icon name = 'paypal card'></Icon></Button>
        </Grid.Row>
        </Grid>
        <hr/>
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
      <div id="cart-wrap" style ={{padding: '30px'}}>
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


const ADD_SUBSCRIPTION = gql`
  mutation addSubscription($productID: String!, $addressID: String!, $frequency:String!, $sellerID:String!, $quantity: Int! ){
    addSubscription(subscriptionInput:{productID: $productID, addressID: $addressID, frequency:$frequency, sellerID:$sellerID, quantity: $quantity})
  }
`

const GET_CART_PRODUCT_INFO = gql`
  query getProductfromCart {
    getProductfromCart {
      name
      price
      id
      sellerID
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