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
import AddAddressForm from './components/FormComponents/addAddressForm'
import {AuthProvider} from './context/auth'
import AuthRouteifLoggedIn from './context/AuthRoute'


function App() {
  return (
    <AuthProvider>
      <Router>
      <NavBar/>
      <Route exact path = '/' component= {Home}/>
      <AuthRouteifLoggedIn exact path = '/login' component= {AccountBox}/>
      
      <Route exact path = './Search' component = {Search}/>
      
    </Router>
    </AuthProvider>
  );
}

export default App;
