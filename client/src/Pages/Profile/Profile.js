import React, { useState, useEffect } from 'react';
import './Profile.css';
//Components
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
//Functions
import VerificationCheck from '../../Functions/VerificationCheck';
//Dependencies
import { useNavigate, useLocation, useParams } from 'react-router-dom';

const Profile = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {AccountUsername} = useParams();
    const userLoggedIn = VerificationCheck.CheckLogin();
    const LoggedInUser = VerificationCheck.CheckUser();
    const LogOutStatus = VerificationCheck.GetLogoutStatus(AccountUsername)
    const [loggedInUserData, setLoggedInUserData] = useState(VerificationCheck.GetUserProps());
    const [isLoading, setIsLoading] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [showButtons, setShowButtons] = useState(true);
    const isAdmin = VerificationCheck.GetAdminRole();

    useEffect(() => {
        setIsLoading(true);
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
        else if (AccountUsername.toLowerCase() !== LoggedInUser.toLowerCase()) {
            navigate('/');
        }
        else {
            loggedInUserData.then(res => setFirstName(res.data[0].userFirstName))
            loggedInUserData.then(res => setLastName(res.data[0].userLastName));
            loggedInUserData.then(res => setEmail(res.data[0].userEmail));
            if (isAdmin) {
                setShowButtons(false);
            }
        }
        setIsLoading(false);
    }, [userLoggedIn]);

    return (
        <>
            <Header/>
            <div className='profileBody'>
                <div className='profileForm'>
                    {isLoading ?
                        <>
                            <h1 className='status'>Loading...</h1>
                        </>
                        :
                        <>
                            <h1>{firstName} {lastName}</h1>
                            <div className='profileFormInfo'>
                                <p><b>Username:</b> {LoggedInUser}</p>
                                <p><b>Email:</b> {email}</p>
                            </div>
                            <a href={`/Profile/${LoggedInUser}/Update`}><button className='profileButton'>Update Profile</button></a>
                            <a href={`/Profile/${LoggedInUser}/Posts`}><button className='profileButton'>View Posts</button></a>
                            {showButtons ? <a href={`/Profile/${LoggedInUser}/Delete`}><button className='profileButton'>Delete Profile</button></a> : <></>}
                        </>
                    }    
                </div>
            </div>
            <Footer/>  
        </>
    );
}

export default Profile;
