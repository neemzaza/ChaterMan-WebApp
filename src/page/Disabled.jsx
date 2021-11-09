import React, {useEffect, useState} from 'react'
import axios from 'axios'
import countryCodeData from '../global/CookieAndDataReq'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, url } from '../global/Database'
import $ from 'jquery'

export default function Disabled() {
    const getDateFromOrder365 = (date) => {
        let start = new Date(date.getFullYear(), 0, 0)
        let diff = (date - start) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000)
        let oneDay = 1000 * 60 * 60 * 24
        let day = Math.floor(diff / oneDay)
        return day
    }
    const [user] = useAuthState(auth)
    const openAccount = async() => {
        $("#btnactivate").addClass("loading")
        await axios.put(`${url}set-status`, { UserId: user.uid, activate: true })
        await axios.delete(`${url}disabled-delete?uid=${user.uid}`)
        window.location.reload()
        
    }
    const [reason, setReason] = useState(countryCodeData ? "ไม่มีเหตุผล" : "Not have any reasons yet.")
    const [codename, setCodename] = useState("Null")
    const [timeleft, setTimeleft] = useState(30)
    if (user) {
        axios.get(`${url}get-user?uid=${user.uid}`).then(res => {
            if (!res.data[0].activate) {
                axios.get(`${url}get-blacklist?uid=${user.uid}`).then((res) => {
                    setReason(res.data[0].Reason)
                    setCodename(res.data[0].Codename)
                    setTimeleft(getDateFromOrder365(new Date(res.data[0].Expire)) - getDateFromOrder365(new Date()))
                })
            }
        })
        
    }
    useEffect(() => {
        if (codename === "yourself") {
            $("#yourself").css("display", "block")
        }
    }, [codename]);
    return (
        <div className="mainBody animate__animated disabled-page">
            <div class="card">
              <div class="card-body">
                <h1><i class="bi bi-person-x-fill"></i> {countryCodeData ? "บัญชีของคุณถูกปิด" : "Your account is disabled"}</h1>
                <p>{countryCodeData ? "สาเหตุ" : "REASON"} - {reason}</p>
                <h5><i class="bi bi-trash"></i>{countryCodeData ? `ข้อมูลทั้งหมดจะถูกลบภายใน ${timeleft} วัน` : `All personal data will delete in ${timeleft} days`}</h5>
                <hr/>
                <section id="yourself">
                    <h5><i class="bi bi-toggle-on"></i> {countryCodeData ? "เปิดบัญชีกลับมาอีกครั้ง" : "Activate your account again"}</h5>
                    <br/>
                    <a class="btn btn-outline-light btn-sm small" href="#" id="btnactivate" role="button" onClick={() => openAccount()}><i class="bi bi-toggle-on"></i> {countryCodeData ? "เปิดบัญชีของคุณอีกครั้ง" : "Activate your account"}</a>
                </section>
               
              </div>
              
            </div>
        </div>
    )
}
