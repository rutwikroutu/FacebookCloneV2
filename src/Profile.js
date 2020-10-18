import React, { useState, useEffect } from 'react'
import './Profile.css';
import { useParams } from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import { storage, db } from './firebase';
import firebase from "firebase";
import { useHistory } from 'react-router-dom';
import ProfileSidebar from './ProfileSidebar';
import ImageUpload from './ImageUpload';
import Post from './Post';
import $ from 'jquery';

function Profile({ user }) {
    const { username, uid } = useParams();
    const [open, setOpen] = useState(false);
    const [scroll, setScroll] = React.useState('paper');
    const [imageURL, setImageURL] = useState('');
    const history = useHistory('');
    const [progress, setProgress] = useState(0);
    const [posts, setPosts] = useState([]);
    const [profileUserData, setProfileUserData] = useState();
    const [bio, setBio] = useState('');
    const [bioPresent, setBioPresent] = useState(false)

    var currentUser = firebase.auth().currentUser;

    useEffect(() => {
        db.collection('users').doc(uid).onSnapshot((doc) => {
            setProfileUserData(doc.data());
        });
    }, [])

    if (profileUserData !== undefined) {
        if (profileUserData?.displayName !== user?.displayName) {
            document.getElementsByClassName('inputImage')[0].disabled = true;
            document.getElementsByClassName('profileAvatar')[0].style.cursor = 'context-menu';
            document.getElementsByClassName('bio')[0].style.display = 'none';
            document.getElementById('documentUsername').style.marginBottom = '20px';
            document.getElementsByClassName('editProfile')[0].style.display = 'none';
            document.getElementsByClassName('addFriend')[0].style.display = 'flex';

        } else {
            document.getElementsByClassName('editProfile')[0].style.display = 'flex';
            document.getElementsByClassName('addFriend')[0].style.display = 'none';
        }
    }
    const handleChange = (e) => {
        setImageURL(e.target.files[0]);
    };

    const uploadFileWithClick = () => {
        document.getElementsByClassName('inputImage')[0].click();
    }

    document.title = `${username} | Facebook`

    const myAccount = username === user.displayName;

    const handleClose = () => {
        setOpen(false);
        setImageURL("");
    };

    const descriptionElementRef = React.useRef(null);
    React.useEffect(() => {
        if (open) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open]);

    useEffect(() => {
        if (imageURL !== '') {
            setOpen(true)
        }
    }, [imageURL])

    const handleUpload = (event) => {

        document.getElementsByClassName('progress')[0].style.display = 'block';
        event.preventDefault();
        const uploadTask = storage.ref(`profileImages/${user.uid}`).put(imageURL);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                console.log(error);
                alert(error.message);
            },
            () => {
                storage
                    .ref("profileImages")
                    .child(user.uid)
                    .getDownloadURL()
                    .then(url => {
                        currentUser.updateProfile({
                            photoURL: url
                        }).then(function () {
                            db.collection('users').doc(uid).update({
                                photoURL: url
                            }).then(function () {
                                handleClose();
                                setProgress(0);

                                window.location.href = `/${user.displayName}/${user.uid}`
                            })
                        })
                    })
            }
        )
    }

    const addBio = () => {
        $('.bio')[0].style.display = 'none';
        $('.bioFields')[0].style.display = 'flex';
    }

    const collapseBio = () => {
        $('.bio')[0].style.display = 'block';
        $('.bioFields')[0].style.display = 'none';
    }

    const bioSet = (e) => {
        setBio(e.target.value)
        if (101 - e.target.value.length < 0 || e.target.value.length === 0) {
            $('.saveButton')[0].style.backgroundColor = '#3A3B3C';
            $('.saveButton')[0].style.opacity = 0.4;
        } else {
            $('.saveButton')[0].style.opacity = 1;
            $('.saveButton')[0].style.backgroundColor = '#2D88FF';
        }
    }

    const bioUpdate = () => {
        if (101 - bio.length < 0 || bio.length === 0) {
            return;
        } else {
            db.collection('users').doc(uid).update({
                bio: bio
            }).then(
                alert("Pleased reload the page to see your changes")
            )
        }
    }

    useEffect(() => {
        db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
            setPosts(snapshot.docs.map(doc => ({
                id: doc.id,
                post: doc.data(),
            })));
        })
    }, []);

    useEffect(() => {
        db.collection('users').doc(uid).onSnapshot(doc => {
            if (doc.data().bio && doc.data().bio === "") {
                setBioPresent(false)
            } else {
                setBio(doc.data().bio)
                setBioPresent(true)
            }
        })
    }, [])

    useEffect(() => {
        if (bioPresent === false) {
            console.log()
        } else {
            $('.bio')[0].innerText = "Edit";
            $('.bioText')[0].innerText = bio;
        }
    }, [bioPresent])

    return (
        <div className="profile">
            <Dialog
                open={open}
                onClose={handleClose}
                scroll={scroll}
                className="dialog2"
            >
                <div class="makeStyles-paper-1">
                    <div class="profileHead2">
                        <p>Are you sure you want to change your profile picture ? Changes cannot be reverted </p>
                        <progress value={progress} max="100" style={{ display: 'none' }} className="progress" />
                        <div className="buttons">
                            <button onClick={handleUpload}>Yes</button>
                            <button onClick={handleClose}>No</button>
                        </div>
                    </div>
                </div>
            </Dialog>
            <div className="profile__topSection">
                <div className="profile__coverPhoto">
                    <img onClick={uploadFileWithClick} src={profileUserData?.photoURL} className="profileAvatar" />
                    <input onChange={handleChange} type="file" accept="image/*" className='inputImage' />
                </div>

                <h1 id="documentUsername">{username}</h1>
                <p className="bioText"></p>
                <p onClick={addBio} className="bio">Add Bio</p>
                <div className="bioFields">
                    <textarea value={bio} placeholder="Describe who you are" onChange={bioSet} className="bioInput" />
                    <p>{`${101 - bio.length} characters remaining`}</p>
                    <div className="cancelAndSaveButtons">
                        <button onClick={collapseBio} >Cancel</button>
                        <button onClick={bioUpdate} className="saveButton">Save</button>
                    </div>
                </div>

                <div className="hr4" />

                <div className="profileHeader__options">
                    <div className="profileHeader__left">
                        <ul>
                            <li className="selected">Timeline</li>
                            <li>About</li>
                            <li>Friends</li>
                            <li>Photos</li>
                            <li>Archive</li>
                            <li>More</li>
                            <li className="rect editProfile"><img src="https://static.xx.fbcdn.net/rsrc.php/v3/yl/r/tmaz0VO75BB.png" /><p>Edit Profile</p></li>
                            <li className="rect addFriend"><img src="https://static.xx.fbcdn.net/rsrc.php/v3/yq/r/33EToHSZ94f.png" /><p>Add Friend</p></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="postsAndIntro">
                <ProfileSidebar username={username} />
                <div className="postAndWatch">
                    {
                        username === user?.displayName ? (
                            <ImageUpload username={username} />
                        ) : (
                                console.log()
                            )
                    }
                    {
                        posts.map(({ id, post }) => (
                            post.username !== username ? (
                                console.log()
                            ) : (
                                < Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} noLikes={post.noLikes} postUserId={post.uid} />
                                )
                        ))
                    }
                </div>
            </div>
        </div >
    )
}

export default Profile
