// Firebase Database

import firebase from 'firebase'
import 'firebase/auth'
import 'firebase/firestore'

firebase.initializeApp({
    apiKey: "AIzaSyCfocaqP_lTmko7aP5RfObg0fFmtKVENCU",
    authDomain: "chaterman-81d48.firebaseapp.com",
    projectId: "chaterman-81d48",
    storageBucket: "chaterman-81d48.appspot.com",
    messagingSenderId: "137815351088",
    appId: "1:137815351088:web:ef46a90164d3dd38bab2f5"
  })

const auth = firebase.auth()
const firestore = firebase.firestore()
const port = 5001;
const url = `http://192.168.1.107:${port}/`
const domain = `chaterman.net`

export {auth, firestore, url, domain}
export default firebase