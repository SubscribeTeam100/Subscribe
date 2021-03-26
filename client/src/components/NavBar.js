import React, { useState } from 'react'
import { Icon, Menu, Segment } from 'semantic-ui-react'
import {Link} from 'react-router-dom'

function NavBar() {
  const currentpage = window.location.pathname
    var pathname = currentpage.slice(1)
    if(pathname === ''){
        pathname = 'home'
    }
  
    const [activeItem, setActiveItem] = useState(pathname)

  const handleItemClick = (e, { name }) => setActiveItem(name)

  

    return (
      <div className='navbar'>
        <Menu attached='top' tabular size = 'huge'>
          <Menu.Item
            name='home'
            active={activeItem === 'home'}
            onClick={handleItemClick}
            as= {Link}
            to= '/'
            style = {activeItem === 'home'?{ color: 'gray'} : {color:'white'}} 
          >
            Home
          </Menu.Item>

          <Menu.Item
            name='Login'
            active={activeItem === 'Login'}
            onClick={handleItemClick}
            as= {Link}
            to= '/login'
            style = {activeItem === 'Login'?{ color: 'gray'} : {color:'white'}} 
          >
            You
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
              <div className='search'>
                <Icon name='search'/>
                Search
              </div>
            </Menu.Item>
          </Menu.Menu>
        </Menu>
      </div>
      
    )
  
}

export default NavBar