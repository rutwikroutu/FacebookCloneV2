import React, { useState, useEffect } from 'react'
import './ProfileSidebar.css';
import { db } from './firebase';

function ProfileSidebar({ username }) {
    var [nposts, setNPosts] = useState([])
    const [cuserdata, setCUserdata] = useState()

    useEffect(() => {
        db.collection('posts').onSnapshot((snapshot) => {
            snapshot.docs.map((doc) => {
                if (doc.data().username == username) {
                    if (nposts.length !== 9) {
                        if (!nposts.includes(doc.data().imageUrl)) {
                            nposts.push(doc.data().imageUrl)
                        }
                    }
                }
            })
        })
    }, [])

    useEffect(() => {
        db.collection('users').onSnapshot((snapshot) => {
            snapshot.docs.map((doc) => {
                if (doc.data().displayName == username) {
                    setCUserdata(doc.data())
                }
            })
        })
    }, [])

    return (
        <div className="profileSidebar" >
            <div className="posts2">
                <h1>Intro</h1>
                <div className="intro">
                    {
                        cuserdata?.birthday ? (
                            <div className="introblock">
                                <img src="https://static.xx.fbcdn.net/rsrc.php/v3/y5/r/IqqJ0EjDF9B.png" className="birthday" />
                                <h1>{`${cuserdata?.birthday[0]} - ${cuserdata?.birthday[1]} - ${cuserdata?.birthday[2]}`}</h1>
                            </div>
                        ) : (
                                console.log()
                            )

                    }
                </div>
            </div>
            <div className="posts2">
                <h1>Photos</h1>
                <div className="photos">
                    {
                        nposts.length === 0 ? (
                            <h1 className="NoNotif">It seems that there are no image posted by this user</h1>
                        ) : (
                                nposts.map((post) => (
                                    <img src={post} />
                                ))
                            )

                    }
                </div>
            </div>
            <div class="hr profile" />
            <div class="policies profile">
                <p>Privacy</p>
                <p class="dot">·</p>
                <p>Terms</p>
                <p class="dot">·</p>
                <p>Advertising</p>
                <p class="dot">·</p>
                <p>Ad choices</p>
                <i class="ads" />
                <p class="dot">·</p>
                <p>Cookies</p>
                <p class="dot">·</p>
                <p>More</p>
                <p class="dot">·</p>
                <p>Facebook © 2020</p>
            </div>
        </div >
    )
}

export default ProfileSidebar
