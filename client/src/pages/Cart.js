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
        console.log("changequantity suceessful");
        this.inputRef.current.focus()
      },
      onError(err) {
        console.log("error:", err);
      },
    }
  );

  if (loading || LOADINGPRODUCTINFO) {
    return <Loader />;
  }
  if (!loading && !LOADINGPRODUCTINFO) {
    cartItems = cartdata.getCart;
    products = data.getProductfromCart;
  }

  let total = 0;
  function CartProductCard(product) {
    const LocalCart = JSON.parse(localStorage.getItem("cart"));
    product = product.product;

    const getQuantity = (productid) => {
      let asd = LocalCart.find((item) => item.productID == productid);
      return asd.quantity;
    };
    const [quantity, setQuantitys] = useState(getQuantity(product.id));

    const setQuantity = (value, key) => {
      let quantitytobechanged = LocalCart.find((item) => item.productID == key);
      quantitytobechanged.quantity = value;
    };

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
        setQuantity(event.target.value, event.target.name);

        let changeLocalCart = LocalCart.find(
          (item) => item.productID == event.target.name
        );
        changeLocalCart.quantity = parseInt(event.target.value);

        localStorage.removeItem("cart");
        localStorage.setItem("cart", JSON.stringify(LocalCart));
        setQuantitys(parseInt(event.target.value));
      }
    }

    function handleremoveItem(productid) {
      console.log(productid);
    }

    return (
      <div>
        <div className="product">
          <Grid columns="equal">
            <Grid.Row>
              <Grid.Column>
                {" "}
                {product.name} <p>{product.price}</p>
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
                  ref={this.inputRef}
                />
                <p>
                  <button onClick={handleremoveItem(product.id)}>
                    <Icon type="trash" />
                    removeItem{" "}
                  </button>
                </p>
              </Grid.Column>
              <Grid.Column>
                {" "}
                subtotal: {product.price * getQuantity(product.id)}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
        <Grid></Grid>
      </div>
    );
  }

  function handleCheckout() {
    console.log("checkout");
  }

  let cartItem = null;
  return (
    <div>
      <div id="cart-wrap">
        {products.map((product) => (
          <div className="cart-item">
            <CartProductCard product={product} />
            <h3>Total : {total}</h3>
          </div>
        ))}
        <br></br>
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
