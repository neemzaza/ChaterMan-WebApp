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

import { Link } from "react-router-dom";

export default function SelectChat() {
  const { displayName, photoURL, phoneNumber, uid } = auth.currentUser;
  const [userName, setUserName] = useState("");
  const [photoSrc, setPhotoSrc] = useState(profileNotHaveImg);

  const [allRoom, setAllRoom] = useState([]);
  const [countRoom, setCountRoom] = useState([]);

  const [nofi, setNofi] = useState(0);
  const noNofi = "No Nofitication found";
  const [contentInNofi, setContentInNofi] = useState([]);

  const [alert, setAlert] = useState(null);
  const [state, alertState] = useState(null);

  const [name, setName] = useState(displayName);
  const [room, setRoom] = useState("");

  const updateNotification = (msg) => {
    setContentInNofi((contentInNofi) => [...contentInNofi, msg]);
    setNofi(nofi + 1);
  };

  const updateWhenChangedProfile = (profilePicSrc) => {
    axios.put(`${url}profile-pic-update`, {
      photoURL: profilePicSrc,
      UserId: uid,
    });
  };

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

  const getAllRoom = async () => {
    await axios.get(`${url}get-room`).then((data) => {
      setAllRoom(data.data);
      console.log(data.data[0].id);
    });
  };

  const getAllCurrentUserRoom = async (room) => {
    await axios.get(`${url}get-user-connect-room?id=${room}`).then((data) => {
      setCountRoom({
        roomId: room,
        currentCount: data.data
      });
    });
  };

  useEffect(() => {
    if (!displayName) {
      $("#hello3").css("display", "block");

      updateNotification("Please set your display name");
    } else {
      setUserName(displayName);

      $("#hello3").css("display", "none");
    }

    // Check has profile pic?

    if (!photoURL) {
      updateWhenChangedProfile(profileNotHaveImg);
      firebase.auth().currentUser.updateProfile({
        photoURL: profileNotHaveImg,
      });

      // contentInNofi.push("Please set your profile picture")
    } else {
      setPhotoSrc(photoURL);
    }

    getAllRoom();
  }, []);

  const redirectToMainChat = (e) => {
    // e.preventDefault();
    // window.history.pushState('', `In ${room}`, `/in-chat?name=${name}&id=${uid}&room=${room}`);
  };

  return (
    <div
      className="mainBody animate__animated"
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
          <img
            src={photoSrc}
            className="profilePic"
            alt={`${displayName}'s Profile`}
          />
          <br />
          <br />
          <div className="usernameGroup">
            <div className="effectLinaer"></div>
            <h5 className="text-vertical usernameSec">{userName}</h5>
          </div>

          <div
            className="nofisec"
            onMouseOver={() => {
              $("#hello4").css("visibility", "visible");
              $("#hello4").css("opacity", "1");
            }}
            onMouseOut={() => {
              $("#hello4").css("visibility", "hidden");
              $("#hello4").css("opacity", "0");
            }}
          >
            <i class="bi bi-bell-fill nofi"></i>
            <div className="bannerCount">{nofi >= 9 ? "9+" : nofi}</div>
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
        <webpage className="body animate__animated animate__zoomIn">
          <div className="card select-chat">
            <div className="row">
              <div className="col-sm-8 p-5">
                <h3 className="" onClick={() => console.log(allRoom[0].name)}>
                  Join
                </h3>
                <hr />
                <form className="select-form">
                  <input
                    type="text"
                    className="name"
                    placeholder="Your display name"
                    defaultValue={displayName}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <br />
                  <input
                    type="text"
                    className="room-id"
                    placeholder="Room ID"
                    onChange={(e) => setRoom(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" ? redirectToMainChat(e) : null
                    }
                  />
                  <br />
                  <Link
                    class="btn btn-warning btn-sm small"
                    type="submit"
                    role="button"
                    onClick={(e) =>
                      !name || !room ? e.preventDefault() : null
                    }
                    to={`/in-chat?name=${name}&id=${uid}&room=${room}`}
                  >
                    Join
                  </Link>
                </form>
              </div>

              <div className="col-sm-4">
                <div className="status-room p-4">
                  {allRoom.map((val, key) => (
                    <section id={key}>
                      <div className="card p-3">
                        <label>{allRoom[key].name}</label>
                        <label>
                          {allRoom[key].current}/{allRoom[key].max}
                        </label>
                        <div className="rightside">
                          <Link
                            class="btn btn-warning btn-sm small"
                            type="submit"
                            role="button"
                            to={`/in-chat?name=${name}&id=${uid}&room=${allRoom[key].id}`}
                          >
                            <label>Join</label>
                          </Link>
                        </div>
                      </div>
                      <br />
                    </section>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </webpage>
      </div>
    </div>
  );
}
