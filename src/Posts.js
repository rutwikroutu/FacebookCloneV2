import React, { useState, useEffect } from 'react'
import ImageUpload from './ImageUpload';
import Post from './Post';
import './Posts.css';
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

    console.log(posts)
    
    return (
        <div className="posts">
            <ImageUpload />
            {
                posts.map(({ id, post }) => (
                    < Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} noLikes={post.noLikes} postUserId={post.uid} />
                ))
            }
        </div>
    )
}

export default Posts