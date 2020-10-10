import React from 'react'
import './Sidebar2Row.css';
import { Avatar } from '@material-ui/core';

function Sidebar2Row({ ImageURL, title }) {
    return (
        <div className="sidebar2Row">
            <Avatar className="avatar" src={ImageURL} alt={title} />
            <h1>{title}</h1>
        </div>
    )
}

export default Sidebar2Row
