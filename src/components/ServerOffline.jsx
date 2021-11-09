import React from 'react'
import { Link } from 'react-router-dom'

export default function ServerOffline() {
    return (
            <nav class="navbar navbar-expand-sm fixed-top offline-bar">
                <p class="m-2"><i class="bi bi-wifi-off"></i> Look like a server is offline. Sorry for any inconvenience. See status on <Link to="/status">{"chaterman.net"}/status</Link></p>
            </nav>
    )
}
