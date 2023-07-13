import React, { useState, useEffect } from 'react';
import './ProfileUpdate.css'
//Components
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
//Functions
import EntryCheck from '../../Functions/EntryCheck';
import VerificationCheck from '../../Functions/VerificationCheck';
//Dependencies
import Axios from 'axios';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

const ProfileUpdate = () => {
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
    const [lastName, setLastName] = useState(null);
    const [email, setEmail] = useState(null);
    const [confirmEmail, setConfirmEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [newPassword, setNewPassword] = useState(null);
    const [confirmNewPassword, setConfirmNewPassword] = useState(null);
    const [statusMessage, setStatusMessage] = useState(null);

    useEffect(()=> {
        setIsLoading(true);
        if (userLoggedIn && !logOutStatus) {
            loggedInUserData.then(res => setUsername(res.data[0].userUsername));
            loggedInUserData.then(res => setFirstName(res.data[0].userFirstName))
            loggedInUserData.then(res => setLastName(res.data[0].userLastName));
            loggedInUserData.then(res => setEmail(res.data[0].userEmail));
            loggedInUserData.then(res => setConfirmEmail(res.data[0].userEmail));
            setIsLoading(false);
        }
        else if (logOutStatus) {
            setIsLoading(false);
            navigate('/Logout');
        }
        else if (AccountUsername !== loggedInUser) {
            navigate('/');
        }
        else {
            setIsLoading(false);
            navigate('/Login', {
                state: {
                    previousUrl: location.pathname,
                }
            });
        }
    }, [userLoggedIn]);

    const submitUpdateForm = () => {
        if (email !== confirmEmail){
            return setStatusMessage("Email and confirm email does not match!");
        }
        else if (EntryCheck.CheckEmail(email) == false){
            return setStatusMessage("Email Is Not Acceptable");
        }
        else if (password == null) {
            return setStatusMessage("Current Password Must Be Provided");
        }
        else if (password != null){
            if (newPassword !== confirmNewPassword){
                return setStatusMessage("Password and confirm password does not match!");
            }
            else if (EntryCheck.CheckPassword(password) == false){
                return setStatusMessage("Current Password Is Incorrect");
            }    
            else if (newPassword !== null && EntryCheck.CheckPassword(newPassword) == false){
                return setStatusMessage("New Password Is Not Acceptable");
            }    
        }

        setIsLoading(true);
        const url = process.env.REACT_APP_Backend_URL + '/user/update-a-user-record';
               
        Axios.post(url, {
            userUsername : loggedInUser,
            UserFirstName : firstName,
            UserLastName : lastName,
            UserUsername : username,
            UserEmail : email,
            UserPassword : password,
            UserNewPassword : newPassword
        })
        .then((response) => {
            console.log(response.data)
            if (response.data.message){
                setStatusMessage(response.data.message);
            }
            else if (response.data === "Updated Successfully") {
                navigate(`/Profile/${loggedInUser}`);
            }
            else {
                setStatusMessage("Update failed!");
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
            <div className='profileUpdateBody'>
                <div className='profileUpdateForm'>
                {isLoading ?
                    <>
                        <h1>Loading...</h1>
                    </>
                :
                    <>
                        <h1>Update Profile</h1>
                        <div className="username">
                            <input className='username' name='username' placeholder='Enter A Username' defaultValue={username} required autoComplete="off" disabled/>
                        </div>
                        <div className="name">
                            <input className='firstName' placeholder='First Name' defaultValue={firstName} required autoComplete="off" onChange={(e) => setFirstName(e.target.value)} />
                            <input className='lastName' placeholder='Last Name' defaultValue={lastName} required autoComplete="off" onChange={(e) => setLastName(e.target.value)} />
                        </div>
                        <div className="email">
                            <input className='email' placeholder='Email Address' type='email' defaultValue={email} required autoComplete="off" onChange={(e) => setEmail(e.target.value)} />
                            <input className='confirmEmail' placeholder='Confirm Email Address' type='email' defaultValue={confirmEmail} required autoComplete="off" onChange={(e) => setConfirmEmail(e.target.value)} />
                        </div>
                        <div className="password">
                            <input className='currentpassword' placeholder='Enter Current Password' type='password' defaultValue={password} required autoComplete="off" onChange={(e) => {setPassword(e.target.value); }} />
                        </div>
                        <div className="password">
                            <input className='password' placeholder='Enter New Password' type='password' defaultValue={newPassword} required autoComplete="off" onChange={(e) => {setNewPassword(e.target.value); }} />
                            <input className='confirmPassword' placeholder='Confirm New Password' type='password' defaultValue={confirmNewPassword} required autoComplete="off" onChange={(e) => {setConfirmNewPassword(e.target.value); }} />
                        </div>
                        {isLoading && <button className='profileUpdateButton' disabled>Loading...</button>}
                        {!isLoading && <button className='profileUpdateButton' type='submit' onClick={submitUpdateForm}>Update</button>}
                        {!isLoading && <a href={`/Profile/${loggedInUser}`}><button className='profileUpdateButton'>Cancel</button></a>}
                    </>
                }
                </div>
            {isLoading ? <></> : <>{statusMessage ? <h2>{statusMessage}</h2> : <></>}</>}
            </div>
            <Footer/>
        </>
    );
}

export default ProfileUpdate;
