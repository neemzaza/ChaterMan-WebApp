/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useRef, useState } from "react";
import "../scss/App.scss";

import Button from "@material-ui/core/Button";

import $, { data } from "jquery";
import cover from "../img/coverwelcome.png";
import { useAuthState } from "react-firebase-hooks/auth";
import countryCodeData from "../global/CookieAndDataReq";
import Settings from "../components/Settings";
import {
  onStartTouching,
  onStopTouching,
  onMovingScreen,
} from "../effect/SidablePage";

import firebase, { auth, url } from "../global/Database";
import axios from "axios";

import AlertPopUp, { render, closePopUp } from "../components/popup/AlertPopUp";

import randomWords from "random-words";

import IntroducingSec from "../components/IntroducingSec";

const Welcome = () => {
  const [user] = useAuthState(auth);
  // const photoURL = (auth.currentUser.photoURL == null ? "no" : auth.currentUser.photoURL)

  let canGoToNextSignUp = false;
  let canGoToNextSignUp2 = false;

  const [useEmailSignUp, setEmailSignUp] = useState("");

  const emailRef = useRef(null);
  const passRef = useRef(null);

  const emailRefSignUp = useRef(null);
  const passRefSignUp = useRef(null);
  const usernameSignUp = useRef(null);
  const displaySignUp = useRef(null);

  const signInWithGoogle = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    $(".signinwithgoogle").addClass("loading");
    $(".signinwithgoogle").html(
      countryCodeData ? "กำลังรอการยืนยันจาก Google" : "Authenticating..."
    );
    await auth
      .signInWithPopup(provider)
      .then((user) => {
        axios.post(`${url}create-user`, {
          Email: user.user.email,
          Username: user.user.displayName,
          hasVerify: false,
          photoURL: user.user.photoURL,
          Displayname: null,
          UserId: user.user.uid,
        });
      })
      .then(() => {
        axios
          .get(`${url}create-user`)
          .then((data) => console.log("HEEEERRRREE", data.data));
      })
      .then(() => {
        alertPacket(
          "Successfully to login with google, Redirecting...",
          "successState"
        );
        setTimeout(() => {
          window.location.href = "/hub";
        }, 1000);
      })
      .catch((err) => {
        alertPacket(err, "alertState");
      });
    // .then(() => window.location.href = '/hub')
  };

  const signUp = (e) => {
    // e.preventDefault()
    auth
      .createUserWithEmailAndPassword(
        emailRefSignUp.current.value,
        passRefSignUp.current.value
      )
      .then((user) => {
        axios
          .post(`${url}create-user`, {
            Email: emailRefSignUp.current.value,
            Username: usernameSignUp.current.value,
            hasVerify: false,
            photoURL: null,
            Displayname: !displaySignUp.current.value
              ? randomWords().toString() + "2849"
              : displaySignUp.current.value,
            UserId: user.user.uid,
          })
          .then(() => {
            firebase
              .auth()
              .currentUser.updateProfile({
                displayName: !displaySignUp.current.value
                  ? randomWords().toString() + "2849"
                  : displaySignUp.current.value,
              });
            alertPacket("successfully signed up", "successState");
            window.location.href = "/hub";
          })
          .catch((err) => alertPacket(err, "alertState"));
      })
      .catch((err) => {
        alertPacket("Something is error", "alertState");
        console.log(err);
      });
  };

  const secondPageSignUp = () => {
    if (!canGoToNextSignUp) {
      return;
    }
    $("#inSignUp").css("display", "none");
    $("#inSignUp2").css("display", "block");
  };

  $("#confirmPassword").on("keyup", () => {
    if ($("#signupPassword").val() != $("#confirmPassword").val()) {
      $("#alertPass").html("- Password is not match");
      console.log("sss");
    } else {
      $("#alertPass").html("");
    }
  });

  const lastPageSignUp = () => {
    if (!canGoToNextSignUp2) {
      return;
    }
    $("#inSignUp").css("display", "none");
    $("#inSignUp2").css("display", "none");
    $("#inSignUp3").css("display", "block");
  };

  const alertPacket = (msg, state) => {
    // closePopUp()
    setAlert(msg);
    alertState(state);
    // setTimeout(() => {
    render(state);
    // }, 500);
  };

  const signIn = async (e) => {
    e.preventDefault();
    $("#loading-login").css("display", "block");
    await auth
      .signInWithEmailAndPassword(emailRef.current.value, passRef.current.value)
      .then((user) => {
        console.log(user);
        $("#loading-login").css("display", "none");
        window.location.href = "/hub";
      })
      .catch((err) => {
        $("#loading-login").css("display", "none");
        console.log(err);
        alertPacket(err.message, "alertState");
      });
  };

  const checkWhenSignUp = () => {
    if ($("#chaterin").val().indexOf("@") >= 0 || $("#chaterin").val() == "") {
      $("#hasRedOnError").css("color", "black");
      $("#hasRedOnError").html("Username or Chater ID");
    } else if (
      $("#chaterin").val() == "Subscribe Airwavy" ||
      $("#chaterin").val() == "Subscribe Airwav"
    ) {
      $("#hasRedOnError").css("color", "green");
      $("#hasRedOnError").html("YAYY~~ THANK YOU มากๆๆ");
    } else {
      setTimeout(() => {
        $("#hasRedOnError").html("Username or Chater ID");
      }, 1500);
      $("#hasRedOnError").html('"@" is require');
      $("#hasRedOnError").css("color", "red");
    }
  };

  let emailSignUp = $("#signupemail").val();
  const [alert, setAlert] = useState(null);
  const [state, alertState] = useState(null);
  const [success, setSuccess] = useState("");

  const signInPopUptoggle = () => {
    $(".whenToggled").removeClass("defaultPopUpSignInClass");
    $(".whenToggled").removeClass("mobilesemi-hide");
    $(".whenToggled").addClass("toggledPopUpSignInClass");
  };

  const defaultPopUptoggle = () => {
    $(".whenToggled").removeClass("toggledPopUpSignInClass");
    $(".whenToggled").addClass("mobilesemi-hide");
    $(".whenToggled").addClass("defaultPopUpSignInClass");
  };
  $("#nextSignUp").on("click", () => {
    if ($("#signupemail").val() === "") {
      canGoToNextSignUp = false;
      alertPacket("Email is empty please fill them", "alertState");
      return;
    }

    if (
      $("#signupemail").val().indexOf("@") <= 0 ||
      $("#signupemail").val().indexOf(".") <= 0
    ) {
      canGoToNextSignUp = false;
      alertPacket("Email syntax is not correct", "alertState");
      return;
    }

    canGoToNextSignUp = true;
    console.log("OK!");
  });

  $("#nextSignUp2").on("click", () => {
    if ($("#signupPassword").val().length < 6) {
      canGoToNextSignUp2 = false;
      alertPacket(
        "Password is not enough character it's least 6 character",
        "alertState"
      );
      return;
    }

    canGoToNextSignUp2 = true;
  });

  let hasTogglePopUp = false;

  const onToggleFormSignup = () => {
    hasTogglePopUp = !hasTogglePopUp; //toggle mode

    if (hasTogglePopUp) {
      $("#popupSignin").css("display", "block");
      $(".btnCloseForm").css("display", "block");
      signInPopUptoggle();
      $(".body").css("overflow", "hidden");
    } else {
      $("#popupSignin").css("display", "none");
      $(".btnCloseForm").css("display", "none");
      defaultPopUptoggle();
      $(".body").css("overflow", "auto");
    }
  };

  useEffect(() => {
    if (user) {
      $(".whenToggled").css("display", "none");
      $(".notSignIn").css("display", "none");
      $(".signedInSection").css("display", "block");
    } else {
      $(".signedInSection").css("display", "none");
    }
  });

  $(document).on("mouseover", () => {
    if ($(document).width() <= 1236 && $(document).width() >= 994) {
      $(".thebooksignup").addClass("tab-contentCustom");
    } else if ($(document).width() <= 993) {
      $(".thebooksignup").removeClass("tab-contentCustom");
    } else {
      $(".thebooksignup").removeClass("tab-contentCustom");
    }
  });

  return (
    <div
      className="mainBody animate__animated "
      onTouchStart={(e) => onStartTouching(e.touches[0].clientX)}
      onTouchEnd={() => onStopTouching()}
      onTouchMove={(e) =>
        onMovingScreen(e.changedTouches[0].clientX, e.changedTouches[0].clientY)
      }
    >
      {/* Menu Main Selector */}

      {/* <div className="row">
        <div className="col-sm-3"></div>
        <div className="col-sm-6">
          <nav className="popupAlert animate__animated " id="hello1">
            <h3>{alert}{alert !== null ? "" : "Offline"}</h3>
          </nav>
        </div>
        <div className="col-sm-3"></div>
      </div> */}

      <AlertPopUp msg={alert} state={state} />

      <div className="popupSignin" id="popupSignin">
        <div className="row">
          <div className="col-sm-9 contentFormSignUp">
            {/* Content (Card) */}
          </div>
          {/* <div className="col-sm-3 groupCloseBtn">
            <div className="closeBtn">
              <div className="bgCloseBtn" id="toggleLoginBtn">
                <a className="btn btn-close fontExplorer"></a>
              </div>
            </div>
          </div> */}
        </div>
      </div>

      <div className="sidebar">
        {/* Sidebar */}
        <div className="container">
          <br />

          {/* <img src={profile} /> */}
          <section className="notSignIn">
            <a
              className="btn btn-warning btn-sm loginbtn"
              role="button"
              id="toggleLoginBtn"
              onClick={() => onToggleFormSignup()}
            >
              <i className="bi bi-key sizeforlogin"></i>
            </a>
            <br />
            {/* <br /> */}
            {/* <h4 className="text-info-sidebar">
              {countryCodeData
                ? "ลองใช้ ChaterMan เลยวันนี้"
                : "Try ChaterMan now!"}
            </h4> */}
            <br />
            <a
              className="btn btn-primary btn-sm loginbtn"
              href="#"
              role="button"
            >
              <i className="bi bi-ui-checks sizeforlogin"></i>
            </a>
          </section>

          <div className="signedInSection">
            <h4 className="text-info-sidebar text-decoration-none">{}</h4>
            <br />
            <a
              className="text-info-sidebar text-decoration-none linkSingle"
              href="/hub"
            >
              <i class="bi bi-grid-1x2-fill"></i> Go to Main page
            </a>
          </div>

          <section className="BottomSec">{Settings()}</section>
        </div>
      </div>

      <webpage className="body">
        {/* Content (Body) */}
        <a className="navbar-logo m-4" href="#">
          <b>
            ChaterMan
            <hr />
          </b>
        </a>
        <div className="background1">
          <div className="imgbackground1">
            <br />
            <div className="container">
              <div className="row">
                <div className="col-sm-6 whenToggled mobilesemi-hide">
                  <div className="card container yellow signup">
                    <br />
                    <section className="btnCloseForm">
                      <a
                        className="btn btn-close fontExplorer"
                        onClick={() => onToggleFormSignup()}
                      ></a>
                      <br />
                      <br />
                    </section>
                    <h2 className="signInWelcome">
                      {countryCodeData ? "ยินดีต้อนรับสู่ " : "Welcome to "}{" "}
                      ChaterMan
                    </h2>
                    <li>
                      {countryCodeData
                        ? "เข้าสู่ระบบหรือสมัครก่อนและสามารถไปสนุกได้เลย!"
                        : "Sign in or Sign up and ENJOYY!"}
                    </li>
                    <hr />

                    <nav className="tab-selector">
                      <div className="nav nav-tabs" id="nav-tab" role="tablist">
                        <button
                          className="nav-link active"
                          id="nav-signin-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#nav-signin"
                          type="button"
                          role="tab"
                          aria-controls="nav-signin"
                          aria-selected="true"
                        >
                          Sign in
                        </button>
                        <button
                          className="nav-link"
                          id="nav-signup-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#nav-signup"
                          type="button"
                          role="tab"
                          aria-controls="nav-signup"
                          aria-selected="false"
                        >
                          Sign up
                        </button>
                      </div>
                    </nav>

                    <div className="thebooksignup " id="nav-tabContent">
                      <div
                        className="book left-side-book container tab-pane fade show active"
                        id="nav-signin"
                        role="tabpanel"
                        aria-labelledby="nav-signin-tab"
                      >
                        <br />
                        <div className="row">
                          <div className="col-sm-8">
                            <h4>
                              {countryCodeData ? "เข้าสู่ระบบ" : "Sign in"}
                            </h4>
                          </div>
                          <div className="col-sm-4">
                            <div id="loading-login"></div>
                          </div>
                        </div>
                        <br />
                        <label id="hasRedOnError">
                          {countryCodeData ? "Email ของคุณ" : "Your email"}
                        </label>
                        <br />
                        <input
                          type="text"
                          ref={emailRef}
                          onKeyDown={(e) =>
                            e.code === "Enter" ? signIn(e) : undefined
                          }
                          onChange={() => checkWhenSignUp}
                          id="chaterin"
                          placeholder={
                            countryCodeData
                              ? "example@domain.com"
                              : "smith@fmail.con"
                          }
                        />
                        <br />
                        <br />
                        <label>
                          {countryCodeData
                            ? "รหัสผ่านสุดลับ"
                            : "Your Secret password"}
                        </label>
                        <br />
                        <input
                          ref={passRef}
                          onKeyDown={(e) =>
                            e.code === "Enter" ? signIn(e) : undefined
                          }
                          type="password"
                        />
                        <br />
                        <br />
                        <button
                          onClick={signIn}
                          className="btn btn-warning btn-sm"
                          type="submit"
                        >Sign In</button>
                        <br />
                        <p className="center-content">
                          {countryCodeData ? "หรือ" : "or"}
                        </p>
                        <Button
                          variant="contained"
                          color="default"
                          className="signinwithgoogle btn btn-light btn-sm "
                          onClick={signInWithGoogle}
                          role="button"
                        >
                          {countryCodeData
                            ? "เข้าสู่ระบบด้วย "
                            : "Sign in with "}
                          <img
                            src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png"
                            width="80"
                          />
                        </Button>
                        <br />
                        <br />
                        <Button
                          variant="contained"
                          disabled
                          className="signinwithgoogle btn btn-light btn-sm "
                        >
                          <i class="bi bi-x-diamond-fill"></i>
                          {countryCodeData
                            ? "การเข้าสู่ระบบด้วยวิธีอื่น เร็วๆนี้..."
                            : "Sign in with another method, coming soon..."}
                        </Button>
                        <br />
                        <br />
                      </div>

                      <div
                        className="book right-side-book container tab-pane fade show"
                        id="nav-signup"
                        role="tabpanel"
                        aria-labelledby="nav-signup-tab"
                      >
                        <div className="contentInSignUp" id="inSignUp">
                          <br />
                          <h4>
                            {countryCodeData
                              ? "สมัคร (เพิ่งเคยมาครั้งแรก)"
                              : "Sign up (First time)"}
                          </h4>
                          <br />
                          <Button
                            variant="text"
                            color="link"
                            href="https://www.youtube.com/c/AirwavyIT"
                          >
                            {countryCodeData
                              ? "ก่อนสมัครโปรดอ่านบทความนี้โดยการกดไปที่ข้อความสีฟ้านี้!"
                              : "BEFORE SIGN UP, PLEASE READ THIS ARTIClE BY CLICK ON THIS BLUE LINK!"}
                          </Button>
                          <br />
                          <br />

                          <div class="position-relative m-3">
                            <div class="progress firstpage">
                              <div
                                class="progress-bar"
                                role="progressbar"
                                aria-valuenow="0"
                                aria-valuemin="0"
                                aria-valuemax="100"
                              ></div>
                            </div>
                            <button
                              type="button"
                              class="progress-tab position-absolute top-0 start-0 translate-middle btn btn-sm btn-warning rounded-pill"
                            >
                              <i class="bi bi-envelope"></i>
                            </button>
                            <button
                              type="button"
                              class="progress-tab position-absolute top-0 start-50 translate-middle btn btn-sm btn-light rounded-pill"
                            >
                              <i class="bi bi-key"></i>
                            </button>
                            <button
                              type="button"
                              class="progress-tab position-absolute top-0 start-100 translate-middle btn btn-sm btn-light rounded-pill"
                            >
                              <i class="bi bi-person"></i>
                            </button>
                          </div>

                          <label id="doAlert1">
                            <i className="bi bi-envelope-fill"></i>{" "}
                            {countryCodeData
                              ? "Email ของคุณ (เอาไว้ยืนยันตัวตนหรือเก็บไว้เผื่อเกิดอะไรแปลกๆ ขึ้น)"
                              : "Your email (to Authentication or Accidentally event)"}
                          </label>
                          <br />
                          <input
                            id="signupemail"
                            onKeyDown={(e) =>
                              e.code === "Enter" ? secondPageSignUp() : undefined
                            }
                            onChange={(val) => setEmailSignUp(val.target.value)}
                            type="email"
                          />
                          <br />
                          <br />
                          <a
                            className="btn btn-warning btn-sm "
                            onClick={secondPageSignUp}
                            id="nextSignUp"
                            role="button"
                          >
                            {countryCodeData ? "ไปต่อเลย!!" : "Continue"}{" "}
                            <i className="bi bi-arrow-right"></i>
                          </a>
                          <br />
                          <br />
                        </div>

                        <div id="inSignUp2">
                          <br />
                          <h4>
                            {countryCodeData
                              ? "สมัคร (เพิ่งเคยมาครั้งแรก)"
                              : "Sign up (First time)"}
                          </h4>
                          <br />
                          
                          <div class="position-relative m-3">
                            <div class="progress secondpage">
                              <div
                                class="progress-bar"
                                role="progressbar"
                                aria-valuenow="50"
                                aria-valuemin="0"
                                aria-valuemax="100"
                              ></div>
                            </div>
                            <button
                              type="button"
                              class="progress-tab position-absolute top-0 start-0 translate-middle btn btn-sm btn-warning rounded-pill"
                            >
                              <i class="bi bi-envelope"></i>
                            </button>
                            <button
                              type="button"
                              class="progress-tab position-absolute top-0 start-50 translate-middle btn btn-sm btn-warning rounded-pill"
                            >
                              <i class="bi bi-key"></i>
                            </button>
                            <button
                              type="button"
                              class="progress-tab position-absolute top-0 start-100 translate-middle btn btn-sm btn-light rounded-pill"
                            >
                              <i class="bi bi-person"></i>
                            </button>
                          </div>
                          

                          <label id="alertPass"></label>
                          <br />
                          <label>
                            <i className="bi bi-envelope-fill"></i>{" "}
                            {countryCodeData
                              ? "นี่คือ Email ของคุณ :"
                              : "This is your email"}{" "}
                          </label>
                          <input
                            type="email"
                            ref={emailRefSignUp}
                            defaultValue={useEmailSignUp}
                          />
                          <br />
                          <label id="doAlert1">
                            <i className="bi bi-key-fill"></i>{" "}
                            {countryCodeData
                              ? "ตั้งรหัสใหม่ซะ"
                              : "Set new password"}
                          </label>
                          <br />
                          <input
                            id="signupPassword"
                            ref={passRefSignUp}
                            type="password"
                          />
                          <br />
                          <label id="doAlert1">
                            <i className="bi bi-key-fill"></i>{" "}
                            {countryCodeData
                              ? "ยืนยันอีกทีเดี๋ยวลืม"
                              : "Confirm password"}
                          </label>
                          <br />
                          <input id="confirmPassword" type="password" />
                          <br />
                          <br />
                          <a
                            className="btn btn-warning btn-sm "
                            onClick={lastPageSignUp}
                            id="nextSignUp2"
                            role="button"
                          >
                            {countryCodeData ? "ไปต่อเลย!!" : "Continue"}{" "}
                            <i className="bi bi-arrow-right"></i>
                          </a>
                          <br />
                          <br />
                        </div>

                        <div id="inSignUp3">
                          <br />
                          <h4>สมัคร (เพิ่งเคยมาครั้งแรก)</h4>
                          <br />
                          <div class="position-relative m-3">
                            <div class="progress lastpage">
                              <div
                                class="progress-bar"
                                role="progressbar"
                                aria-valuenow="100"
                                aria-valuemin="0"
                                aria-valuemax="100"
                              ></div>
                            </div>
                            <button
                              type="button"
                              class="progress-tab position-absolute top-0 start-0 translate-middle btn btn-sm btn-warning rounded-pill"
                            >
                              <i class="bi bi-envelope"></i>
                            </button>
                            <button
                              type="button"
                              class="progress-tab position-absolute top-0 start-50 translate-middle btn btn-sm btn-warning rounded-pill"
                            >
                              <i class="bi bi-key"></i>
                            </button>
                            <button
                              type="button"
                              class="progress-tab position-absolute top-0 start-100 translate-middle btn btn-sm btn-warning rounded-pill"
                            >
                              <i class="bi bi-person"></i>
                            </button>
                          </div>
                          <label id="alertPass"></label>
                          <br />
                          <label>ไปต่อให้เสร็จๆ</label>
                          <br />
                          <label id="doAlert1">
                            <i class="bi bi-person-lines-fill"></i>{" "}
                            ตั้งชื่อที่คุณชอบ
                            (มันคือชื่อที่จะปรากฏให้ทุกๆคนเห็น)
                          </label>
                          <br />
                          <input
                            id="signupUserDisplay"
                            placeholder={randomWords().toString()}
                            ref={displaySignUp}
                            type="text"
                          />
                          <br />
                          <label id="doAlert1">
                            <i class="bi bi-card-heading"></i> ชื่อ - นามสกุล
                            (คุณสามารถปิดในหน้า Profile ได้!)
                          </label>
                          <br />
                          <input
                            id="signupUsername"
                            ref={usernameSignUp}
                            type="text"
                          />
                          <br />
                          <br />
                          <a
                            className="btn btn-warning btn-sm "
                            onClick={() => {
                              if (
                                $("#signupUserDisplay").val().length === 0 ||
                                $("#signupUsername").val().length === 0
                              ) {
                                alertPacket(
                                  "Username and DisplayName is require!",
                                  "alertState"
                                );
                              } else {
                                signUp();
                              }

                              console.log([
                                $("#signupUserDisplay").val().length,
                                $("#signupUsername").val().length,
                              ]);
                            }}
                            role="button"
                          >
                            {countryCodeData ? "สมัครเลย!" : "Sign Up!"}{" "}
                            <i className="bi bi-arrow-right"></i>
                          </a>
                          <br />
                          <br />
                          <a className="" onClick={signUp} role="button">
                            {countryCodeData
                              ? "ข้ามส่วนนี้!"
                              : "Skip this section"}
                          </a>
                          <br />
                          <br />
                        </div>
                      </div>
                      <br />
                    </div>
                    <br />
                  </div>
                </div>
                <div className="col-sm-6 welcomscene">
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <div className="welcomepara">
                    <h1 className="text-welcome">
                      <b>
                        {countryCodeData
                          ? "คุยกับเพื่อนหรือ ... ทุกคน!"
                          : "Talk with your friends or ... everyone"}
                      </b>
                    </h1>
                    <hr />
                    <br />
                    <a
                      className="fontExplorer btn btn-warning btn-sm exploreBtn"
                      href="#"
                      role="button"
                    >
                      <b>
                        <i className="bi bi-arrow-down-circle"></i>{" "}
                        {countryCodeData ? "ไปดูสิ มันคืออะไร?" : "Explore"}
                      </b>
                    </a>
                    <br />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="background2">
          <br />
          <IntroducingSec />
        </div>
      </webpage>
    </div>
  );
};

export default Welcome;
