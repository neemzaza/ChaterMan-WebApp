import React, { useEffect, useState } from 'react'
import $ from 'jquery'
import firebase, { auth, url } from '../global/Database'
import countryCodeData from '../global/CookieAndDataReq'
import AlertPopUp, { render, closePopUp } from '../components/popup/AlertPopUp'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { onStartTouching, onStopTouching, onMovingScreen } from '../effect/SidablePage'

export default function AccountSetting() {

  const [languagePreview, setLanguage] = useState(countryCodeData === true ? "Thai" : "English")

  const { displayName, photoURL, phoneNumber, uid } = auth.currentUser
  const [newDisplayName, setNewDName] = useState(displayName)
  const [showEmail, hasShowEmail] = useState()

  const [alert, setAlert] = useState(null)
  const [state, alertState] = useState(null)

  const [base64File, setBase64File] = useState("");

  const [isTester, setIsTester] = useState(false)

  let newProfileURL;
  let colorThumbnail;

  const setLanguageData = () => {
    //Cookie
    const cookieName = "hasCountryData";
    const cookieValue = (languagePreview === "Thai" ? "TH" : "EN");
    const expire = new Date(214732489990483647 * 1000).toUTCString();

    document.cookie = cookieName + '=' + cookieValue + '; expires=' + expire;

    alertPacket("Success to change language. Redirecting...", "successState")
  }

  const alertPacket = (msg, state) => {
    setAlert(msg)
    alertState(state)
    render(state)
    console.log(alert)
  }

  const setDisplayNameNow = async() => {
    $("#btnchangename").addClass("loading")
    if (newDisplayName === "") {
      return (
        alertPacket("fill display name is empty!", "alertState")
      )

    }
    await firebase.auth().currentUser.updateProfile({ displayName: newDisplayName })
    alertPacket("Success to changing displayname. Redirecting...", "successState")
    
    setTimeout(() => {
      return window.location.reload()
    }, 1000);
  }

  const setProfile = () => {
    updateWhenChangedProfile(base64File)
    return (firebase.auth().currentUser.updateProfile({
      photoURL: base64File
    })
    )
  }

  const checkTesterStatus = () => {
    axios.get(`${url}get-user?uid=${uid}`).then(res => {
      // console.log(res.data[0].tester)
      setIsTester(res.data[0].tester)
    })
  }

  const onToggleTester = async() => {
    $("#onLoadingOnTester").css("display", "block");
    await axios.post(`${url}update-tester?uid=${uid}&tester=${!isTester}`).then((res) => {
      setIsTester(!isTester)
      $("#onLoadingOnTester").css("display", "none");
    })
  }

  const updateWhenChangedProfile = (profilePicSrc) => {
    axios.put(`${url}profile-pic-update`, { photoURL: profilePicSrc, UserId: uid })
  }

  const closeAccount = async() => {
    $("#btncloseacc").addClass("loading")
    await axios.put(`${url}set-status`, { UserId: uid, activate: false })
    await axios.post(`${url}disabled`, {
      UserId: firebase.auth().currentUser.uid,
      Reason: (countryCodeData ? "คุณปิดมันด้วยตัวเอง" : "Your closed it by yourself"),
      Codename: "yourself"
    })
    window.location.reload()
  }

  const base64ToBinary = (base64) => {
    const padding = '='.repeat((4 - base64.length % 4) % 4);
    const base64String = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/');
    
    var binaryString = window.atob(base64String)
    var len = binaryString.length
    var bytes = new Uint8Array(len)
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    console.log(bytes.buffer)
  }

  useEffect(() => {

    $(".settingsBody").on('scroll', () => {
      // Position
      let spyPos = $("#spy").position().top

      let accountSecPos = $("#accountSec").position().top
      let customPos = $("#customSec").position().top
      let secuPos = $("#secuSec").position().top
      let postPos = $("#postSec").position().top
      let notiPos = $("#notiSec").position().top
      let donatePos = $("#donateSec").position().top
      let totalPos = $("#totalSec").position().top
      let testerPos = $("#testerSec").position().top
      let langPos = $("#langSec").position().top

      // Icons
      let accountIcn = $("#accIcn")
      let customIcn = $("#customIcn")
      let secuIcn = $("#secuIcn")
      let postIcn = $("#postIcn")
      let notiIcn = $("#notiIcn")
      let donateIcn = $("#donateIcn")
      let totalIcn = $("#totalIcn")
      let testerIcn = $("#testerIcn")
      let langIcn = $("#langIcn")

      // Function
      if (spyPos >= accountSecPos && spyPos < customPos) {
        console.log("1")
        accountIcn.addClass("active")

        customIcn.removeClass("active")
        secuIcn.removeClass("active")
        postIcn.removeClass("active")
        notiIcn.removeClass("active")
        donateIcn.removeClass("active")
        totalIcn.removeClass("active")
        testerIcn.removeClass("active")
        langIcn.removeClass("active")

      } else if (spyPos >= customPos && spyPos < secuPos) {
        console.log("2")
        accountIcn.removeClass("active")

        customIcn.addClass("active")

        secuIcn.removeClass("active")
        postIcn.removeClass("active")
        notiIcn.removeClass("active")
        donateIcn.removeClass("active")
        totalIcn.removeClass("active")
        testerIcn.removeClass("active")
        langIcn.removeClass("active")

      } else if (spyPos >= secuPos && spyPos < postPos) {
        console.log("3")
        accountIcn.removeClass("active")
        customIcn.removeClass("active")

        secuIcn.addClass("active")

        postIcn.removeClass("active")
        notiIcn.removeClass("active")
        donateIcn.removeClass("active")
        totalIcn.removeClass("active")
        testerIcn.removeClass("active")
        langIcn.removeClass("active")

      } else if (spyPos >= postPos && spyPos < notiPos) {
        console.log("4")
        accountIcn.removeClass("active")
        customIcn.removeClass("active")
        secuIcn.removeClass("active")

        postIcn.addClass("active")

        notiIcn.removeClass("active")
        donateIcn.removeClass("active")
        totalIcn.removeClass("active")
        testerIcn.removeClass("active")
        langIcn.removeClass("active")

      } else if (spyPos >= notiPos && spyPos < donatePos) {
        console.log("5")
        accountIcn.removeClass("active")
        customIcn.removeClass("active")
        secuIcn.removeClass("active")
        postIcn.removeClass("active")

        notiIcn.addClass("active")

        donateIcn.removeClass("active")
        totalIcn.removeClass("active")
        testerIcn.removeClass("active")
        langIcn.removeClass("active")

      } else if (spyPos >= donatePos && spyPos < totalPos) {
        console.log("6")
        accountIcn.removeClass("active")
        customIcn.removeClass("active")
        secuIcn.removeClass("active")
        postIcn.removeClass("active")
        notiIcn.removeClass("active")

        donateIcn.addClass("active")

        totalIcn.removeClass("active")
        testerIcn.removeClass("active")
        langIcn.removeClass("active")

      } else if (spyPos >= totalPos && spyPos < testerPos) {
        console.log("7")
        accountIcn.removeClass("active")
        customIcn.removeClass("active")
        secuIcn.removeClass("active")
        postIcn.removeClass("active")
        notiIcn.removeClass("active")
        donateIcn.removeClass("active")

        totalIcn.addClass("active")

        testerIcn.removeClass("active")
        langIcn.removeClass("active")

      } else if (spyPos >= testerPos && spyPos < langPos) {
        console.log("8")
        accountIcn.removeClass("active")
        customIcn.removeClass("active")
        secuIcn.removeClass("active")
        postIcn.removeClass("active")
        notiIcn.removeClass("active")
        donateIcn.removeClass("active")
        totalIcn.removeClass("active")

        testerIcn.addClass("active")

        langIcn.removeClass("active")

      } else if (spyPos >= langPos) {
        console.log("9")
        accountIcn.removeClass("active")
        customIcn.removeClass("active")
        secuIcn.removeClass("active")
        postIcn.removeClass("active")
        notiIcn.removeClass("active")
        donateIcn.removeClass("active")
        totalIcn.removeClass("active")
        testerIcn.removeClass("active")

        langIcn.addClass("active")
      }




    })
  }, [])

  useEffect(() => {
    checkTesterStatus()
  }, [])

  return (
    <div className="mainBody settingsBody animate__animated" onTouchStart={(e) => onStartTouching(e.touches[0].clientX)} onTouchEnd={() => onStopTouching()}  onTouchMove={(e) => onMovingScreen(e.changedTouches[0].clientX, e.changedTouches[0].clientY)}>

    <AlertPopUp msg={alert} state={state}/>

      <div className="popupSuccess animate__animated " id="hello2">
        {/* popUp Success */}
      </div>

      <div className="popupWarn animate__animated " id="hello3">
        {/* popUp Suggested */}
      </div>

      <div class="sidebar">
        {/* Content in sidebar */}
        <div className="container">
          <section className="listsettings animate__animated animate__slideInRight">
            <a class="btn btn-sm listBtn active" href="#accountSec" role="button" id="accIcn"><i class="bi bi-person-badge sizeforlogin"></i></a>

            <a class="btn btn-sm listBtn" href="#customSec" role="button" id="customIcn"><i class="bi bi-brush sizeforlogin"></i></a>

            <a class="btn btn-sm listBtn" href="#secuSec" role="button" id="secuIcn"><i class="bi bi-shield-lock sizeforlogin"></i></a>

            <a class="btn btn-sm listBtn" href="#postSec" role="button" id="postIcn"><i class="bi bi-file-earmark-post sizeforlogin"></i></a>

            <a class="btn btn-sm listBtn" href="#notiSec" role="button" id="notiIcn"><i class="bi bi-app-indicator sizeforlogin"></i></a>

            <a class="btn btn-sm listBtn" href="#donateSec" role="button" id="donateIcn"><i class="bi bi-cash-coin sizeforlogin"></i></a>

            <a class="btn btn-sm listBtn" href="#totalSec" role="button" id="totalIcn"><i class="bi bi-cloud-snow sizeforlogin"></i></a>

            <a class="btn btn-sm listBtn" href="#testerSec" role="button" id="testerIcn"><i class="bi bi-journal-code sizeforlogin"></i></a>

            <a class="btn btn-sm listBtn" href="#langSec" role="button" id="langIcn"><h1 className="sizeforlogin">Aก</h1></a>
          </section>
          <section className="BottomSec animate__animated animate__slideInRight">
            <Link class="btn btn-light btn-sm " to="/hub" role="button" ><i class="bi bi-arrow-left-circle-fill sizeforlogin"></i></Link>
          </section>
        </div>
      </div>

      <webpage className="body settingsBody animate__animated animate__zoomIn">
        <nav className="navbar fixed-top" id="spy"></nav>
        <div className="container">
          {/* body content */}
          <br />
          <div className="card titleCardWOW">
            <h1>{countryCodeData ? "การตั้งค่า" : "Settings"}  <i class="bi bi-gear-fill"></i></h1>
          </div>
          <br />
          {/* Account Details */}
          <div className="card settingsSection setDisplayName" id="accountSec">
            <h3><b><i class="bi bi-person-badge"></i>  {countryCodeData ? "รายละเอียดบัญชี" : "Account Details"}</b></h3>
            <hr />
            <div className="row">
              <div className="col-sm-8">
                <br />
                <div className="card previewProfileCard">
                  <div className="thumbnailSec">
                    <div className="profile preview"></div>
                    <div className="nameSec preview"><h5 id="displayNamePreview">{newDisplayName}</h5></div>
                  </div>

                  <div className="bioSec">
                    <div className="about preview" id="aboutZone">
                      <h4 className="text-decoration-underline">{countryCodeData ? "เกี่ยวกับฉัน" : "About me"}</h4>
                      <p id="aboutcontent"></p>
                    </div>
                    <div className="contactSec preview" id="contactZone">
                      <h4>{countryCodeData ? "ติดต่อ" : "Contact"}</h4>
                      <p id="email">{countryCodeData ? "อีเมล" : "Email"} : {auth.currentUser.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-sm-4">
                <section>
                  <br />
                  <h4>{countryCodeData ? "ชื่อที่แสดง" : "Display name"}</h4>
                  <input type="text" onChange={e => {
                    setNewDName(e.target.value)
                    if (!e.target.value) {
                      $("#displayNamePreview").text(displayName)
                    } else {
                      $("#displayNamePreview").text(newDisplayName)
                    }
                  }} placeholder={countryCodeData ? "ชื่อใหม่ของคุณ" : "New Display Name"} defaultValue={displayName} />
                  <br /><br />
                  <br />
                  <h4>{countryCodeData ? "เกี่ยวกับฉัน" : "About me"}</h4>
                  <textarea type="text" onChange={e => {
                    // Work Zone


                    if (!e.target.value) {
                      $("#aboutZone").css("display", "none")
                      $("#aboutcontent").text("")
                    } else {
                      $("#aboutZone").css("display", "block")
                      $("#aboutcontent").text(e.target.value)
                    }
                  }} placeholder={countryCodeData ? "เรามีความสุข!!" : "I'm happy!!"} />
                  <br /><br />


                  <div class="form-check">
                    <input class="form-check-input checkbox" type="checkbox" value="" id="flexCheckDefault" onChange={e => {
                      hasShowEmail(e.target.checked)
                      if (!showEmail) {
                        $("#contactZone").css("display", "block")
                      } else {
                        $("#contactZone").css("display", "none")
                      }
                    }} />
                    <label class="form-check-label" for="flexCheckDefault">
                      {countryCodeData ? "เปิดเผยอีเมลของคุณสู่สาธารณะ" : "Public your email"}
                    </label>
                  </div>
                  <br />
                  <button class="btn btn-light btn-sm small" id="btnchangename" onClick={setDisplayNameNow} type="submit">{countryCodeData ? "บันทึก" : "Save"}</button>

                </section>
                <br/>
                <section className="danger-zone">
                  <h4>{countryCodeData ? "ปิดบัญชี" : "Close your account"}</h4>
                  <hr/>
                  <label>{countryCodeData ?
                  "ปิดบัญชีของคุณ ถ้าคุณไม่ต้องการใช้บริการอีกต่อไป โดยการกดปุ่มด้านล่างนี้ ข้อมูลส่วนตัวทั้งหมดจะถูกลบภายใน 30 วันนับจากการกดปิด ระหว่าง 30 วันคุณสามารถ เปิดกลับมาอีกครั้งได้"
                  :
                  "Close your account, if you not want to use our services by clicking below button. Your personal data will deleted automatically in 30 days from clicked close button, between 30 days. You can open it again."}</label>
                  <br/><br/>
                  <a class="btn btn-outline-danger btn-sm small" id="btncloseacc" href="#" role="button" onClick={() => closeAccount()}>{countryCodeData ? "ปิดบัญชี" : "Close your account"}</a>
                </section>
              </div>

            </div>
            {/* <a class="btn btn-secondary btn-sm " onClick={getDisplayNameUser} href="#" role="button">Test</a> */}
          </div><br />

          {/* Personalization */}
          <div className="card settingsSection setDisplayName" id="customSec">
            <h3><b><i class="bi bi-brush"></i>  {countryCodeData ? "ปรับแต่งโปรไฟล์ของคุณ" : "Personalization"}</b></h3>
            <hr />
            <div className="row">
              <div className="col-sm-8">
                <br />
                <div className="card previewProfileCard">
                  <div className="thumbnailSec" id="previewBg">
                    <img className="profile preview" src={photoURL} alt={displayName + "'s Profile Image"} id="previewImg" />
                    <div className="nameSec preview"><div className="previewBox" id="displayNamePreview"></div></div>
                  </div>

                </div>
              </div>

              <div className="col-sm-4">
                <form onSubmit={setProfile}>
                  <br />
                  <h4>{countryCodeData ? "อัปโหลดภาพโปรไฟล์ของคุณ" : "Profile Image Upload"}</h4>
                  <input type="file" accept="image/*" id="imgInput" name="post_image" className="form-control uploader" onChange={e => {
                    let imgInput = document.querySelector("#imgInput")
                    let previewImg = document.querySelector("#previewImg")

                    const [file] = imgInput.files;
                    newProfileURL = URL.createObjectURL(file)

                    if (file) {
                      previewImg.src = URL.createObjectURL(file)
                      newProfileURL = previewImg.src

                      // const encodeBase64Image = (file) => {
                        var reader = new FileReader();
                        // if (file) {
                          reader.readAsDataURL(file);
                          reader.onload = () => {
                            var base64 = reader.result;
                            base64ToBinary(base64)
                            setBase64File(base64);
                            // console.log(Buffer.from(base64, "base64").toString());
                          };
                          reader.onerror = (err) => {
                            console.log("Found expection: " + err);
                          };
                        // }
                      // };
                    }
                  }} />

                  <br />
                  <div className="card inputcolorsel"><label>{countryCodeData ? "เลือกสีพื้นหลังของคุณ" : "Choose your background color"}</label>&nbsp;&nbsp;&nbsp;<input type="color" className="colorSelector" onChange={e => {
                    colorThumbnail = e.target.value
                    $("#previewBg").css("background", colorThumbnail)
                  }} /></div>
                  <br /><br />
                  <button class="btn btn-light btn-sm small" type="submit">{countryCodeData ? "บันทึก" : "Save"}</button>

                </form>
              </div>

            </div>
            {/* <a class="btn btn-secondary btn-sm " onClick={getDisplayNameUser} href="#" role="button">Test</a> */}
          </div><br />

          {/* Security */}
          <div className="card settingsSection setDisplayName" id="secuSec">
            <h3><i class="bi bi-shield-lock"></i>  {countryCodeData ? "ความปลอดภัย" : "Security"}</h3>
            <hr />
            <form onSubmit={setDisplayNameNow}>
              <br />
              <h4>New Display name</h4>
              <input type="text" onChange={e => setNewDName(e.target.value)} placeholder="Your display name" />
              <br /><br />
              <button class="btn btn-light btn-sm " type="submit">Change / Set display name</button>
            </form>
            {/* <a class="btn btn-secondary btn-sm " onClick={getDisplayNameUser} href="#" role="button">Test</a> */}
          </div><br />

          {/* Post Manager */}
          <div className="card settingsSection setDisplayName" id="postSec">
            <h3><i class="bi bi-file-earmark-post"></i>  {countryCodeData ? "ตัวจัดการโพสต์" : "Post Manager"}</h3>
            <hr />
            <form onSubmit={setDisplayNameNow}>
              <br />
              <h4>New Display name</h4>
              <input type="text" onChange={e => setNewDName(e.target.value)} placeholder="Your display name" />
              <br /><br />
              <button class="btn btn-light btn-sm " type="submit">Change / Set display name</button>
            </form>
            {/* <a class="btn btn-secondary btn-sm " onClick={getDisplayNameUser} href="#" role="button">Test</a> */}
          </div><br />

          {/* Notification */}
          <div className="card settingsSection setDisplayName" id="notiSec">
            <h3><i class="bi bi-app-indicator sizeforlogin"></i>  {countryCodeData ? "การแจ้งเตือน" : "Notification"}</h3>
            <hr />
            <form onSubmit={setDisplayNameNow}>
              <br />
              <h4>New Display name</h4>
              <input type="text" onChange={e => setNewDName(e.target.value)} placeholder="Your display name" />
              <br /><br />
              <button class="btn btn-light btn-sm " type="submit">Change / Set display name</button>
            </form>
            {/* <a class="btn btn-secondary btn-sm " onClick={getDisplayNameUser} href="#" role="button">Test</a> */}
          </div><br />

          {/* Donation */}
          <div className="card settingsSection setDisplayName" id="donateSec">
            <h3><i class="bi bi-cash-coin sizeforlogin"></i>  {countryCodeData ? "การสนับสนุน" : "Donation"}</h3>
            <hr />
            <br />
            <h4>{countryCodeData ? "การสนับสนุน" : "Donation"}</h4>
            <p>{countryCodeData ? "คุณสามารถสนับสนุนได้โดยกดปุ่ม Subscribe ด้านล่างเพื่อสมัครเข้าสู่ airwavy membership ระดับ 'Supwavy!'35 บาท ต่อ เดือน" : "You can subscribe into airwavy membership tier 'Supwavy!' 35฿ / month"}</p>
            <a class="btn btn-outline-success btn-sm donatebtn" href="https://youtube.com/c/AirwavyIT/join" target="blank" role="button"><i class="bi bi-cash"></i>   Subscribe</a>
            {/* <a class="btn btn-secondary btn-sm " onClick={getDisplayNameUser} href="#" role="button">Test</a> */}
          </div><br />

          {/* Post Total Storage */}
          <div className="card settingsSection setDisplayName" id="totalSec">
            <h3><i class="bi bi-cloud-snow"></i>  {countryCodeData ? "การใช้พื้นที่ของโพสต์ทั้งหมด" : "Post Total Storage"}</h3>
            <hr />
            <form onSubmit={setDisplayNameNow}>
              <br />
              <h4>New Display name</h4>
              <input type="text" onChange={e => setNewDName(e.target.value)} placeholder="Your display name" />
              <br /><br />
              <button class="btn btn-light btn-sm " type="submit">Change / Set display name</button>
            </form>
            {/* <a class="btn btn-secondary btn-sm " onClick={getDisplayNameUser} href="#" role="button">Test</a> */}
          </div><br />

          {/* Tester Club */}
          <div className="card settingsSection setDisplayName" id="testerSec">
            <h3><i class="bi bi-journal-code"></i>  {countryCodeData ? "เทสเตอร์คลับ" : "Tester Club"}</h3>
            <hr />
            <section id="mustJoined">
              <div className="flex title-each-section">
                <h4>Develop</h4>&nbsp;&nbsp;&nbsp;<div className="loading-post" id="onLoadingOnTester"></div>
              </div>
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault" onClick={onToggleTester} checked={isTester} />
                <label class="form-check-label" for="flexSwitchCheckDefault">Developer mode</label>
              </div>
            </section>
            {/* <a class="btn btn-secondary btn-sm " onClick={getDisplayNameUser} href="#" role="button">Test</a> */}
          </div><br />

          {/* Language */}
          <div className="card settingsSection setDisplayName" id="langSec">
            <h3><i className="sizeforlogin">Aก</i>  {countryCodeData ? "ภาษา" : "Language"}</h3>
            <hr />
            <form onSubmit={setLanguageData}>
              <br />
              <h4>{countryCodeData ? "เปลี่ยนภาษาหน้าเว็บที่นี่" : "Change web language here"}</h4>
              <div class="btn-group dropup">
                <button type="button" class="btn btn-primary small">{languagePreview}</button>
                <button type="button" class="btn btn-light dropdown-toggle dropdown-toggle-split small" data-bs-toggle="dropdown" aria-expanded="false">
                  <span class="visually-hidden">Toggle Dropdown</span>
                </button>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="#" onClick={() => { setLanguage("English") }}>English</a></li>
                  <li><a class="dropdown-item" href="#" onClick={() => { setLanguage("Thai") }}>Thai</a></li>
                </ul>
              </div>
              <br /><br />
              <button class="btn btn-light btn-sm small" type="submit">{countryCodeData ? "เปลี่ยนภาษาหน้าเว็บ" : "Change web language"}</button>
            </form>
            {/* <a class="btn btn-secondary btn-sm " onClick={getDisplayNameUser} href="#" role="button">Test</a> */}
          </div><br />

          <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />

        </div>
      </webpage>

    </div>
  )
}


