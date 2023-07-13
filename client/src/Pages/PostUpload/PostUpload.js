import React, { useEffect, useState } from "react";
import './PostUpload.css';
//Components
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
//Dependencies
import Axios from 'axios';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
//Function
import VerificationCheck from "../../Functions/VerificationCheck";

const PostUpload = () => {
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
    }, [userLoggedIn]);

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
        const url = process.env.REACT_APP_Backend_URL + '/post/insert-post-record';
                
        await Axios.post(url, {
            PostsTitle : title,
            PostsCaption : caption,
            PostsAuthor : loggedInUser
        })
        .then((response) => {
            if (response.data.message){
                setStatusMessage(response.data.message);
            }
            else if (response.data === "Uploaded Successfully") {
                navigate('/');
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
                <div className="postUploadBody">
                    <form className="postUploadForm">
                        <h1>What's On Your Mind?</h1>
                        <div className="title">
                            <input className="title" placeholder="Enter Title For This Post" autoComplete="off" maxLength={500} required defaultValue={title} onChange={(e) => {setTitle(e.target.value); }} />
                        </div>
                        <div className="caption">
                            <textarea className="caption" placeholder="Enter Article For This Post" autoComplete="off" maxLength={3000} required defaultValue={caption} onChange={(e) => {textareaLengthCheck(e.target.value); }} />
                            <p>Article Characters left: {captionCharacters}</p>
                        </div>
                        {isLoading && <button className='postUploadButton' disabled>Loading...</button>}
                        {!isLoading && <button className='postUploadButton' type='submit' onClick={submitForm}>Upload Post</button>}
                    </form>
                    {isLoading ? <></> : <>{statusMessage ? <h2>{statusMessage}</h2> : <></>}</>}
                </div>
           <Footer/> 
        </>
    );
}

export default PostUpload;
