import React, { useState, useContext } from 'react'
import { Icon, Menu, Segment } from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import {AuthContext} from '../context/auth'
import Cart from '../pages/Cart'

function NavBar() {
  const currentpage = window.location.pathname
    var pathname = currentpage.slice(1)
    if(pathname === ''){
        pathname = 'home'
    }

    const {user, logout} = useContext(AuthContext);
  
    const [activeItem, setActiveItem] = useState(pathname)

  const handleItemClick = (e, { name }) => setActiveItem(name)

  

    return (
      <div className='navbar'>
        <Menu attached='top' tabular size = 'huge'>
          <Menu.Item
            name='home'
            active={activeItem === 'home'}
            onClick={user? logout : handleItemClick}
            as= {Link}
            to= '/'
            style = {activeItem === 'home'?{ color: 'gray'} : {color:'white'}} 
          >
            Home
          </Menu.Item>

          
          <Menu.Menu position='right'>
          
            <Menu.Item
              name='Search'
              active={activeItem === 'Search'}
              onClick={handleItemClick}
              as = {Link} 
              to = '/Search'
              style = {activeItem === 'Search'?{ color: 'gray'} : {color:'white'}} 
               
            >
                
              <Icon name='search'  />
              Search
            </Menu.Item>
            <Menu.Item 
            name={user? "Logout" : "Login"}
            active={activeItem === 'Login' || activeItem ==='Logout'}
            onClick={handleItemClick}
            as= {Link}
            to= {"/login"}
            style = {activeItem === 'Login'|| activeItem === 'Logout'?{ color: 'gray'} : {color:'white'}} 
          >
           {user? "Logout" : "Login/Signup"}
         </Menu.Item>
         
         <Menu.Item 
            name='Cart'
            active={activeItem === 'Cart'}
            onClick={handleItemClick}
            as= {Link}
            to= '/Cart'
            style = {activeItem === 'Cart'?{ color: 'gray'} : {color:'white'}} 
          >
           Cart {Cart.numberofItems}
         </Menu.Item>
          </Menu.Menu>
        </Menu>
      </div>
      
    )
  
}

export default NavBar