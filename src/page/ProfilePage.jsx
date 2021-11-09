import React, { useState } from 'react'
import $ from 'jquery'

import firebase, {auth, firestore} from '../global/Database'

export default function ProfilePage() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            console.log(user.email)
        }
    })
    return (
        <div>
            <h1>{}</h1>
        </div>
    )
}
