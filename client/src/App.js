import React from 'react';
import styled from 'styled-components';
import {BrowserRouter as Router, Route} from 'react-router-dom'
import Home from './pages/Home'
import {SignupForm} from './pages/Register'
import {Promotedproducts} from '../src/pages/promotedproducts'
import Search from './pages/Search'
import NavBar from './components/NavBar'
import {AccountBox} from './components/index'
import 'semantic-ui-css/semantic.min.css'
import './App.css';

function App() {
  return (
<Router>
      <NavBar/>
      <Route exact path = '/' component= {Home}/>
      <Route exact path = '/login' component= {AccountBox}/>
      <Route exact path = '/Register' component= {SignupForm}/>
      <Route exact path = '/Search' component = {Search}/>
      <Route exact path = '/' component= {Promotedproducts}/>
</Router>
  );
}

export default App;
