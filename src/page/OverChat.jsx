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

import ScrollToBottom from "react-scroll-to-bottom";

import AlertPopUp, { render, closePopUp } from "../components/popup/AlertPopUp";
import AlertPopUpConfirm, {
  render as confirmRender,
  closePopUp as closePopUpConfirm,
} from "../components/popup/AlertPopUpConfirm";

import InfoBar from "../InfoBar/InfoBar";
import Messages from "../components/Messages";

import SignOut from "../components/SignOut";
import Settings from "../components/Settings";

import queryString from "query-string";
import socketIOClient from "socket.io-client";
import { atob, Buffer } from "buffer";

let socket;

const OverChat = () => {
  const endPoint = url;
  const [disable, setDisable] = useState(false);

  const { displayName, photoURL, phoneNumber, uid } = auth.currentUser;
  const [userName, setUserName] = useState("");
  const [photoSrc, setPhotoSrc] = useState(profileNotHaveImg);

  const [name, setName] = useState(displayName);
  const [room, setRoom] = useState("");
  const [userID, setId] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const [nofi, setNofi] = useState(0);
  const noNofi = "No Nofitication found";
  const [contentInNofi, setContentInNofi] = useState([]);

  const [alert, setAlert] = useState(null);
  const [state, alertState] = useState(null);

  const [uploadedFile, setUploadedFile] = useState([]);
  const [base64File, setBase64File] = useState("");

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

  useEffect(() => {
    // eslint-disable-next-line no-restricted-globals
    const { name, room } = queryString.parse(location.search);
    setName(name);
    setRoom(room);
    socket = socketIOClient(endPoint);

    socket.emit("join", { name, room }, (err, errcode) => {
      if (err) {
        alertPacket(err + " redirecting to previous page...", "alertState");
        setDisable(true);

        setTimeout(() => {
          window.history.back();
        }, 3000);
      }
    });

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

    return () => {
      socket.emit("disconnect");

      socket.off();
    };
    // eslint-disable-next-line no-restricted-globals
  }, [endPoint, location.search]);

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages((messages) => [...messages, message]);
    });
  }, []);

  //function for sending messages

  const sendMessage = (e) => {
    e.preventDefault();

    if (base64File.length > 0) {
      socket.emit("sendMessage", base64File, () => {
        setUploadedFile([]);
        setBase64File("");
        $("#imageUpload").attr("src", null);
      });
    }

    if (message) {
      
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  };

  const onUploadFile = (e) => {
    // setUploadedFile([...uploadedFile, e.target.files])
    setUploadedFile(e.target.files);

    // encodeBase64Image(uploadedFile[0])
    encodeBase64Image(e.target.files[0]);
  };

  const detectURL = (text) => {
    let urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
    console.log(text.match(urlRegex))
  }

  const encodeBase64Image = (file) => {
    var reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onload = () => {
        var base64 = reader.result;
        console.log(base64);
        setBase64File(base64);
        console.log(Buffer.from(base64, "base64").toString());

        var image = new Image();
        image.src = base64;
        $("#imageUpload").attr("src", image.src);
      };
      reader.onerror = (err) => {
        console.log("Found expection: " + err);
      };
    }
  };

  if (message.length > 0 || uploadedFile.length > 0) {
    $("#sendMsgBtn").addClass("animate__bounceIn")
    $("#sendMsgBtn").removeClass("animate__bounceOut")
    $("#sendMsgBtn").css("display", "block")
  } 
  else {
    $("#sendMsgBtn").addClass("animate__bounceOut")
    $("#sendMsgBtn").removeClass("animate__bounceIn")
  }

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
        <ScrollToBottom className="overchat body animate__animated animate__zoomIn">
          <InfoBar room={room} />
          <Messages messages={messages} name={name} />

          {uploadedFile.length > 0 ? (
            <div className="image-preview-zone">
              <img id="imageUpload" className="imagePreview" />
            </div>
          ) : null}
          <div className="nav-chat p-3">
            <div className="container">
              <div className="chat-box flex">
                <input
                  type="text"
                  className="nav-chat-form"
                  placeholder={
                    disable
                      ? `Sorry, You can't talking in ${room}`
                      : `Talking in ${room}`
                  }
                  value={message}
                  onChange={({ target: { value } }) => setMessage(value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" ? sendMessage(e) : null
                  }
                  disabled={disable}
                />

                <a
                  class="btn btn-trans btn-sm file"
                  type="submit"
                  disabled={disable}
                >
                  <label htmlFor="file-input" className="file-input">
                    {uploadedFile.length > 0 ? uploadedFile.length + "x" : ""}
                    &nbsp;<i class="bi bi-file-earmark-image"></i>
                  </label>

                  <input id="file-input" type="file" onChange={onUploadFile} />
                  {/* <p>{decodeBase64}</p> */}
                </a>

                {/* Send Button Start */}
                {/* {message.length < 1 ? null : ( */}
                  <a
                    class="btn btn-trans btn-sm animate__animated "
                    id="sendMsgBtn"
                    type="submit"
                    onClick={(e) => sendMessage(e)}
                    disabled={disable}
                  >
                    <i class="bi bi-cursor-fill"></i>
                  </a>
                {/* )} */}
                {/* Send Button End */}
              </div>
            </div>
          </div>
        </ScrollToBottom>
      </div>
    </div>
  );
};

export default OverChat;
