import React from 'react';

import {BrowserRouter as Router, Route} from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Search from './pages/Search'
import NavBar from './components/NavBar'

import 'semantic-ui-css/semantic.min.css'
import './App.css';
function App() {
  return (
    <Router>
      <NavBar/>
      <Route exact path = '/' component= {Home}/>
      <Route exact path = '/login' component= {Login}/>
      <Route exact path = '/Register' component= {Register}/>
      <Route exact path = './Search' component = {Search}/>
      
    </Router>
  );
}

export default App;
