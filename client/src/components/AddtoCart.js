import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/auth'
import gql from 'graphql-tag'
import { Button } from 'semantic-ui-react'


function AddtoCart(id, user, addtoCart) {


  if (localStorage.getItem('cart')) {
    cart = JSON.parse(localStorage.getItem('cart'));
    let itemTobeAdded = cart.find((cartitem) =>
      cartitem.productID == id

    )

    if (itemTobeAdded) {

      itemTobeAdded.quantity++;

    }
    else {
      cart.unshift({ "productID": id, "quantity": 1 })
    }

    localStorage.removeItem('cart');
    localStorage.setItem('cart', JSON.stringify(cart));

  } else {
    var cart = [{ "productID": id, "quantity": 1 }];
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  if (user) {
    addtoCart(id)
  }

}



export default AddtoCart;