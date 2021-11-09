import React from 'react'
import worldIcon from '../img/worldicon.png'
import homeIcon from '../img/homeicon.png'
import utilIcon from '../img/utilityicon.png'

// import { Switch, NavLink, Route, BrowserRouter as Router } from 'react-router-dom'

export default function contentInNav() {
  return (
    <div>
      <div className="container-fluid wooTransit flex">
        <a className="navbar-brand" id="iconDrop" href="/#"><i class="bi bi-menu-app-fill iconMenuDrop activeDrop"></i></a>
        {/* Mobile Here */}
        <div className="flex navbar-menu" id="navbarID">
          <div className="navbar-nav">

            <div className="space"></div>
            <a className="nav-link active" aria-current="page" href="yourhome">
              <img src={homeIcon} alt="Your Home" className="menuIconSec" />
            </a>

            <div className="space"></div>
            <a className="nav-link" aria-current="page" href="prototype1">
              <img src={worldIcon} alt="Discover" className="menuIconSec" />
            </a>

            <div className="space"></div>
            <a className="nav-link" aria-current="page" href="/#">
              <img src={utilIcon} alt="Utility" className="menuIconSec" />
            </a>
            
          </div>
        </div>
        
      </div>
      {/* <br/><br/><br/><br/> <i class="bi bi-house-fill"></i> */ }
    </div>
  )
}

