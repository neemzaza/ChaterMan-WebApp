import React, { useEffect, useState } from 'react'
import './scss/App.scss'
import contentInNav from './components/Navbar'
// import googleOneTap from 'google-one-tap'
// import testerPage from './TesterPage'

import Welcome from './page/Welcome'
import LoadingPage from './page/LoadingPage'
import Prototype1 from './page/Prototype1'
import OverChat from './page/OverChat'
import doSetAlert from './components/popup/AlertPopUp'
import ProfilePage from './page/ProfilePage'
import Hub from './page/Hub'
import ServerOffline from './components/ServerOffline'
import Disabled from './page/Disabled'
import Selectchat from './page/SelectChat'
import ServerStatus from './page/ServerStatus'

import render from 'preact-render-to-string'
import $ from 'jquery'
import countryCodeData, { acceptAgree, setBoolReqData } from './global/CookieAndDataReq'

import { Switch, Route, Redirect, BrowserRouter as Router } from 'react-router-dom'

import { auth, url } from './global/Database'
import axios from 'axios'

import { useAuthState } from 'react-firebase-hooks/auth'

import AccountSetting from './page/AccountSetting'

export default function App() {
  const [user] = useAuthState(auth)

  const [warnCountry, setWarnCountry] = useState("English")
  const [internetStatus, setInternetStatus] = useState("Online")
  const [successToConn, setSuccessToConn] = useState(null)

  const [activateState, setActivateState] = useState(false)

  const getActiveStatus = () => {
    axios.get(`${url}get-user?uid=${user.uid}`).then((res) => {
      setActivateState(res.data[0].activate)
    })
  }

  const hasOffline = () => {
    axios.get(`${url}`)
      .then((data) => {
        setSuccessToConn(data.data)
        if (data.data) {
          console.log("Success to Conn to DB? : " + data.data)
          $(".offlineGroup").css("display", "none")
        }
      })
      .catch((err) => {
        // console.log("Failed to Conn to DB")
        if (err) {
          $(".offlineGroup").css("display", "block")
        }
        // doSetAlert()
      })
  }

  useEffect(() => {
    // console.log(successToConn)
    const userCookie = document.cookie
    const cookieData = userCookie.split('; ').toString()
    const cookieChoose = cookieData.slice(0, 14)

    if (cookieChoose !== "hasCountryData") {
      $("#globalPage").css("top", "6%")
    }

    if (setBoolReqData) {
      $("#welcomePage").css("display", "none")
    } else {
      $("#welcomePage").css("display", "block")
    }

    // hasOffline()

  }, []) // <==

  useEffect(() => {
    axios.get(`${url}`)
      .then((data) => {
        setSuccessToConn(true)
        // if (data.data) {
          console.log("Success to Conn to DB? : " + data.data)
          $("#offlineGroup").css("display", "none")
        // }
      })
      .catch((err) => {
        // console.log("Failed to Conn to DB")
        // if (err) {
          setSuccessToConn(false)
          $("#offlineGroup").css("display", "block")
        // }
        // doSetAlert()
      })
  }, [])

  window.addEventListener('online', () => {
    setInternetStatus("Online")
  })

  window.addEventListener('offline', () => {
    doSetAlert()
    setInternetStatus("Offline")
  })

  if (internetStatus === "Offline") {
    $("#globalPage").css("display", "block")
    $("#globalPage").css("background", "rgba(255, 255, 0, 0.7)")
  } else if (internetStatus === "Online") {
    $("#globalPage").css("background", "rgba(0, 255, 0, 0.7)")
  }

  $("#dock").on('mouseover', () => {
    $("#dock").css("opacity", "100%")
  })

  $("#dock").on('mouseout', () => {
    setTimeout(() => {
      $("#dock").css("opacity", "60%")
    }, 4000)
  })


  // import { h } from 'preact'

  let enableLogs = true

  // function seeAdvLogs() {
  //     enableLogs = !enableLogs
  //     console.log("Set enableLogs to " + enableLogs)
  // }

  const checkWhenDockHide = () => {
    // --------------[SECTION I]--------------- //
    $("#iconDrop").addClass("buttonMenu")
    $("#dock").addClass("buttonMenu")

    $(".wooTransit").html(`${iconSec}`)
    $("#dock").addClass("dockhide")
    $("#dock").removeClass("dock")
    // ----------------------------------------- //
  }


  const checkWhenDockShow = () => {
    // --------------[SECTION I]--------------- //
    // $("#dock").css("left", "14%")
    // $("#dock").css("width", "70vw")
    // $("#dock").css("height", "100px")
    // $("#dock").css("background", "#e6e6e6")
    $("#dock").addClass("dock")
    // ----------------------------------------- //

    // --------------[SECTION II]-------------- //
    $("#dock").css("display", "block")
    $("#dock").addClass("animate__flipInX")
    $("#dock").removeClass("animate__flipOutX")
    $("#dock").removeClass("dockhide")
    // ----------------------------------------- /
    // --------------[SECTION XT]-------------- //
    
    $(".wooTransit").html(converted)


    // ----------------------------------------- //
    // isActiveMenu = true

  }

  const contentReturnFunc = contentInNav()

  const converted = render(contentReturnFunc)
  // console.log(typeof JSON.parse(converted))
  const iconSec = render(<div><i class="bi bi-menu-app-fill iconMenuDrop"></i></div>)

  let isActiveMenu = true

  $(".body").on('scroll', () => {
    $(".buttonMenu").on('click', () => {
      if (enableLogs) console.log("Clicked")
      isActiveMenu = !isActiveMenu

      if (isActiveMenu) { // Hide Dock
        if (enableLogs) console.log("enable checker was worked!")
        checkWhenDockHide()
      } else { // Show Dock
        if (enableLogs) console.log("disable checker was worked!")

        $("#iconDrop").css("border", "2px solid red")
        $("#dock").removeClass("buttonMenu")
        $("#iconDrop").removeClass("buttonMenu")
        checkWhenDockShow()

      }
    })
    ///* DOCK NOT SHOW */ //
    if ($("#spy").offset().top >= ($(document).height() / 5) && isActiveMenu) {
      checkWhenDockHide()
      $("#back-to-top").css("left", "95%")
    } else {
      ///* DOCK HAS SHOWED */ //
      // $("#dock").css("display", "none")
      $("#back-to-top").css("left", "1000%")
      checkWhenDockShow()

    }

    if ($("#spy").offset().top < ($(document).height() / 5)) {
      isActiveMenu = true
    }

    $(".iconMenuDrop").on('click', () => {
      isActiveMenu = !isActiveMenu
    })

  })

  if (user) {
    getActiveStatus()
  }

  const gotoPage = (page) => {
    return (
      <section>
        <section id="offlineGroup" className="offlineGroup">
        <ServerOffline />
        <div className="blackBg"></div>
        </section>
        {user && successToConn ? (activateState ? page : <Disabled />) : <LoadingPage />}
      </section>
    )
  }

  return (
    <Router>
      {/* When offline this was visible */}

      {/* SPY */}
      <nav className="navbar fixed-top" id="spy"></nav>

      {/* warning popUp */}
      <div className="popupWarn card animate__animated" id="welcomePage">
        {/* popUp Suggested */}
        <h3><i class="fas fa-cookie-bite"></i>         <i class="fas fa-globe-asia"></i></h3>
        <h3>{warnCountry === "Thai" ? "การใช้ Cookie" : "Cookie"}</h3>
        <p>{warnCountry === "Thai" ? "เราต้องการขอสิทธิ์ในการใช้ข้อมูลประเทศของคุณบันทึกลงไปในคุกกี้ (Cookie) เพื่อปรับภาษาของหน้าเว็บให้เข้ากับภูมิประเทศที่คุณอยู่และประโยชน์อื่นๆ" : "We want permission to collect your country data and save in cookies to adapt webpage language to your regions and other usage"}</p>
        <div class="btn-group dropup">
          <button type="button" class="btn btn-primary">{warnCountry}</button>
          <button type="button" class="btn btn-light dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
            <span class="visually-hidden">Toggle Dropdown</span>
          </button>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="#" onClick={() => { setWarnCountry("English") }}>English</a></li>
            <li><a class="dropdown-item" href="#" onClick={() => { setWarnCountry("Thai") }}>Thai</a></li>
          </ul>
        </div>
        <hr />
        <a class="btn btn-success btn-sm" href="#" role="button" onClick={acceptAgree}><i class="bi bi-check"></i>{warnCountry === "Thai" ? "ใช้ได้เลย!" : "Accept"}</a>&nbsp;
      </div>

      {/* Online warning */}
      <div className="popupWarn card animate__animated" id="globalPage">
        {/* popUp Suggested */}
        {internetStatus === "Online" ? <i class="bi bi-check2"></i> : <i class="bi bi-exclamation-lg"></i>}
        {internetStatus === "Online" ? "SOLVED" : "WARNING"}
        <hr />
        <div className="row"><div className="col-sm-9"><h4>{internetStatus === "Offline" ? <i class="bi bi-wifi-off"></i> : <i class="bi bi-wifi"></i>}  {internetStatus}</h4></div>
          <div className="col-sm-3">{internetStatus === "Online" ? <a className="btn btn-close red" onClick={() => $("#globalPage").css("display", "none")}></a> : ""}</div>
        </div>
        <p>{internetStatus === "Offline" ? "lost to connect with your internet..." : "Now, you can continue!"}</p>
        {internetStatus === "Offline" ? <div className="fixIssueNet">
          <li>Check your router</li>
          <li>Check your internet connection on your device</li>
          <li>Restart your device</li>
          <li>Call to your internet service</li>
        </div> : ""}
        <hr />
      </div>

      {/* Dock */}
      {/* <nav className="navbar navbar-expand-sm fixed-bottom dock animate__animated" id="dock">
        {contentInNav()}

      </nav> */}

      {/* Back to top btn */}
      <a href="/#" className="back-to-top container" id="back-to-top"><i class="fontExplorerX bi bi-arrow-bar-up"></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a>

      {/* Global Page */}
      <Switch>
         {/* Welcome */}
        <Route path="/" exact>
          <Welcome />
        </Route>
        {/* When signed in */}
        <Route path="/hub">
          {gotoPage(<Hub />)}
          {/* {user && successToConn ? (activateState ? <Hub /> : <Disabled />) : <LoadingPage />} */}
        </Route>
        {/* Test1 */}
        <Route path="/prototype1">
          <Prototype1 />
        </Route>
        {/* Settings Page */}
        <Route path="/settings">
          {gotoPage(<AccountSetting />)}
          {/* {user && successToConn ? <AccountSetting /> : <LoadingPage />}  */}
        </Route>

        <Route path="/status">
          <ServerStatus />
          {/* {user && successToConn ? <AccountSetting /> : <LoadingPage />}  */}
        </Route>

        {/* WIP chat */}
        <Route path="/in-chat">
          {gotoPage(<OverChat />)}
          {/* {user && successToConn ? <OverChat /> : <LoadingPage />} */}
        </Route>
        {/* WIP profile */}
        <Route path="/profile">
          {gotoPage(<ProfilePage />)}
          {/* {user && successToConn ? <ProfilePage /> : <LoadingPage />} */}
        </Route>

        <Route path="/select-chat">
          {gotoPage(<Selectchat />)}
        </Route>

        {/* When status 404 */}
        <Route component={NotFound} />
      </Switch>


    </Router>
  )
}

// Not Found Page
function NotFound() {
  return (
    <div>
      <h1>Not Found</h1>
    </div>
  )
}
