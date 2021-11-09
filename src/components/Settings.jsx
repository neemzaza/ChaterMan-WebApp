import React from 'react'
import { Link } from 'react-router-dom'

export default function Settings() {
    return (
        <Link className="btn btn-secondary settingbtn btn-sm loginbtn" to="/settings" role="button">
            <i className="bi bi-gear sizeforlogin"></i>
        </Link>
    )
}
