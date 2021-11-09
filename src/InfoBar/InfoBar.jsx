import React from 'react';
import { Link } from 'react-router-dom';

const Infobar = ({ room }) => {
    return (
        <div className="info-bar">
            <div className="left-inner-container">
                <p className="online-icon"></p>
                <h5>{room}</h5>
            </div>
        </div>
    );
}

export default Infobar;
