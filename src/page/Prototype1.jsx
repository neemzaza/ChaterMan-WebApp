import React, { useEffect, useState } from 'react'
import '../scss/App.scss'
import $ from 'jquery'

import testerPage from '../Draft/TesterPage'

export default function Prototype1() {

  const [numberCount, setCount] = useState(0) //กำหนัดค่าเริ่มต้น
  const [alert, setAlert] = useState("")
  const [success, setSuccess] = useState("")

  const [maximumNum, setMaximum] = useState(30)

  const [hasNotSavedNum, isNotSavedNum] = useState(false)

  const minimumNum = 0

  const checkNotSaved = () => {
    if (hasNotSavedNum) {
      setCount(numberCount)
      doSetAlert("Hey! please save config by click submit button", numberCount)
    }
  }


  const increment = () => {
    setCount(numberCount + 1)
    checkNotSaved()
    
  }

  const decrement = () => {
    setCount(numberCount - 1)
    checkNotSaved()
  }

  //Submit Save

  const handleSubmit = event => {
    isNotSavedNum(false)
    event.preventDefault()
    doSetSuccess("Set maximum to " + maximumNum)
    console.log(`set maximum to ${maximumNum}`)
  }

  //Alert

  const doSetAlert = (msg, setNum) => {

    $("#hello1").removeClass("animate__bounceOutUp")
    $("#hello1").addClass("animate__bounceInDown")
    $("#hello1").css("display", "block")
    $("#count").addClass("animate__headShake")
    $("#count").css("color", "red")
    $(".mainBody").addClass("animate__shakeX")
    $(".mainBody").css("filter", "blur(1px)")

    setTimeout(() => {
      $(".mainBody").css("filter", "none")
      $("#count").css("color", "black")
    }, 200)
  
    setAlert(msg + setNum)
  
    setTimeout(function() {
      $(".mainBody").removeClass("animate__shakeX")
      $("#hello1").removeClass("animate__bounceInDown")
      $("#hello1").addClass("animate__bounceOutUp")
      $("#count").removeClass("animate__headShake")
      $(".popupAlert").css("display", "none")
      setAlert("")
    }, 3000)
  }

  const doSetSuccess = (msg) => {

    $("#hello2").removeClass("animate__bounceOutUp")
    $("#hello2").addClass("animate__bounceInDown")
    $("#hello2").css("display", "block")

    setSuccess(msg)
  
    setTimeout(function() {
      $("#hello2").removeClass("animate__bounceInDown")
      $("#hello2").addClass("animate__bounceOutUp")
      $("#hello2").css("display", "none")
      setSuccess("")
    }, 3000)
  }

  //Alwavys

  useEffect(() => {
    if (maximumNum == null) {
      console.log("NaN or Empty (or null)")
    }
    if (numberCount < minimumNum) {
      setCount(minimumNum)
      doSetAlert("Mininum number is ", minimumNum)
      
    } else if (numberCount > maximumNum) {
      setCount(maximumNum)
      doSetAlert("Maxinum number is ", maximumNum)
    }

    if (hasNotSavedNum) {
      $(".saveBtn").css("animation", "carefulAlert 1s infinite")

    } else {
      $(".saveBtn").css("animation", "none")
    }
    
  })
  
  return (
    <div className="mainBody animate__animated">
      
      <div className="popupAlert animate__animated " id="hello1">
        <h4>{alert}</h4>
      </div>

      <div className="popupSuccess animate__animated " id="hello2">
        <h4>{success}</h4>
      </div>
      
      <div class="sidebar">
        <br/>
        <div className="container controlpane">
          <a role="button" className="addnumclass"  onClick={increment}><i class="bi bi-caret-up-fill"></i></a>
          <br/><br/>
          <h1 className="h1Count animate__animated" id="count">{numberCount}</h1>
          <br/>
          <a role="button" className="addnumclass" onClick={decrement}><i class="bi bi-caret-down"></i></a>
        </div>
        <br/><br/><br/>
        
      </div>
      
      <div className="container body">
        <div className="setMax">
          <h1>Change Maximum Number</h1>
          <h1>{maximumNum}</h1>
            <form onSubmit={handleSubmit}>
              <label>Enter number</label>
              <br/>
              <input type="number" 
              onChange={setValue => {
                  isNotSavedNum(true)
                  setMaximum(setValue.target.value)
                }
              }></input><br/>
              <input className="saveBtn" type="submit" ></input>
            </form>
        </div>
        <hr/>
        <div className="setMin">
          <label>Advanced Config</label>
          {testerPage()}
            {testerPage()}
            {testerPage()}
            {testerPage()}
            {testerPage()}
        </div>
      </div>

    </div>
  )
}




// export default class App extends Component {
//   constructor(props) {
//     super(props)

//     this.state = {
//       textWow: "Click me please!"
//     }

//     this.handleClick = () => {
//       this.setState({
//         textWow: "Ok! Thank! lol"
//       })
//     }
//   }

  
//   render() {
//     return (
//       <div>
//         <button onClick={this.handleClick}>{this.state.textWow}</button>
//       </div>
//     )
//   }
// }


