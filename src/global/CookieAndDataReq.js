// import $ from 'jquery'
import axios from 'axios'

var setBoolReqData = false

  // Thai = true , Eng = false
  
  var countryCodeData = false

  const requestUrl = "http://ip-api.com/json";

  let getCountryData = ""

    const acceptAgree = async() => {
    console.log("Waiting")
    await axios.get(requestUrl).then(
      res => {
        console.log("Done!")
        getCountryData = res.data.countryCode
        createCookie()
      }
    ).catch(
      err => {
        return console.log(err)
      }
    )
  }

  const createCookie = () => {
    //Cookie
    const cookieName = "hasCountryData";
    const cookieValue = getCountryData;
    const expire = new Date(214732489990483647 * 1000).toUTCString();

    document.cookie = cookieName + '=' + cookieValue + '; expires=' + expire;

    // setBoolReqData = true
    document.location.reload()
  }

  //get cookie from user client

  const allCookie = document.cookie
  const checkCountryCodeData = allCookie.split('; ')

  if (checkCountryCodeData.includes("hasCountryData=TH")) {
    setBoolReqData = true
    countryCodeData = true
    console.log("Thai language")
  } else if (checkCountryCodeData.includes("hasCountryData=EN")) {
    setBoolReqData = true
    countryCodeData = false
    console.log("English language")
    
  } else {
    setBoolReqData = false
    countryCodeData = false
    console.log("Not have data")
  }

  export default countryCodeData
  export {acceptAgree, setBoolReqData}