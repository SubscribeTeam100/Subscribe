import React from 'react';
import styled from 'styled-components';
import {BrowserRouter as Router, Route} from 'react-router-dom'
import Home from './pages/Home'
import SignupForm from './pages/Register'
import Search from './pages/Search'
import NavBar from './components/NavBar'
import {AccountBox} from './components/index'
import 'semantic-ui-css/semantic.min.css'
import './App.css';
import AddProductForm from './components/FormComponents/addProductForm'
import {AuthProvider} from './context/auth'
import AuthRouteifLoggedIn from './context/AuthRoute'
import ProductPage from './pages/ProductPage'
import Cart from './pages/Cart'
import Dashboard from './pages/Dashboard'
import ProfilePage from './pages/profile'
import ManageSubscription from './pages/ManageSubscription'
import SellerDashboard from './pages/sellerDashboard'
import SellerPage from './pages/Seller'
import Subscriptions from './pages/Subscriptions'
import AddAddressForm from './components/FormComponents/addAddressForm'
import Success from './pages/Sucess'
function App() {
  return (
    <AuthProvider>
      <Router>
      <NavBar/>
      <Route exact path = '/' component= {Home}/>
      <AuthRouteifLoggedIn exact path = '/login' component= {AccountBox}/>
      
      <Route exact path = '/p/:productID' component = {ProductPage} />
      <Route exact path = './Search' component = {Search}/>
      <Route exact path = '/addProduct' component = {AddProductForm}/>
      <Route exact path = '/Cart' component = {Cart} />
      <Route exact path = '/dashboard' component = {Dashboard} />
      <Route exact path = '/dashboard/profile' component = {ProfilePage} />
      <Route exact path = '/subscriptions/:subscriptionID' component = {ManageSubscription} />
      <Route exact path = '/seller/:sellerID' component = {SellerPage} />
      <Route exact path = '/dashboard/addAddress' component = {AddAddressForm} />
      <Route exact path = '/dashboard/subscriptions' component = {Subscriptions} />
      <Route exact path = '/dashboard/seller' component = {SellerDashboard} />
      <Route exact path = '/success' component = {Success} />
    </Router>
    </AuthProvider>
  );
}

export default App;
