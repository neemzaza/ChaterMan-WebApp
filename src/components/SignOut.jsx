import {auth} from '../global/Database'
import React from 'react'

const SignOut = () => {
    return auth.currentUser && (
      <a class="btn btn-danger btn-sm " href="/#" onClick={() => {
        auth.signOut() 
      }} role="button"><i class="bi bi-backspace-reverse sizeforlogin"></i></a>
    )
  }

export default SignOut