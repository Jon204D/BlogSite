import React, { useEffect, useState } from "react";
import './PostUpdate.css';
//Components
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
//Dependencies
import Axios from 'axios';
import { useNavigate, useLocation, useParams, Link } from 'react-router-dom';
//Function
import VerificationCheck from "../../Functions/VerificationCheck";

const PostUpdate = () => {
    const {PostID} = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const {AccountUsername} = useParams();
    const userLoggedIn = VerificationCheck.CheckLogin();
    const loggedInUser = VerificationCheck.CheckUser();
    const LogOutStatus = VerificationCheck.GetLogoutStatus(AccountUsername)
    const [isLoading, setIsLoading] = useState(false);
    const [title, setTitle] = useState(null);
    const [caption, setCaption] = useState(null);
    const [captionCharacters, setCaptionCharacters] = useState(3000);
    const [statusMessage, setStatusMessage] = useState(null);

    useEffect(() => {
        if (!userLoggedIn) {
            navigate('/Login', {
                state: {
                    previousUrl: location.pathname,
                }
            });
        }
        else if (LogOutStatus) {
            navigate('/Logout');
        }
        else {
            getAPostRecord();
        }
    }, [userLoggedIn]);

    const getAPostRecord = async () => {
        const url = process.env.REACT_APP_Backend_URL + '/post/get-a-post-record';

        await Axios.post (url, {PostsID : PostID})
        .then ((response) => {
            if(response.data[0].postsAuthor.trim().toLowerCase() !== loggedInUser.toLowerCase()){
                navigate(`/Post/${PostID}`);
            }
            setTitle(response.data[0].postsTitle.trim());
            setCaption(response.data[0].postsCaption.trim());
            textareaLengthCheck(response.data[0].postsCaption.trim());
        })
        .catch((error) => {
            setStatusMessage("Server Side Error");
        });
    }

    const textareaLengthCheck = (textarea) => {
        var length = textarea.length;
        var charactersLeft = 3000 - length;
        setCaption(textarea);
        return setCaptionCharacters(charactersLeft);
    }

    const submitForm = async (e) => {
        e.preventDefault();
        setStatusMessage(null);
        if (title == null || caption == null){
            return setStatusMessage("All fields must be filled in!");
        }

        setIsLoading(true);
        const url = process.env.REACT_APP_Backend_URL + '/post/update-a-post-record';
                
        await Axios.post(url, {
            PostsID : PostID,
            PostsTitle : title,
            PostsCaption : caption,
            PostsAuthor : loggedInUser
        })
        .then((response) => {
            if (response.data.message){
                setStatusMessage(response.data.message);
            }
            else if (response.data === "Updated Successfully") {
                navigate(`/Post/${PostID}`);
            }
            else 
            {
                setStatusMessage("An error occurred");
            }
            setIsLoading(false);
        })
        .catch((error) => {
            setStatusMessage("Server Side Error");
            setIsLoading(false);
        });
    };

    return (
        <>
           <Header/>
                <div className="postUpdateBody">
                    <form className="postUpdateForm">
                        <h1>What's On Your Mind?</h1>
                        <div className="title">
                            <input className="title" placeholder="Enter Title For This Post" autoComplete="off" maxLength={500} required defaultValue={title} onChange={(e) => {setTitle(e.target.value); }} />
                        </div>
                        <div className="caption">
                            <textarea className="caption" placeholder="Enter Article For This Post" autoComplete="off" maxLength={3000} required defaultValue={caption} onChange={(e) => {textareaLengthCheck(e.target.value); }} />
                            <p>Article Characters left: {captionCharacters}</p>
                        </div>
                        {isLoading && <button className='postUpdateButton' disabled>Loading...</button>}
                        {!isLoading && <button className='postUpdateButton' type='submit' onClick={submitForm}>Update Post</button>}
                        {!isLoading && <Link to={`/Post/${PostID}`}><button className='postUpdateButton' type='submit'>Cancel</button></Link>}
                    </form>
                    {isLoading ? <></> : <>{statusMessage ? <h2>{statusMessage}</h2> : <></>}</>}
                </div>
           <Footer/> 
        </>
    );
}

export default PostUpdate;
