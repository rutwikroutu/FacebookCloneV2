import React, { useState, useEffect } from 'react'
import './Post.css';
import { Avatar } from '@material-ui/core';
import { storage, db } from './firebase';
import firebase from "firebase";
import {Link} from 'react-router-dom';

function Post({ postId, user, username, caption, imageUrl, noLikes, postUserId }) {

    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');
    const [show, setShow] = useState('like2');
    const [show2, setShow2] = useState('textforlike');
    const [posterImage, setPosterImage] = useState('')

    const [postUser, setPostUser] = useState();

    useEffect(() => {
        if(postUserId) {
            db.collection('users').doc(postUserId).onSnapshot((snapshot) => {
                setPostUser(snapshot.data())
            })
        }

        console.log(postUserId)
    }, [postUserId])

    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db.collection("posts").doc(postId).collection("comments").orderBy("timestamp", "desc").onSnapshot((snapshot) => {
                setComments(snapshot.docs.map((doc) => doc.data()));
            });
        }
        return () => {
            unsubscribe();
        }
    }, [postId]);

    useEffect(() => {
        db.collection("posts")
            .doc(postId)
            .collection("likes")
            .doc(user.uid)
            .get()
            .then(doc2 => {
                if (doc2.data()) {
                    if (show == 'like2') {
                        setShow('like2 blue');
                        setShow2('textforlike bluetextforlike')
                    } else {
                        setShow('like2');
                        setShow2('textforlike')
                    }
                }
            })
    }, [postId, user.uid]);

    const likeHandle = (event) => {
        event.preventDefault();
        if (show == 'like2') {
            setShow('like2 blue');
            setShow2('textforlike bluetextforlike')
        } else {
            setShow('like2');
            setShow2('textforlike')
        }

        db.collection('posts')
            .doc(postId)
            .get()
            .then(docc => {
                const data = docc.data()
                console.log(show)
                if (show == 'like2') {
                    db.collection("posts")
                        .doc(postId)
                        .collection("likes")
                        .doc(user.uid)
                        .get()
                        .then(doc2 => {
                            if (doc2.data()) {
                                console.log(doc2.data())
                            } else {
                                db.collection("posts").doc(postId).collection("likes").doc(user.uid).set({
                                    likes: 1
                                });
                                db.collection('posts').doc(postId).update({
                                    noLikes: data.noLikes + 1
                                });
                            }
                        })

                } else {
                    db.collection('posts').doc(postId).collection('likes').doc(user.uid).delete().then(function () {
                        db.collection('posts').doc(postId).update({
                            noLikes: data.noLikes - 1
                        });
                    })
                }
            })

    }


    const postComment = (event) => {
        event.preventDefault();

        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username: postUser?.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            photoURL: user?.photoURL
        });
        setComment('');
    }

    useEffect(() => {
        if(postUserId) {
            db.collection('users').doc(postUserId).onSnapshot((snapshot) => {
                setPosterImage(snapshot.data().photoURL)
                console.log(snapshot.data())
            })
        }
    }, [])
    

    return (
        <div className="post">
            <div className="post__header">
                <Avatar
                    className="post__avatar"
                    alt=""
                    src={posterImage !== '' && posterImage}
                />
                <h3 onClick={() => {
                    window.location.href=  `/${username}/${user?.uid}`
                }} style={{cursor: 'pointer'}}>{username}</h3>
                <i class="post__verified" />
            </div>

            <h4 className="post__text">{caption}</h4>

            <img src={imageUrl} className="post__image" />

            <div className="post__likeandlove">
                <img src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 16 16'%3e%3cdefs%3e%3clinearGradient id='a' x1='50%25' x2='50%25' y1='0%25' y2='100%25'%3e%3cstop offset='0%25' stop-color='%2318AFFF'/%3e%3cstop offset='100%25' stop-color='%230062DF'/%3e%3c/linearGradient%3e%3cfilter id='c' width='118.8%25' height='118.8%25' x='-9.4%25' y='-9.4%25' filterUnits='objectBoundingBox'%3e%3cfeGaussianBlur in='SourceAlpha' result='shadowBlurInner1' stdDeviation='1'/%3e%3cfeOffset dy='-1' in='shadowBlurInner1' result='shadowOffsetInner1'/%3e%3cfeComposite in='shadowOffsetInner1' in2='SourceAlpha' k2='-1' k3='1' operator='arithmetic' result='shadowInnerInner1'/%3e%3cfeColorMatrix in='shadowInnerInner1' values='0 0 0 0 0 0 0 0 0 0.299356041 0 0 0 0 0.681187726 0 0 0 0.3495684 0'/%3e%3c/filter%3e%3cpath id='b' d='M8 0a8 8 0 00-8 8 8 8 0 1016 0 8 8 0 00-8-8z'/%3e%3c/defs%3e%3cg fill='none'%3e%3cuse fill='url(%23a)' xlink:href='%23b'/%3e%3cuse fill='black' filter='url(%23c)' xlink:href='%23b'/%3e%3cpath fill='white' d='M12.162 7.338c.176.123.338.245.338.674 0 .43-.229.604-.474.725a.73.73 0 01.089.546c-.077.344-.392.611-.672.69.121.194.159.385.015.62-.185.295-.346.407-1.058.407H7.5c-.988 0-1.5-.546-1.5-1V7.665c0-1.23 1.467-2.275 1.467-3.13L7.361 3.47c-.005-.065.008-.224.058-.27.08-.079.301-.2.635-.2.218 0 .363.041.534.123.581.277.732.978.732 1.542 0 .271-.414 1.083-.47 1.364 0 0 .867-.192 1.879-.199 1.061-.006 1.749.19 1.749.842 0 .261-.219.523-.316.666zM3.6 7h.8a.6.6 0 01.6.6v3.8a.6.6 0 01-.6.6h-.8a.6.6 0 01-.6-.6V7.6a.6.6 0 01.6-.6z'/%3e%3c/g%3e%3c/svg%3e" className="post__like"/>
                <img src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 16 16'%3e%3cdefs%3e%3clinearGradient id='a' x1='50%25' x2='50%25' y1='0%25' y2='100%25'%3e%3cstop offset='0%25' stop-color='%23FF6680'/%3e%3cstop offset='100%25' stop-color='%23E61739'/%3e%3c/linearGradient%3e%3cfilter id='c' width='118.8%25' height='118.8%25' x='-9.4%25' y='-9.4%25' filterUnits='objectBoundingBox'%3e%3cfeGaussianBlur in='SourceAlpha' result='shadowBlurInner1' stdDeviation='1'/%3e%3cfeOffset dy='-1' in='shadowBlurInner1' result='shadowOffsetInner1'/%3e%3cfeComposite in='shadowOffsetInner1' in2='SourceAlpha' k2='-1' k3='1' operator='arithmetic' result='shadowInnerInner1'/%3e%3cfeColorMatrix in='shadowInnerInner1' values='0 0 0 0 0.710144928 0 0 0 0 0 0 0 0 0 0.117780134 0 0 0 0.349786932 0'/%3e%3c/filter%3e%3cpath id='b' d='M8 0a8 8 0 100 16A8 8 0 008 0z'/%3e%3c/defs%3e%3cg fill='none'%3e%3cuse fill='url(%23a)' xlink:href='%23b'/%3e%3cuse fill='black' filter='url(%23c)' xlink:href='%23b'/%3e%3cpath fill='white' d='M10.473 4C8.275 4 8 5.824 8 5.824S7.726 4 5.528 4c-2.114 0-2.73 2.222-2.472 3.41C3.736 10.55 8 12.75 8 12.75s4.265-2.2 4.945-5.34c.257-1.188-.36-3.41-2.472-3.41'/%3e%3c/g%3e%3c/svg%3e" className="post__lol" />
                <img src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 16 16'%3e%3cdefs%3e%3clinearGradient id='a' x1='50%25' x2='50%25' y1='10.25%25' y2='100%25'%3e%3cstop offset='0%25' stop-color='%23FEEA70'/%3e%3cstop offset='100%25' stop-color='%23F69B30'/%3e%3c/linearGradient%3e%3clinearGradient id='d' x1='50%25' x2='50%25' y1='0%25' y2='100%25'%3e%3cstop offset='0%25' stop-color='%23472315'/%3e%3cstop offset='100%25' stop-color='%238B3A0E'/%3e%3c/linearGradient%3e%3clinearGradient id='e' x1='50%25' x2='50%25' y1='0%25' y2='100%25'%3e%3cstop offset='0%25' stop-color='%23191A33'/%3e%3cstop offset='87.162%25' stop-color='%233B426A'/%3e%3c/linearGradient%3e%3clinearGradient id='j' x1='50%25' x2='50%25' y1='0%25' y2='100%25'%3e%3cstop offset='0%25' stop-color='%23E78E0D'/%3e%3cstop offset='100%25' stop-color='%23CB6000'/%3e%3c/linearGradient%3e%3cfilter id='c' width='118.8%25' height='118.8%25' x='-9.4%25' y='-9.4%25' filterUnits='objectBoundingBox'%3e%3cfeGaussianBlur in='SourceAlpha' result='shadowBlurInner1' stdDeviation='1'/%3e%3cfeOffset dy='-1' in='shadowBlurInner1' result='shadowOffsetInner1'/%3e%3cfeComposite in='shadowOffsetInner1' in2='SourceAlpha' k2='-1' k3='1' operator='arithmetic' result='shadowInnerInner1'/%3e%3cfeColorMatrix in='shadowInnerInner1' values='0 0 0 0 0.921365489 0 0 0 0 0.460682745 0 0 0 0 0 0 0 0 0.35 0'/%3e%3c/filter%3e%3cfilter id='g' width='111.1%25' height='133.3%25' x='-5.6%25' y='-16.7%25' filterUnits='objectBoundingBox'%3e%3cfeGaussianBlur in='SourceAlpha' result='shadowBlurInner1' stdDeviation='.5'/%3e%3cfeOffset in='shadowBlurInner1' result='shadowOffsetInner1'/%3e%3cfeComposite in='shadowOffsetInner1' in2='SourceAlpha' k2='-1' k3='1' operator='arithmetic' result='shadowInnerInner1'/%3e%3cfeColorMatrix in='shadowInnerInner1' values='0 0 0 0 0.0980392157 0 0 0 0 0.101960784 0 0 0 0 0.2 0 0 0 0.819684222 0'/%3e%3c/filter%3e%3cfilter id='h' width='204%25' height='927.2%25' x='-52.1%25' y='-333.3%25' filterUnits='objectBoundingBox'%3e%3cfeOffset dy='1' in='SourceAlpha' result='shadowOffsetOuter1'/%3e%3cfeGaussianBlur in='shadowOffsetOuter1' result='shadowBlurOuter1' stdDeviation='1.5'/%3e%3cfeColorMatrix in='shadowBlurOuter1' values='0 0 0 0 0.803921569 0 0 0 0 0.388235294 0 0 0 0 0.00392156863 0 0 0 0.14567854 0'/%3e%3c/filter%3e%3cpath id='b' d='M16 8A8 8 0 110 8a8 8 0 0116 0'/%3e%3cpath id='f' d='M3.5 5.5c0-.828.559-1.5 1.25-1.5S6 4.672 6 5.5C6 6.329 5.441 7 4.75 7S3.5 6.329 3.5 5.5zm6.5 0c0-.828.56-1.5 1.25-1.5.691 0 1.25.672 1.25 1.5 0 .829-.559 1.5-1.25 1.5C10.56 7 10 6.329 10 5.5z'/%3e%3cpath id='i' d='M11.068 1.696c.052-.005.104-.007.157-.007.487 0 .99.204 1.372.562a.368.368 0 01.022.51.344.344 0 01-.496.024c-.275-.259-.656-.4-.992-.369a.8.8 0 00-.59.331.346.346 0 01-.491.068.368.368 0 01-.067-.507 1.49 1.49 0 011.085-.612zm-7.665.555a2.042 2.042 0 011.372-.562 1.491 1.491 0 011.242.619.369.369 0 01-.066.507.347.347 0 01-.492-.068.801.801 0 00-.59-.331c-.335-.031-.717.11-.992.369a.344.344 0 01-.496-.024.368.368 0 01.022-.51z'/%3e%3c/defs%3e%3cg fill='none'%3e%3cuse fill='url(%23a)' xlink:href='%23b'/%3e%3cuse fill='black' filter='url(%23c)' xlink:href='%23b'/%3e%3cpath fill='url(%23d)' d='M5.643 10.888C5.485 12.733 6.369 14 8 14c1.63 0 2.515-1.267 2.357-3.112C10.2 9.042 9.242 8 8 8c-1.242 0-2.2 1.042-2.357 2.888'/%3e%3cuse fill='url(%23e)' xlink:href='%23f'/%3e%3cuse fill='black' filter='url(%23g)' xlink:href='%23f'/%3e%3cpath fill='%234E506A' d='M4.481 4.567c.186.042.29.252.232.469-.057.218-.254.36-.44.318-.186-.042-.29-.252-.232-.47.057-.216.254-.36.44-.317zm6.658.063c.206.047.322.28.258.52-.064.243-.282.4-.489.354-.206-.046-.322-.28-.258-.521.063-.242.282-.4.49-.353z'/%3e%3cuse fill='black' filter='url(%23h)' xlink:href='%23i'/%3e%3cuse fill='url(%23j)' xlink:href='%23i'/%3e%3c/g%3e%3c/svg%3e" class="post_ooo" />
            <p>{noLikes} {noLikes == 1 ? "Like" : "Likes"}</p>
            </div>

            <div class="hr" />

            <div className="post__likeoptions">
                <div className="like" onClick={likeHandle}>
                    <i className={show} />
                    <h3 className={show2}>Like</h3>
                </div>
                <div className="comment">
                    <i className="comment2" />
                    <h3 class="dope">Comment</h3>
                </div>
                <div className="share">
                    <i className="share2" />
                    <h3>Share</h3>
                </div>
            </div>
            <form onSubmit={postComment}>
                <div className="commentBox">
                    <Avatar
                        className="post__avatar2"
                        alt=""
                        src={user?.photoURL}
                    />
                    <input className="commentInputBox" type="text" placeholder="Write a comment ... " value={comment} onChange={(e) => setComment(e.target.value)} />
                    <input type="submit" disabled={!comment} className="transparent__submit" />
                </div>
                <p className="pressEnterToPost">Press Enter to post</p>
            </form>

            {
                comments.map((comment) => (
                    <div className={`comments__show ${comment.username == postUser?.displayName && 'myself'}`}>
                        <Avatar
                            className="post__avatar2"
                            alt=""
                            src={comment.photoURL}
                        />
                        <div class="container__comments">
                            <p><span>{comment.username}</span><i class="post__verified"></i>&nbsp;{comment.text}</p>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default Post
