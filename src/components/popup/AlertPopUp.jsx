import React, { useEffect } from "react";
import $ from "jquery";

let popUpToggleStatus = false;

export const closePopUp = () => {
    popUpToggleStatus = false
    $(".mainBody").removeClass("animate__shakeX");
    $("#hello1").removeClass("animate__bounceInDown");
    $("#hello1").addClass("animate__bounceOutUp");
    $("#doAlert1").removeClass("animate__headShake");
}

export const render = (state) => {
  const activate = () => {
    popUpToggleStatus = true
    $("#hello1").removeClass("animate__bounceOutUp");
    $("#hello1").addClass("animate__bounceInDown");
    $("#hello1").css("display", "block");
    
    if (state === "alertState") {
      $("#doAlert1").addClass("animate__headShake");
      $(".mainBody").addClass("animate__shakeX");
      
      $("#doAlert1").css("color", "red");
      $(".mainBody").css("filter", "blur(1px)");

      setTimeout(() => {
        $(".mainBody").css("filter", "none");
        $("#doAlert1").css("color", "black");
      }, 200);
    }
  }

  if (popUpToggleStatus) {
    $(".mainBody").removeClass("animate__shakeX");
    $("#doAlert1").removeClass("animate__headShake");
    
    $("#doAlert1").addClass("animate__headShake");
    $(".mainBody").addClass("animate__shakeX");
    activate()
  } else {
    activate()
  }
};

export default function AlertPopUp(props) {
  let message = props.msg;
  let state = props.state;

  useEffect(() => {
    $(".popupAlert").on("click", () => {
      closePopUp()
    });
  },[])

  const stateChecker = (state) => {
    switch (state) {
      case "alertState":
        return <code><i class="bi bi-exclamation-octagon-fill"></i> ERROR</code>
      
      case "infoState":
        return <code><i class="bi bi-info-lg"></i> INFO</code>

      case "successState":
        return <code><i class="bi bi-check-lg"></i> SUCCESS</code>

      default:
        return <code><i class="bi bi-exclamation-triangle-fill"></i> ALERT</code>
    }
  }

  return (
    <nav className={"popupAlert " + state + " animate__animated "} id="hello1">
      {/* Alert Function */}
        {stateChecker(state)}
      <p>{message}</p>
    </nav>
  );

  // <div className="row">
  //   <div className="col-sm-3"></div>
  //   <div className="col-sm-6">
  //     <nav className="popupAlert animate__animated " id="hello1">
  //        {/* Alert Function */}
  //      <h3>{message}</h3>
  //      </nav>
  //    </div>
  //   <div className="col-sm-3"></div>
  // </div>
}
