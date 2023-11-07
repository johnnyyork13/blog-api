import React from 'react';
import Comment from './Comment';
import {v4 as uuidv4} from 'uuid'; 

export default function Post(props) {

    const [post, setPost] = React.useState({});
    const [deletePost, setDeletePost] = React.useState(false);
    const [comment, setComment] = React.useState({
        author: "",
        body: "",
        date: ""
    });
    const [sendComment, setSendComment] = React.useState(false);

    React.useEffect(() => {
        const url = `http://localhost:3000/blog/post/${props.currentPost._id}`;
        async function getPost() {
            try {
                await fetch(url)
                .then((res) => res.json())
                .then((data) => setPost(data));
            } catch(err) {
                console.log(err);
            }
        }
        getPost();
    }, [sendComment]);

    React.useEffect(() => {
        const url = `http://localhost:3000/blog/post/${props.currentPost._id}/delete`;
        async function handleDeletePost() {
            try {
                if (deletePost) {
                    await fetch(url, {
                        method: "POST",
                        mode: "cors",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({postID: props.currentPost._id})
                    })
                    .then(() => {props.setPage("home")});
                }
            } catch(err) {
                console.log(err);
            }
        }
        handleDeletePost();
    }, [deletePost])

    React.useEffect(() => {
        async function addComment() {
            if (sendComment) {
                try {
                    const url = `http://localhost:3000/blog/post/${props.currentPost._id}/addComment`;
                    await fetch(url, {
                        method: "POST",
                        mode: "cors",
                        headers: {
                            "Content-Type":"application/json",
                        },
                        body: JSON.stringify({
                            postID: props.currentPost._id,
                            comment: comment
                        })
                    }).then((res) => res.json())
                    .then((res) => setSendComment(false));
                } catch(err) {
                    console.log(err);
                }
            }
        }
        addComment();
    }, [sendComment])

    function handleCommentInputChange(e) {
        setComment((prev) => ({
            ...prev,
            [e.target.name] : e.target.value
        }))
    }

    function handleCommentSubmit() {
        setComment((prev) => ({
            ...prev,
            author: props.currentUser.displayName,
            date: new Date()
        }))
        setSendComment(true);
    }

    const mappedComments = (post && post.comments) && post.comments.map((comment, index) => {
        return <Comment 
            key={uuidv4()}
            isOdd={index % 2 === 0 ? false : true}
            comment={comment}
        />
    })

    const mappedTags = (post && post.tags) && post.tags.map((tag, index) => {
        return <span className="tag">{tag}{index < post.tags.length - 1 ? "," : ""}</span>
    })

    return (   
        <section className="post">
            <section className="post-title">
                <p className="post-title-header">
                    {post.title && post.title}
                </p>
                {props.currentUser &&
                    props.currentUser.username === post.author &&
                        <a className="post-delete-btn"
                            onClick={() => setDeletePost(true)}
                        >Delete Post</a>}
            </section>
            <p className="post-title-sub">Prompt created by <span className="post-title-sub-author">{post.author}</span></p>
            <p className="post-body">{post.body && post.body}</p>
            <p className="post-tags">Tags: {mappedTags}</p>
            <a className="post-page-btn post-back-btn" 
                onClick={() => props.setPage("home")}
            >Back Home</a>
            <section className="post-comments">
                {props.currentUser ? <section className="comment-input-container">
                    <textarea 
                        onChange={handleCommentInputChange} 
                        name="body" 
                        className="comment-body-input" 
                        placeholder="Comments" />
                    <button 
                        onClick={handleCommentSubmit} 
                        type="button" 
                        className="comment-submit-btn post-page-btn"
                    >Submit</button>
                </section> : <p className="comment-login-notification">You must be logged in to add comments. <span className="comment-login-btn" onClick={() => props.setPage("login")}>Log In</span></p>}
                <p className="comments-title">Comments</p>
                {post.comments && post.comments.length === 0 ?
                    <p className="comment-first-notification">Be the first to comment.</p> : 
                    mappedComments}
            </section>
        </section>
    )
}