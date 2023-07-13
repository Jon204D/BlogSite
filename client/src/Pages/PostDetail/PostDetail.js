import React, { useEffect, useState, useRef } from "react";
import './PostDetail.css';
//Components
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
import ThreeDots from '../../Images/658625-200.png';
//Dependencies
import Axios from 'axios';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { RWebShare } from "react-web-share";
//Function
import VerificationCheck from "../../Functions/VerificationCheck";

const PostDetail = () => {
    const {PostID} = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const ref = useRef(null);
    const userLoggedIn = VerificationCheck.CheckLogin();
    const loggedInUser = VerificationCheck.CheckUser();
    const [isLoading, setIsLoading] = useState(false);
    const [posts, setPost] = useState([]);
    const [postsComment, setPostComment] = useState([]);
    const [postLikes, setPostLikes] = useState([]);
    const [title, setTitle] = useState("")
    const [statusMessage, setStatusMessage] = useState(null);
    const [showMenu, setShowMenu] = useState(false);
    let menu = null;
    const [showButton, setShowButton] = useState(true);
    const [comment, setComment] = useState(null);
    const [editComment, setEditComment] = useState(false);
    const [didUserLike, set_did_user_like] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        if (!userLoggedIn) {
            navigate('/Login', {
                state: {
                    previousUrl: location.pathname,
                }
            });
        }
        else {
            getAPostRecord();
        }
        setIsLoading(false);
    }, [userLoggedIn]);
    
    //Get Posts
    const getAPostRecord = async () => {
        const url = process.env.REACT_APP_Backend_URL + '/post/get-a-post-record';

        await Axios.post (url, {PostsID : PostID})
        .then ((response) => {
            if(loggedInUser.toLowerCase() !== response.data[0].postsAuthor.trim().toLowerCase()){
                setShowButton(false);
            }
            for (var i = 0; i < response.data.length; i++){
                response.data[i].displayMore = false;
            }
            setPost(response.data);
            setTitle(response.data[0].postsTitle);
            getAPostCommentRecord();
            getAPostLikeRecord(PostID);
        })
        .catch((error) => {
            setStatusMessage("Server Side Error");
        });
    }

    //Get Comments
    const getAPostCommentRecord = async () => {
        const url = process.env.REACT_APP_Backend_URL + '/post/get-comment-record';

        await Axios.post (url, {PostsID : PostID})
        .then ((response) => {
            setPostComment(response.data);
        })
        .catch((error) => {
            setStatusMessage("Server Side Error");
        });
    }
    
    //Get Likes
    const getAPostLikeRecord = async (PostID) => {
        const url = process.env.REACT_APP_Backend_URL + '/post/get-like-record';

        await Axios.post (url, {
            PostsID : PostID
        })
        .then ((response) => {
            if (response.data.length !== 0) {
                setPostLikes(response.data);
                
                for (var i = 0; i < response.data.length; i++) {
                    if (response.data[i].postsLikeAuthor.trim() === loggedInUser){
                        set_did_user_like(true);
                    }
                }
            }
            else {
                set_did_user_like(false);
            }
        })
        .catch((error) => {
            console.log(error)
            setStatusMessage("Server Side Error");
        });
    }

    //Delete Post
    const deleteAPostRecord = async () => {
        let isOk = window.confirm("Do you really want to delete \"" + title .trim()+ "\"?");
        
        if (isOk){
            const url = process.env.REACT_APP_Backend_URL + '/post/delete-a-post-record';
            await Axios.post(url, {PostsID : PostID})
            .then(response => {
                if (response.data.trim() === "Delete Successful"){
                    setStatusMessage("Post Successfully Deleted")
                    setTimeout(() => {
                        navigate('/');
                    }, 2000);
                }
            })
            .catch(error => {
                setStatusMessage("Server Side Error");
            })
        }
    }

    //Add Comments
    const submitAComment = async () => {
        const url = process.env.REACT_APP_Backend_URL + '/post/insert-a-comment-record';

        await Axios.post(url, {
            PostsID : PostID,
            postsComment : comment,
            postsCommentAuthor : loggedInUser
        })
        .then(response => {
            if (response.data.trim() === "Saved Successfully") {
                Array.from(document.querySelectorAll('textarea')).forEach(textarea => (textarea.value = null));
                setComment(null);
                getAPostRecord();
            }
        })
        .catch(error => {
            setStatusMessage("Server Side Error");
        })
    }

    const deleteAComment = async (PostCommentID, PostID) => {
        const url = process.env.REACT_APP_Backend_URL + '/post/delete-a-comment-record';

        await Axios.post(url, {
            postsCommentID : PostCommentID,
            PostsID : PostID
        })
        .then(response => {
            if (response.data.trim() === "Delete Successful"){
                getAPostRecord();
            }
        })
        .catch(error => {
            setStatusMessage("Server Side Error");
        })
    }

    const updateLikeRecord = async (PostID) => {
        const url = process.env.REACT_APP_Backend_URL + '/post/update-like-record';

        await Axios.post (url, {
            PostsID : PostID,
            postsLikeAuthor : loggedInUser
        })
        .then ((response) => {
            if (response.data === "Saved Successfully") {
                getAPostRecord();
                window.location.reload();
            }
        })
        .catch((error) => {
            setStatusMessage("Server Side Error");
        });
    }

    const userLiked = {
        border: '0.15em rgb(61, 114, 164) solid',
        color: 'black',
        backgroundColor: 'rgb(155, 209, 250)',
        cursor: 'pointer',
    }

    //Show More/Show Less Button Handler
    const handleShowMore = (post_id) => {
                
        const current_state = [...posts];
        const current_post = current_state.find(p => p.postsID === post_id);
      
        if(!current_post) {
            // couldn't find the post, ID's dont match
            return;
        }

        // replace the current state to the opposite
        current_post.displayMore = !current_post.displayMore;
        setPost(current_state);
    }
    
    const showMenuBoolean = () => {
        if (!showMenu){
            setShowMenu(true);
        }
        else {
            setShowMenu(false);
        }
    }

    //Scroll to Comment Field
    const ScrollToCommentField = () => {
        ref.current?.scrollIntoView({behavior: 'smooth'});
    };    

    if (showMenu){
        menu = 
        <nav>
            <ul>
                <a href={`/${loggedInUser}/Post/${PostID}/Update`}><li>Update</li></a>
                <li onClick={deleteAPostRecord}>Delete</li>
            </ul>
        </nav>
    }

    return (
        <>
            <Header/>
            <div className='postDetailBody'>
                <div className="postDetailForm">
                    {isLoading ?
                    <>
                        <h1 className='status'>Loading...</h1>
                    </>
                    :
                    <>
                        {statusMessage ? 
                        <>
                            <h1 className='status'>{statusMessage}</h1>
                        </>
                        :
                        <>
                            {posts.map((uploadedPost) => (
                                <table key={uploadedPost.postsID}>
                                    <tbody className="postData" key={uploadedPost.postsID}>
                                        {showButton ? <img className='ThreeDots' src={ThreeDots} alt ="Three Button" onClick={showMenuBoolean}/> : <></> }
                                        {showButton ? <>{menu}</> : <></> }
                                        <tr><td><h1 className="title">{uploadedPost.postsTitle}</h1></td></tr>
                                        <tr>
                                            <td>
                                                <div className="authorDate">
                                                    <a href={`/Profile/${uploadedPost.postsAuthor}/Posts`}><h2 className="author">Author: {uploadedPost.postsAuthor}</h2></a>
                                                    <h3 className="datetime">{uploadedPost.createdOn}</h3>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr><td className="btn"><button className="btn" onClick={() => handleShowMore(uploadedPost.postsID)}>{uploadedPost.displayMore ? "Show less" : "Show more"}</button></td></tr>
                                        <tr><td><p className="caption">{uploadedPost.displayMore ? uploadedPost.postsCaption : `${uploadedPost.postsCaption.substring(0, 250)}`}{uploadedPost.displayMore ? "" : "..."}</p></td></tr>
                                        <tr><td>{didUserLike ? <button className="interaction" style={userLiked} onClick={() => updateLikeRecord(uploadedPost.postsID)}>{uploadedPost.postsLikes} Like(s)</button> : <button className="interaction" onClick={() => updateLikeRecord(uploadedPost.postsID)}>{uploadedPost.postsLikes} Like(s)</button>} <button className="interaction" onClick={ScrollToCommentField}>{uploadedPost.postsComments} Comment(s)</button> <RWebShare data={{text: `${uploadedPost.postsCaption}`, url:`/Post/${uploadedPost.postsID}`, title: `${uploadedPost.postsTitle}`}}><button className="interaction">Share</button></RWebShare></td></tr>
                                    {postsComment.map((uploadedComments) => (
                                        <>
                                            <tr className="line"><td><hr/></td></tr>
                                            <tr className="authorData">
                                                <td className="authorDate">
                                                    <div className="authorDate">
                                                        <p className="author">Author: {uploadedComments.postsCommentAuthor}</p>
                                                        <p className="datetime">{uploadedComments.createdOn}</p>
                                                    </div>
                                                </td>
                                                <td className="commentInterations">
                                                    <button className="commentInterations" onClick={() => deleteAComment(uploadedComments.postsCommentID, uploadedComments.postsID)}>Delete</button>
                                                </td>
                                            </tr>
                                            <tr className="commentRow"><td className="commentdata"><p className="comment">{uploadedComments.postsComment}</p></td></tr>
                                        </>
                                    ))}
                                    </tbody>                                    
                                </table>
                            ))}
                            <textarea ref={ref} placeholder="Enter Comment" autoComplete="off" maxLength={445} required defaultValue={comment} onChange={(e) => { setComment(e.target.value)}} />
                            {comment ? <button className="submit" onClick={() => submitAComment()}>Submit Comment</button> : <></>}
                        </>
                        }
                    </>
                    }
                </div>
            </div>
            <Footer />
        </>
    );
}

export default PostDetail;
