import React, { useState, useContext } from "react";
import {
  BoldLink,
  BoxContainer,
  FormContainer,
  Input,
  MutedLink,
  SubmitButton,
} from "../components/common";
import { Marginer } from "./Marginer";
import { AccountContext } from "../components/AccountContext";
import { useForm } from "../util/submitbutton";
import gql from "graphql-tag";
import { Form } from "semantic-ui-react";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { withRouter } from "react-router-dom";
import { AuthContext } from "../context/auth";



function pushUserCarttoStorage(result) {
  let cartItemsfromServer = result.data.login.Cart;
  if(!cartItemsfromServer ){
   
    return;
  }
  
  
  if (localStorage.getItem("cart")) {
    let cartitems = JSON.parse(localStorage.getItem("cart"));
    for (let i in cartItemsfromServer) {
      let itemTobeAdded = cartitems.find((cartitem) =>
        cartitem.productID == cartItemsfromServer[i].productID

      )
      if(itemTobeAdded){
        itemTobeAdded.quantity = itemTobeAdded.quantity+ cartItemsfromServer[i].quantity;
        
      }
      else{
        cartitems.unshift({"productID": cartItemsfromServer[i].productID,"quantity": cartItemsfromServer[i].quantity});
      }
    }
    localStorage.removeItem("cart");
    localStorage.setItem("cart", JSON.stringify(cartitems));
  }
  else{
    var cart = []
    for(let i in cartItemsfromServer){
      cart.unshift ({"productID":cartItemsfromServer[i].productID, "quantity": cartItemsfromServer[i].quantity})
    }
    localStorage.setItem('cart', JSON.stringify(cart))
  }
 
}



function LoginForm(props) {
  
  const { switchToSignup } = useContext(AccountContext);
  const [errors, setErrors] = useState({});
  const loginContext = useContext(AuthContext);
  const { onChange, onSubmit, values } = useForm(loginUserCallback, {
    email: "",
    password: "",
  });
  
  // const pushStoragetoCart = (result) =>{
  //   let arrayOfproductIDs = []
  //   let cartItemsfromServer = result.data.login.Cart;
  //   let cartItems = JSON.parse(localStorage.getItem("cart"));
  //   if(!cartItems){
  //     return;
  //   }
  //   else{
  //     for(let i in cartItems){
  //      let currentcartItemfromServerSameProduct = cartItemsfromServer.find((currentItem)=> currentItem.productID == cartItems[i].productID);
  //      let productID = (cartItems[i].productID)
  //       if(!currentcartItemfromServerSameProduct){
  //         if(loadingaddtocart){
  //           setTimeout(() =>{console.log('waiting....')}, 1000)
  //         }
  //         console.log("found product not in server, product ID from localCart", cartItems[i].productID)
  //         console.log("current productID",productID)
  //         arrayOfproductIDs.unshift(productID)
          
           
  //       }
       
  //     }
  //     for(let i in arrayOfproductIDs){
  //     if(loadingaddtocart){
  //       setTimeout(()=>{console.log('waiting....')}, 2000)
  //     }
  //     if(!loadingaddtocart){
  //       addtoCartcallback({variables:{productID: arrayOfproductIDs[i]}})
  //       console.log('sending productID ', arrayOfproductIDs[i])
  //     }

  //   }
  //   }
  // }
  


  let [addtoCartcallback,{loading: loadingaddtocart}] = useMutation(ADDTOCART,{
    update(_,result){
        
      
    },
    onError(err){
      
       alert('error')
       
    }
   

})
const implementRedirectfromProduct = () => {
  let productID = localStorage.getItem("redirectfromproduct");
  if (productID) {
    
    let cartItems = JSON.parse(localStorage.getItem("cart"));
    if (cartItems) {
      let itemTobeAdded = cartItems.find(
        (cartitem) => cartitem.productID == productID
      );
      if (itemTobeAdded) {
       localStorage.removeItem(itemTobeAdded)
        return;
      } else {
        cartItems.unshift({ productID: productID, quantity: 1 });
        addtoCartcallback({ variables: { productID: productID } });
      }
    } else {
      cartItems = [];
      addtoCartcallback({ variables: { productID: productID } });
      cartItems.unshift({ productID: productID, quantity: 1 });
    }
    localStorage.removeItem('cart')
    localStorage.setItem("cart", JSON.stringify(cartItems));
    localStorage.removeItem("redirectfromproduct");
  }
};
  let [LoginUser, { loading: loadingLogin }] = useMutation(LOGINUSER, {
    update(proxy, result) {
      loginContext.login(result.data.login);
     
      pushUserCarttoStorage(result);
      implementRedirectfromProduct();
      // pushStoragetoCart(result)

      props.history.push("/");
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });

  function loginUserCallback() {
    LoginUser();
  }
  
  function handlekeypress(e){
    if(e.charCode == 13){
      //TODO:: 0.6 
    }
  }
  

  return (
    <div>
      <Form
        onSubmit={onSubmit}
        noValidate
        className={loadingLogin ? "loading" : ""}
      >
        <BoxContainer>
          <FormContainer>
            <Input
              type="text"
              name="email"
              placeholder="Email"
              value={values.email}
              onChange={onChange}
            />
            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={values.password}
              onChange={onChange}
            />
          </FormContainer>
          <Marginer direction="vertical" margin={10} />
          <MutedLink href="#">Forget your password?</MutedLink>
          <Marginer direction="vertical" margin="1.6em" />
          <SubmitButton type="submit" onKeyPress = {handlekeypress}>Signin</SubmitButton>
          <Marginer direction="vertical" margin="1em" />
          <MutedLink href="#" onClick={switchToSignup}>
            Don't have an account?{" "}
            <BoldLink href="#" onClick={switchToSignup}>
              Signup
            </BoldLink>
          </MutedLink>
        </BoxContainer>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const LOGINUSER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      username
      isSeller
      token
      Cart{
        productID
        quantity
      }
    }
  }
`;
const ADDTOCART = gql`
    mutation addtoCart($productID: ID!){
        addtoCart(productID: $productID)
    }


`
export default withRouter(LoginForm);
