import React from 'react'
import './Sidebar2.css';
import Sidebar2Row from './Sidebar2Row.js';

function Sidebar2() {
    return (
        <div className="sidebar2">
            <div class="hr" />

            <div class="details">
                <h1>Contacts</h1>
                <i class="searchIcon2" />
                <i class="more" />
            </div>
            <div class="contacts">
                <Sidebar2Row ImageURL="https://scontent.fhyd11-1.fna.fbcdn.net/v/t1.0-1/p148x148/118481251_3275143269198791_1562775451854010190_n.jpg?_nc_cat=102&_nc_sid=dbb9e7&_nc_ohc=DJ5eF_SWz8gAX_k1CMp&_nc_ht=scontent.fhyd11-1.fna&tp=6&oh=3eb6fe833a57e157b042a857b554baba&oe=5F739318" title="Kailash Routu Rao" />
                <Sidebar2Row ImageURL="https://scontent.fhyd11-1.fna.fbcdn.net/v/t1.0-1/cp0/c0.0.74.74a/p74x74/1964942_1380791475530225_1868751307_n.jpg?_nc_cat=111&_nc_sid=7206a8&_nc_ohc=wucfE-7H3-sAX9dzxiz&_nc_ht=scontent.fhyd11-1.fna&oh=f07f9733ea878c897b8d355c6eea7272&oe=5F72C094" title="Lalitha Routu" />
                <Sidebar2Row ImageURL="https://scontent.fhyd11-1.fna.fbcdn.net/v/t1.0-1/p480x480/23915747_1743376409070431_4370438628077084250_n.jpg?_nc_cat=102&_nc_sid=7206a8&_nc_ohc=dqZ-_Ie8MgoAX9v6cm3&_nc_ht=scontent.fhyd11-1.fna&tp=6&oh=b475ffff66ac8b05ddd63609035aa088&oe=5F7454E7" title="Sampath Routu" />
                <Sidebar2Row ImageURL="https://scontent.fhyd11-1.fna.fbcdn.net/v/t1.0-1/cp0/p74x74/46699754_10218360999073422_4667207936836108288_n.jpg?_nc_cat=106&_nc_sid=7206a8&_nc_ohc=csQremrGf18AX8aniwq&_nc_ht=scontent.fhyd11-1.fna&oh=7fe42cf47d2512f402b3053187eb5fb6&oe=5F71F4C8" title="Anand Botcha" />
                <Sidebar2Row ImageURL="https://scontent.fhyd11-1.fna.fbcdn.net/v/t1.0-1/p120x120/80855783_10157873314004486_4183724417513160704_o.jpg?_nc_cat=1&_nc_sid=1eb0c7&_nc_ohc=hDdT_bqb4JoAX8CG3dv&_nc_ht=scontent.fhyd11-1.fna&tp=6&oh=674ff55df9e0e6ebf9cbaaf04184e964&oe=5F735E51" title="Ed Sheeran" />
                <Sidebar2Row ImageURL="https://scontent.fhyd11-1.fna.fbcdn.net/v/t1.0-1/p120x120/96418866_10158756322663888_5611380772293312512_o.jpg?_nc_cat=1&_nc_sid=1eb0c7&_nc_ohc=A8HMI6p_yGcAX_NRMRk&_nc_ht=scontent.fhyd11-1.fna&tp=6&oh=cbb75e2641868133ddd307ccc540a3e1&oe=5F743AE4" title="Justin Bieber" />
            </div>
        </div >
    )
}

export default Sidebar2
