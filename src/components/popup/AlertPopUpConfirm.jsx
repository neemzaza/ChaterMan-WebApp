import React, { useState, useEffect } from "react";
import $ from "jquery";

let popUpToggleStatus = false;

export const closePopUp = () => {
  popUpToggleStatus = false;
    $(".popupAlertConfirm").css({
      visibility: "hidden",
      opacity: "0",
    });
    $(".cover").css({
      visibility: "hidden",
      opacity: "0",
    })
};

export const render = (state) => {
  const activate = () => {
    popUpToggleStatus = true;
    $(".popupAlertConfirm").css({
      visibility: "visible",
      opacity: "1",
    });
    $(".cover").css({
      visibility: "visible",
      opacity: "1",
    })
  };
  activate();
};

export default function AlertPopUpConfirm(props) {
  let message = props.msg;
  let state = props.state;
  let hasFollowTypingConfirm = props.hasFollowTypingConfirm;
  let followTypingText = props.followTypingText;
  let parameters = props.parameters;

  let cancelFunc = props.cancelFunc;
  let confirmFunc = props.confirmFunc;

  let choiceArray = props.choiceArray;

  const [typeFollowConfirm, setTypeFollowConfirm] = useState();

  const stateChecker = (state) => {
    switch (state) {
      case "confirmState":
        return (
          <code>
            <i class="bi bi-exclamation-octagon-fill"></i> SURE?
          </code>
        );

      case "choiceState":
        return (
          <code>
            <i class="bi bi-info-lg"></i> SELECT ONCE
          </code>
        );

      default:
        return (
          <code>
            <i class="bi bi-exclamation-triangle-fill"></i> SURE?
          </code>
        );
    }
  };

  const formFollowType = () => {
    if (hasFollowTypingConfirm) {
      return (
        <section className="typefollow">
          <p className="info-text">TYPE FOLLOW THIS MESSAGES TO DELETE</p>
          <code>
            {followTypingText === undefined
              ? "You can press confirm right now!"
              : `"${followTypingText}"`}
          </code>
          <br />
          <br />
          <input onChange={(e) => setTypeFollowConfirm(e.target.value)} defaultValue={typeFollowConfirm} />
          <br />
          <br />
        </section>
      );
    }
  };

  const confirm = () => {
    if (hasFollowTypingConfirm) {
      if (typeFollowConfirm === followTypingText) {
        console.log("PASSED!");
        confirmFunc(parameters !== null ? parameters : undefined);
        setTypeFollowConfirm("")
        closePopUp()
      } else {
        $(".info-text").css({
          animation: "info-alert .5s",
          "animation-iteration-count": "2"
        })
      }
    }
  };

  return (
    <nav
      className={"popupAlertConfirm " + state + " animate__animated "}
      id="hello1"
    >
      {/* Alert Function */}
      <br />
      {stateChecker(state)}
      <h4>{message}</h4>
      <br />
      {formFollowType()}
      <div class="btn-group   !spacing" role="group" aria-label="Basic example">
        <a
          class="btn small btn-danger btn-sm "
          href="#"
          role="button"
          onClick={() =>
            !props.cancelFunc
              ? closePopUp()
              : cancelFunc()
          }
        >
          Cancel{" "}
        </a>
        <a
          class="btn small btn-success btn-sm "
          href="#"
          role="button"
          onClick={() => confirm()}
        >
          Confirm{" "}
        </a>
      </div>
      <br />
      <br />
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
