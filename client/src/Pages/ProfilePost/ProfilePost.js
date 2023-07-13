import React, { useState, useEffect } from 'react';
import './ProfilePost.css';
//Components
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
//Functions
import VerificationCheck from '../../Functions/VerificationCheck';
//Dependencies
import Axios from 'axios';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

const ProfilePost = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {AccountUsername} = useParams();
    const userLoggedIn = VerificationCheck.CheckLogin();
    const LoggedInUser = VerificationCheck.CheckUser();
    const LogOutStatus = VerificationCheck.GetLogoutStatus(AccountUsername)
    const [isLoading, setIsLoading] = useState(false);
    const [posts, setPost] = useState([]);
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
            getArtistPostRecord();
        }
        setIsLoading(false);
    }, [userLoggedIn]);

    //Get Posts
    const getArtistPostRecord = async () => {
        const url = process.env.REACT_APP_Backend_URL + '/post/get-artist-post-record';

        await Axios.post (url, {
            PostsAuthor: AccountUsername
        })
        .then ((response) => {
            setPost(response.data);
        })
        .catch((error) => {
            setStatusMessage("Server Side Error");
        });
    }    

    return (
        <>
            <Header/>
            <div className='profilePostBody'>
                <div className='profilePostForm'>
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
                                <h1>{AccountUsername} Articles</h1>
                                {posts.map(uploadedPost => (
                                    <table key={uploadedPost.postsID}>
                                        <tbody key={uploadedPost.postsID}>
                                            <tr><td><a href={`/Post/${uploadedPost.postsID}`}><h1 className="title">{uploadedPost.postsTitle}</h1></a></td></tr>
                                            <tr><td><h2 className="author">Author: {uploadedPost.postsAuthor}</h2></td></tr>
                                            <tr><td><h3 className="datetime">{uploadedPost.createdOn}</h3></td></tr>
                                            <tr><td><p>{uploadedPost.postsLikes} Like(s) & {uploadedPost.postsComments} Comment(s)</p></td></tr>
                                        </tbody>
                                    </table>
                                ))}
                            </>
                        }
                        </>
                    }    
                </div>
            </div>
            <Footer/>  
        </>
    );
}

export default ProfilePost;
