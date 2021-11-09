import React, { useEffect, useState } from "react";
import $ from "jquery";
import axios from "axios";

import {
  onStartTouching,
  onStopTouching,
  onMovingScreen,
} from "../effect/SidablePage";

import firebase, { auth, url } from "../global/Database";

import profileNotHaveImg from "../img/willnarongman.jpg";

import AlertPopUp, { render, closePopUp } from "../components/popup/AlertPopUp";
import AlertPopUpConfirm, {
  render as confirmRender,
  closePopUp as closePopUpConfirm,
} from "../components/popup/AlertPopUpConfirm";

import SignOut from "../components/SignOut";
import Settings from "../components/Settings";

export default function OverChat() {
//   const { displayName, photoURL, phoneNumber, uid } = auth.currentUser;
  const [userName, setUserName] = useState("");
  const [photoSrc, setPhotoSrc] = useState(profileNotHaveImg);

  const [nofi, setNofi] = useState(0);
  const noNofi = "No Nofitication found";
  const [contentInNofi, setContentInNofi] = useState([]);

  const [successToConn, setSuccessToConn] = useState(false);
  const [errMsg, setErrMsg] = useState("")

  const [alert, setAlert] = useState(null);
  const [state, alertState] = useState(null);

  const [objectPopupParaSent, setOjectPopupParaSent] = useState({
    msg: "This is popup confirm state",
    confirmFunc: null,
    state: "confirmState",
    hasFollowTypingConfirm: true,
    followTypingText: "Hello world",
    parameters: null,
  });

  const alertPacket = (msg, state) => {
    closePopUp();
    setAlert(msg);
    alertState(state);
    render(state);
    console.log(alert);
  };

  const showPopUp = (
    msg,
    confirmFunc,
    state,
    hasFollowTypingConfirm,
    followTypingText,
    parameters
  ) => {
    setOjectPopupParaSent({
      msg: msg,
      confirmFunc: confirmFunc,
      state: state,
      hasFollowTypingConfirm: hasFollowTypingConfirm,
      followTypingText: followTypingText,
      parameters: parameters,
    });
    confirmRender();
  };

  useEffect(() => {
    axios.get(`${url}`)
      .then(data => {
        setSuccessToConn(true)
      })
      .catch(err => {
        // console.log("Failed to Conn to DB")
        setSuccessToConn(false)
        setErrMsg(err.message)
        // doSetAlert()
      })
  }, [])

  return (
    <div
      className="mainBody status-page animate__animated"
      onTouchStart={(e) => onStartTouching(e.touches[0].clientX)}
      onTouchEnd={() => onStopTouching()}
      onTouchMove={(e) =>
        onMovingScreen(e.changedTouches[0].clientX, e.changedTouches[0].clientY)
      }
    >
      <div className="cover"></div>
      <AlertPopUp msg={alert} state={state} />
      <AlertPopUpConfirm
        msg={objectPopupParaSent.msg}
        confirmFunc={objectPopupParaSent.confirmFunc}
        state={objectPopupParaSent.state}
        hasFollowTypingConfirm={objectPopupParaSent.hasFollowTypingConfirm}
        followTypingText={objectPopupParaSent.followTypingText}
        parameters={objectPopupParaSent.parameters}
      />
      <div class="sidebar container">
        {/* Content in sidebar */}
        <br />
        <div className="animate__animated animate__slideInRight">
        <i class="bi bi-clipboard-data logo"></i>
          <br />
          <div className="usernameGroup">
            <div className="effectLinaer"></div>
            <h5 className="text-vertical">Status board</h5>
          </div>

        </div>

        <section className="BottomSec animate__animated animate__slideInRight">
          {Settings()}
          <br />
          <br />
          {SignOut()}
        </section>
      </div>

      <div className="scrollArea" id="webpage">
        <webpage className="body animate__animated animate__zoomIn p-5">
            <div className="card title">
                <h3 className="m-4"><i class="bi bi-broadcast icon-realtime animate__animated animate__rotateIn"></i> Real-time Update</h3>
            </div>

            <div className={"card status-card " + (successToConn ? "fine" : "error")}>
                <h3 className="m-4"><i class="bi bi-server"></i> Database</h3>
                {
                successToConn ? 
                <h4 className="m-4 right"><i class="bi bi-check-lg"></i> Fine</h4>
                :
                <h4 className="m-4 right"><i class="bi bi-exclamation-lg"></i> Disruption</h4>
                }

                {successToConn 
                ? null
                :
                <section>
                    <div className="error-zone p-4">
                        {errMsg}
                    </div>
                </section>
                }
            </div>

        </webpage>
        </div>
    </div>
  );
}
