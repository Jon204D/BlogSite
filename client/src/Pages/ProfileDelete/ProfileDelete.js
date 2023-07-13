import React, { useState, useEffect } from 'react';
import './ProfileDelete.css';
//Components
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
//Functions
import VerificationCheck from '../../Functions/VerificationCheck';
//Dependencies
import Axios from 'axios';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

const ProfileDelete = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {AccountUsername} = useParams();
    const userLoggedIn = VerificationCheck.CheckLogin();
    const loggedInUser = VerificationCheck.CheckUser();
    const logOutStatus = VerificationCheck.GetLogoutStatus(AccountUsername);
    const [loggedInUserData, setLoggedInUserData] = useState(VerificationCheck.GetUserProps());
    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState(null);
    const [firstName, setFirstName] = useState();
    const [statusMessage, setStatusMessage] = useState(null);
    const isAdmin = VerificationCheck.GetAdminRole();

    useEffect(()=> {
        setIsLoading(true);
        if (userLoggedIn && !logOutStatus){
            loggedInUserData.then(res => setUsername(res.data[0].userUsername));
            loggedInUserData.then(res => setFirstName(res.data[0].userFirstName))

            if (isAdmin){
                navigate(`/Profile/${username}`);
            }
        }
        else if (logOutStatus) {
            navigate('/Logout');
        }
        else if (AccountUsername.toLowerCase() !== loggedInUser.toLowerCase()) {
            navigate('/');
        }
        else {
            navigate('/Login', {
                state: {
                    previousUrl: location.pathname,
                }
            });
        }
        setIsLoading(false);
    }, [userLoggedIn]);

    const deleteUserProps = () => {
        setIsLoading(true);
        const url = process.env.REACT_APP_Backend_URL + '/user/delete-a-user-record';
                
        Axios.post(url, {
            UserUsername : username,
        })
        .then((response) => {
            if (response.data === "Delete Successful") {
                navigate('/Logout');
            }
            else {
                setStatusMessage("Deletion failed");
            }
            setIsLoading(false);
        })
        .catch((error) => {
            console.log("Server Side Error");
            setIsLoading(false);
        });
    };

    return (
        <>
            <Header/>
            <div className='profileDeleteBody'>
                <div className='profileDeleteForm'>
                    {isLoading ?
                        <h1 className='status'>Loading...</h1>
                            :
                        <>          
                            <h1>Delete Profile</h1>
                            <p><b>{firstName}</b>, are you sure you want to delete your account?</p>
                            <button className='profileDeleteButton' type='submit' onClick={deleteUserProps}>Yes</button>
                            <a href={`/Profile/${loggedInUser}`}><button className='profileDeleteButton'>No</button></a>
                        </>
                    }
                </div>
            {isLoading ? <></> : <>{statusMessage ? <h2>{statusMessage}</h2> : <></>}</>}
            </div>
            <Footer/>
        </>
    );
}

export default ProfileDelete;
