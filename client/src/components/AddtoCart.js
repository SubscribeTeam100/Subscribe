import React, {useState, useContext} from 'react';
import {AuthContext} from '../context/auth'
import gql from 'graphql-tag'
import {Button} from 'semantic-ui-react'


function AddtoCart (id, user, addtoCart) {
    console.log(id)
    
   
    if(user){
        addtoCart(id)
    }
    else{
      if(localStorage.getItem('cart')){
        cart = JSON.parse(localStorage.getItem('cart'));
        cart.unshift(id);
        localStorage.removeItem('cart');    
        localStorage.setItem('cart', JSON.stringify(cart));

      }else{
          var cart = [id];
          localStorage.setItem('cart', JSON.stringify(cart));
      }

    }
   
}



export default AddtoCart;