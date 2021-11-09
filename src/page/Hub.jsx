import React, { useState, useEffect, useRef } from "react";
import "../scss/App.scss";
import firebase, { auth, url } from "../global/Database";
import axios from "axios";

import profileNotHaveImg from "../img/willnarongman.jpg";

import $, { Callbacks } from "jquery";
import countryCodeData from "../global/CookieAndDataReq";
import {
  onStartTouching,
  onStopTouching,
  onMovingScreen,
} from "../effect/SidablePage";

import SignOut from "../components/SignOut";
import Settings from "../components/Settings";
import version, { numVer, thestatus } from "../global/Version";

import AlertPopUp, { render, closePopUp } from "../components/popup/AlertPopUp";
import AlertPopUpConfirm, {
  render as confirmRender,
  closePopUp as closePopUpConfirm,
} from "../components/popup/AlertPopUpConfirm";

import CloudEffect from "../components/CloudEffect";

import { Link } from "react-router-dom";

export default function Hub() {
  const { displayName, photoURL, phoneNumber, uid } = auth.currentUser;

  const [userName, setUserName] = useState("");
  const [photoSrc, setPhotoSrc] = useState(profileNotHaveImg);

  const [nofi, setNofi] = useState(0);
  const noNofi = "No Nofitication found";
  const [contentInNofi, setContentInNofi] = useState([]);

  // const nofiData = [noNofi]

  const [nowDateSec, setDateSec] = useState("");

  const [objectData, setObjectData] = useState([]);

  const [inputContent, setInputContent] = useState(0);
  const [alert, setAlert] = useState(null);
  const [state, alertState] = useState(null);

  // Template of confirm popup
  const [objectPopupParaSent, setOjectPopupParaSent] = useState({
    msg: "This is popup confirm state",
    confirmFunc: null,
    state: "confirmState",
    hasFollowTypingConfirm: true,
    followTypingText: "Hello world",
    parameters: null,
  });

  // Error array
  const errorPost = [];

  // Ref of post
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const colorRef = useRef(null);

  const dateNow = new Date().getHours();

  // show popup (Alert popup)
  const alertPacket = (msg, state) => {
    closePopUp();
    setAlert(msg);
    alertState(state);
    render(state);
    console.log(alert);
  };

  // show popup (confirm popup)
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

  // Update การแจ้งเตือน method
  const updateNotification = (msg) => {
    setContentInNofi((contentInNofi) => [...contentInNofi, msg]);
    setNofi(nofi + 1);
  };

  // Character limit method (500 Char)
  const changeChar = () => {
    if (inputContent >= 500) {
      errorPost.push("Post is over then 500 charactor");
    }

    if (errorPost.length > 0) {
    }
  };

  // Post a post (make post to server)
  const goPost = (e) => {
    e.preventDefault();
    if (titleRef.current.value.length <= 0) {
      errorPost.push("Title is missing");
      alertPacket("Title is missing", "alertState");
      return;
    }

    if (inputContent <= 0) {
      errorPost.push("Content is missing");
      alertPacket("Content is missing", "alertState");
      return;
    }

    axios
      .post(`${url}create-post`, {
        UserId: uid,
        hasVerify: false,
        DisplayName: displayName,
        photoURL: photoURL,
        Title: titleRef.current.value,
        Content: contentRef.current.value,
        // CardColor: colorRef.current.value,
        PostDate: new Date(),
      })
      .then(() => {
        const form = document.querySelector("#form-post");
        form.reset();
        queryAllPost();
      });
  };

  // update when changed profile
  const updateWhenChangedProfile = (profilePicSrc) => {
    axios.put(`${url}profile-pic-update`, {
      photoURL: profilePicSrc,
      UserId: uid,
    });
  };

  // get user profile
  const getUserProfile = (id) => {
    axios.get(`${url}get-user?uid=${id}`).then((data) => {
      setPhotoSrc(data.data.photoURL)
    })
  }

// PopUp Method

  // open popup method
  const openCreatePost = () => {
    $("#popUpPost").css("display", "block");
  };

  // close popup method
  const closeCreatePost = () => {
    $("#popUpPost").css("display", "none");
  };

  // Get all post
  const queryAllPost = async () => {
    $("#loading").css("display", "block");
    await axios
      .get(`${url}get-post`)
      .then((data) => {
        setObjectData(data.data);
        $("#loading").css("display", "none");
      })
      // push error to contentInNofi
      .catch((err) => {
        updateNotification("Failed to getting post - " + err.message);
      });
  };

  // Delete post by ID
  const onDelPost = async (idPost) => {
    await axios.delete(`${url}del-post?postId=${idPost}`).then((data) => {
      console.log(idPost);
    });
    alertPacket("Success to delete post!", "successState")
    queryAllPost();
  };

  // collisions [th]== "การชนกัน"
  // collisions [iy]== "collisioni"
  const collisions = ($div1, $div2) => {
    // Method should work: when $div1 and $div2 had collision the method was returning a boolean to user (Method that use).

    let x1 = $div1.offset().left; // Get left coordinate div 1 ==> /```````/

                                                                //   |   <== Top offset
                                                                //  v
    let y1 = $div1.offset().top; // Get top coordinate of div 1 /```````/

    let h1 = $div1.outerHeight(true); // All Height (Merged margin height)
    let w1 = $div1.outerWidth(true); // All Width (Merged margin width)

    let b1 = y1 + h1; //border
    let r1 = x1 + w1; //round


    // As the same of div1 section...
    let x2 = $div2.offset().left;
    let y2 = $div2.offset().top;
    let h2 = $div2.outerHeight(true);
    let w2 = $div2.outerWidth(true);

    let b2 = y2 + h2; //border
    let r2 = x2 + w2; //round

    if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
    return true;
  };

  $("webpage").on("scroll", () => {
    let normal = {
      "border-radius": "18px",
      filter: "none",
    };
    let toggled = {
      "border-radius": "0px 0 18px 18px",
      filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.2))",
    };
    if (collisions($("#spy"), $("#explorerTitle"))) {
      $("#explorerTitle").css(toggled);
      $("#iconExplorer").addClass("animate__heartBeat");
    } else {
      $("#explorerTitle").css(normal);
      $("#iconExplorer").removeClass("animate__heartBeat");
    }
  });
  useEffect(() => {
    // Check not have display name

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

    // Time Change Effect

    if (dateNow >= 6 && dateNow <= 8) {
      setDateSec(countryCodeData ? "ยามเช้า!" : "Good Morning!");
      $(".morningSec").css("display", "block");
      $(".colorzone").css("background", "#72dcff");
    } else if (dateNow >= 9 && dateNow <= 11) {
      setDateSec(countryCodeData ? "ยามสาย!" : "Good Morning!");
      $(".morningSec").css("display", "block");
      $(".colorzone").css("background", "#72dcff");
    } else if (dateNow === 12) {
      setDateSec(countryCodeData ? "ตอนเที่ยง!" : "Good Lunch!");
      $(".noonSec").css("display", "block");
      $(".colorzone").css("background", "#ffe600");
    } else if (dateNow >= 13 && dateNow <= 15) {
      setDateSec(countryCodeData ? "ยามบ่าย" : "Good Afternoon!");
      $(".afternoonSec").css("display", "block");
      $(".colorzone").css("background", "#00f6ff");
    } else if (dateNow >= 16 && dateNow <= 18) {
      setDateSec(countryCodeData ? "ตอนเย็น!" : "Good Evening!");
      $(".eveningSec").css("display", "block");
      $(".colorzone").css("animation", "bluetodark 3s");
      $(".colorzone").css("animation-fill-mode", "forwards");
    } else if (
      (dateNow === 0 && dateNow <= 5) ||
      (dateNow >= 19 && dateNow <= 24)
    ) {
      setDateSec(countryCodeData ? "ตอนค่ำ!" : "Good Night!");
      $(".nightSec").css("display", "block");
      $(".colorzone").css("background", "#404040");
      $(".textWelcome").css("color", "#fff");
    } else {
      updateNotification("Error with time effect");
    }

    // Get post from RestAPI
    queryAllPost();
    // Total Number
    // setNofi(contentInNofi.length)
    // console.log(objectData)
  }, []);
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

      <div className="popUpPost" id="popUpPost">
        <a
          class="btn btn-danger btn-sm"
          onClick={closeCreatePost}
          href="#"
          role="button"
        >
          X
        </a>
        <section className="centerMenu">
          <div className="card titleCardWOW">
            <h1>Creating a post</h1>
          </div>
          <br />

          <div className="card postCard" id="postCardfill">
            <div className="container">
              <br />
              <form onSubmit={goPost}>
                <input
                  type="text"
                  ref={titleRef}
                  className="textTitle post fill"
                  placeholder="Title"
                />
                <br />
                <br />
                <div className="flex">
                  <img
                    src={photoSrc}
                    className="profilePic"
                    alt={`${displayName}'s Profile`}
                  />
                  &nbsp;
                  <h5 className="displayName">Post as: {displayName}</h5>
                </div>
                <br />
                <textarea
                  type="text"
                  ref={contentRef}
                  className="contentInPost fill"
                  id="contentPost"
                  onChange={(e) => {
                    setInputContent(e.target.value.length);
                    changeChar();
                  }}
                  placeholder="Post your mine here!"
                />
                <p className="textChar">{inputContent} / 500</p>
                {/* <div className="card inputcolorsel"><label>{countryCodeData ? "เลือกสีการ์ดของคุณ" : "Choose your card's color"}</label>&nbsp;&nbsp;&nbsp;
                                    <input type="color" ref={colorRef} className="colorSelector" onChange={e =>
                                        $("#postCardfill").css("background", e.target.value)
                                    } /></div> */}
                <br />
                <br />
                <button
                  class="btn btn-outline-primary btn-sm "
                  type="submit"
                  role="button"
                >
                  Public
                </button>
              </form>
              <br /> <br />
            </div>
          </div>
        </section>
      </div>

      <div className="popupSuccess animate__animated " id="hello2">
        {/* popUp Success */}
      </div>

      <div
        className="popupNofi animate__animated "
        id="hello4"
        onMouseOver={() => {
          $("#hello4").css("visibility", "visible");
          $("#hello4").css("opacity", "1");
        }}
        onMouseOut={() => {
          $("#hello4").css("visibility", "hidden");
          $("#hello4").css("opacity", "0");
        }}
      >
        <h4>Nofitication found: ({nofi})</h4>
        <ul>
          {contentInNofi.map((data) => {
            if (nofi === 0) {
              return (
                <li>
                  {countryCodeData === true
                    ? "ไม่พบการแจ้งเตือน!"
                    : "All Caught! No nofitication found!"}
                </li>
              );
            } else {
              return <li>{data}</li>;
            }
          })}
        </ul>
      </div>

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
          <nav class="navbar spy navbar-expand-sm" id="spy"></nav>
          <div className="colorzone pt-5">
            <div className="container">
              <CloudEffect />
              <h1 className="textWelcome">
                {!countryCodeData ? nowDateSec : ""}
                {countryCodeData ? "หวัดดี" : ""}{" "}
                {countryCodeData ? nowDateSec : ""} {userName}
              </h1>

              <br />
            </div>
          </div>
          {/* End of ColorZone */}

          {/* Start Beta Alert */}
          <div className="alertonfirst">
            {countryCodeData
              ? `เว็บนี้ยังเป็นรุ่นทดสอบช่วง ${version} บางอย่างอาจไม่สมบูรณ์ | uid: ${uid}`
              : `This web still prototype version (${version}) something will not completed`}
          </div>
          {/* End Beta Alert */}

          <div className="container pt-3">
            <div className="row">
              <div className="col-sm-6">
                <br />
                <Link
                  className="card chatcard selectorCard p-4"
                  to="/select-chat"
                >
                  <i class="bi bi-chat-left-text chaticn"></i>
                  <h2 className="chaticn">
                    {countryCodeData
                      ? "การพูดคุยกับทุกคนโดยการแชท"
                      : "Talk with everyone by Chatting"}
                  </h2>
                  {/* <hr className="hasActive" /> */}
                </Link>
                <br />
                <div className="card qcard selectorCard p-4">
                  <i class="bi bi-patch-question qicns"></i>
                  <h2 className="qicns">
                    {countryCodeData
                      ? "การสอบถามปัญหาโดยการแชท"
                      : "Question me by Chatting"}
                  </h2>
                  {/* <hr className="hasActive" /> */}
                </div>
              </div>

              <div className="col-sm-6">
                <br />
                <div className="card personcallcard selectorCard p-4">
                  <i class="bi bi-person-bounding-box personcallicn"></i>
                  <h2 className="personcallicn">
                    {countryCodeData
                      ? "การพูดคุยกับทุกคนโดยการสนทนาด้วย Video Call"
                      : "Talk with everyone by Video Calling"}
                  </h2>
                  {/* <hr className="hasActive" /> */}
                </div>
              </div>
            </div>
          </div>

          <br />
          {/* FRIEND SECTION */}
          <section className="friendsection">
            <div className="container">
              <div className="flex">
                <h3>YOUR FRIEND (0)</h3>
                <div className="">...</div>
              </div>
            </div>
          </section>
          <br />
          {/* POST SECTION */}
          <section className="postsection">
            <div className="container">
              {/* Draft Area */}
              <div className="in-draft-area">
                <div className="card titleCardWOW">
                  <h3 className="title-explorer preparing">
                    {countryCodeData
                      ? "สร้างร่างแบบและปล่อยสู่สาธารณะ"
                      : "CREATE DRAFT AND PUBLIC"}
                  </h3>
                </div>
                <div className="card postCard preparing" id="postCardfill">
                  <div className="container">
                    <br />
                    <form onSubmit={goPost} id="form-post">
                      <input
                        type="text"
                        ref={titleRef}
                        className="textTitle post fill"
                        placeholder="Title"
                      />
                      <br />
                      <br />
                      <div className="flex">
                        <img
                          src={photoSrc}
                          className="profilePic"
                          alt={`${displayName}'s Profile`}
                        />
                        &nbsp;
                        <h5 className="displayName">Post as: {displayName}</h5>
                      </div>
                      <br />
                      <textarea
                        type="text"
                        ref={contentRef}
                        className="contentInPost fill"
                        id="contentPost"
                        onChange={(e) => {
                          setInputContent(e.target.value.length);
                          changeChar();
                        }}
                        placeholder="Post your mine here!"
                      />
                      <p className="textChar">{inputContent} / 500</p>
                      {/* <div className="card inputcolorsel"><label>{countryCodeData ? "เลือกสีการ์ดของคุณ" : "Choose your card's color"}</label>&nbsp;&nbsp;&nbsp;
                                    <input type="color" ref={colorRef} className="colorSelector" onChange={e =>
                                        $("#postCardfill").css("background", e.target.value)
                                    } /></div> */}
                      <br />
                      <br />
                      <button
                        class="btn btn-outline-primary btn-sm small"
                        type="submit"
                        role="button"
                      >
                        Public
                      </button>
                    </form>
                    <br /> <br />
                  </div>
                </div>
              </div>
              {/* <br/><br/> */}
              {/* Post Area */}

              <div className="postarea">
                <div className="card explorer titleCardWOW" id="explorerTitle">
                  <h3 className="title-explorer">
                    <i
                      class="bi bi-compass animate__animated"
                      id="iconExplorer"
                    ></i>
                    &nbsp;{countryCodeData ? "สำรวจ" : "EXPLORER"}
                  </h3>
                </div>

                {objectData.map((val, key) => {
                  const showWhenUserIsOwnedThisPost = () => {
                    if (auth.currentUser.uid === val.UserId)
                      return (
                        <div className="">
                          <a
                            class="btn btn-danger btn-sm editPost small"
                            onClick={() =>
                              showPopUp(
                                "Are you sure to delete this post?",
                                onDelPost,
                                "confirmState",
                                true,
                                displayName + " delete this post",
                                val._id
                              )
                            }
                            href="#"
                            role="button"
                          >
                            Delete
                          </a>
                          &nbsp;&nbsp;
                          <a
                            class="btn btn-warning btn-sm editPost small"
                            onClick={() => {}}
                            href="#"
                            role="button"
                          >
                            Edit
                          </a>
                          &nbsp;&nbsp;
                        </div>
                      );
                  };

                  const onlyAdminCanSee = () => {
                    if (auth.currentUser.uid === "VD6XEzA6eHXuG0sXPSJ1zTvO55B3")
                      return (
                        <div>
                          <li>
                            <h6>Technical Info</h6>
                          </li>
                          <li>
                            <p class="dropdown-item" href="#">
                              <i class="bi bi-braces"></i>PostId : {val._id}
                            </p>
                          </li>
                        </div>
                      );
                  };
                  // $(`#realpostcard${val._id}`).css("background", val.CardColor)
                  return (
                    <div>
                      <div
                        className="card mainPost animate__animated animate__fadeInUp"
                        id={`realpostcard`}
                      >
                        <div className="warnincard" id="warnincard">
                          <msg>New post now</msg>
                        </div>
                        <div className="container">
                          <br />
                          <br />
                          <form>
                            <h1 className="textTitle post">{val.Title}</h1>

                            <div className="flex">
                              <img
                                src={val.photoURL}
                                className="profilePic"
                                alt={`X`}
                              />
                              &nbsp;
                              <div className="card postInCard">
                                <h5 className="displayName">
                                  {val.DisplayName} :{" "}
                                  <i class="bi bi-globe2"></i>
                                </h5>
                              </div>
                              <div className="rightPos flex">
                                {showWhenUserIsOwnedThisPost()}
                                <div className="dropdown">
                                  <a
                                    className="btn btn-light btn-sm editPost small"
                                    type="button"
                                    id="dropdownMenuButton1"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                                    <i class="bi bi-three-dots-vertical"></i>
                                  </a>
                                  <ul
                                    className="dropdown-menu inPost"
                                    aria-labelledby="dropdownMenuButton1"
                                  >
                                    {onlyAdminCanSee()}
                                    <li>
                                      <a class="dropdown-item report" href="#">
                                        <i class="bi bi-bullseye"></i>
                                        &nbsp;Report
                                      </a>
                                    </li>
                                    <li>
                                      <a class="dropdown-item" href="#">
                                        <i class="bi bi-code-square"></i>
                                        &nbsp;Get Api
                                      </a>
                                    </li>
                                  </ul>
                                </div>
                                &nbsp;&nbsp;&nbsp;
                              </div>
                            </div>
                            <br />
                            <div className="card postInCard contentInPost">
                              <br />
                              <p className="contentInPost" id="contentPost">
                                {val.Content}
                              </p>
                            </div>
                          </form>
                          <br /> <br />
                        </div>
                      </div>
                      <br />
                    </div>
                  );
                })}
                {/* <div id="loading" className="loading-post">&nbsp;<h4>loading...</h4></div> */}
                <div
                  id="loading"
                  className="card skeleton mainPost animate__animated animate__fadeInUp"
                >
                  <div className="container">
                    <br />
                    <br />
                    <div className="skeleton-title"></div>
                    <br />
                    <div className="skeleton-profile"></div>
                    <br />
                    <div className="skeleton-content"></div>
                    <br />
                    <div className="skeleton-content"></div>
                    <br /> <br />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <br />
          {/* END MESSAGE */}
          <h4 className="textCenter">
            <i class="bi bi-ui-checks"></i>{" "}
            {countryCodeData
              ? "คุณได้สำรวจโพสต์ทั้งหมดแล้ว!"
              : "YOU EXPLORED ALL POST!"}
          </h4>
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <div className="rightPos">
            {version} {numVer} {thestatus}&nbsp;
          </div>
        </webpage>
      </div>
    </div>
  );
}

const DirToChat = () => {
  window.location.href = "/in-chat";
};
