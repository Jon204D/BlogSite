import React, { useEffect, useState } from "react";
import './Home.css'
//Components
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
//Dependencies
import Axios from 'axios';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { RWebShare } from "react-web-share";
//Function
import VerificationCheck from "../../Functions/VerificationCheck";


const Home = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const userLoggedIn = VerificationCheck.CheckLogin();
    const loggedInUser = VerificationCheck.CheckUser();
    const [isLoading, setIsLoading] = useState(false);
    const [posts, setPost] = useState([]);
    const [likes, setLikes] = useState([]);
    const [statusMessage, setStatusMessage] = useState(null);

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
            getAllPost();
        }
        setIsLoading(false);
    }, [userLoggedIn]);
    
    const getAllPost = async () => {
        const url = process.env.REACT_APP_Backend_URL + '/post/get-post-record';

        await Axios.post (url)
        .then ((response) => {
            for (var i = 0; i < response.data.length; i++){
                response.data[i].displayMore = false;
            }
            setPost(response.data);
        })
        .catch((error) => {
            setStatusMessage("Server Side Error");
        });
    }

    const updateLikeRecord = async (PostID) => {
        const url = process.env.REACT_APP_Backend_URL + '/post/update-like-record';

        await Axios.post (url, {
            PostsID : PostID,
            postsLikeAuthor : loggedInUser
        })
        .then ((response) => {
            if (response.data === "Saved Successfully") {
                getAllPost();
            }
        })
        .catch((error) => {
            setStatusMessage("Server Side Error");
        });
    }

    const userLiked = {
        border: '0.15em rgb(61, 114, 164) solid',
        color: 'black',
        backgroundColor: 'white',   
    }

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

    const CommentRedirect = (postsID) => {
        navigate(`/Post/${postsID}`);
    }

    return (
        <>
            <Header/>
            <div className='homeBody'>
                <div className="homeForm">
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
                            {posts.map(uploadedPost => (
                                <table key={uploadedPost.postsID}>
                                    <tbody className="postData" key={uploadedPost.postsID}>
                                        <tr><td><a href={`/Post/${uploadedPost.postsID}`}><h1 className="title">{uploadedPost.postsTitle}</h1></a></td></tr>
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
                                        <tr><td>{uploadedPost.didUserLike ? <button className="interaction" style={userLiked} onClick={() => updateLikeRecord(uploadedPost.postsID)}>{uploadedPost.postsLikes} Like(s)</button> : <button className="interaction" onClick={() => updateLikeRecord(uploadedPost.postsID)}>{uploadedPost.postsLikes} Like(s)</button>} <button className="interaction" onClick={() => CommentRedirect(uploadedPost.postsID)}>{uploadedPost.postsComments} Comment(s)</button> <RWebShare data={{text: `${uploadedPost.postsCaption}`, url:`/Post/${uploadedPost.postsID}`, title: `${uploadedPost.postsTitle}`}}><button className="interaction">Share</button></RWebShare></td></tr>
                                    </tbody>
                                </table>
                            ))}
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

export default Home;