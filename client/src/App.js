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
    </Router>
    </AuthProvider>
  );
}

export default App;
