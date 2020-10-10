import React, { useState, useEffect } from 'react'
import ImageUpload from './ImageUpload';
import Post from './Post';
import './Posts.css';
import firebase from 'firebase';
import { db } from './firebase';
import { useHistory } from 'react-router-dom';

function Posts({ user }) {
    const history = useHistory("");
    const [posts, setPosts] = useState([]);

    document.title = 'Facebook';

    if (user === undefined) {
        history.push("/login")
    }

    useEffect(() => {
        db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
            setPosts(snapshot.docs.map(doc => ({
                id: doc.id,
                post: doc.data(),
            })));
        })
    }, []);
    return (
        <div className="posts">
            <ImageUpload />
            {
                posts.map(({ id, post }) => (
                    < Post key={id} postId={id} posterImage={post.posterImage} origuser={user?.displayName} username={post.username} userId={user.uid} caption={post.caption} imageUrl={post.imageUrl} noLikes={post.noLikes} user={user} />
                ))
            }
        </div>
    )
}

export default Posts