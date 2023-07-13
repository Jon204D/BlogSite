import React, { useEffect, useState } from "react";
import './Login.css';
//Components
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
//Dependencies
import Axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
//Functions
import EntryCheck from '../../Functions/EntryCheck';
import VerificationCheck from '../../Functions/VerificationCheck';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const userLoggedIn = VerificationCheck.CheckLogin();
    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const [statusMessage, setStatusMessage] = useState(null);

    const login = async () => {
        setStatusMessage(null);
        if (username === null || password === null){
            return setStatusMessage("Username and password must be provided!");
        }
        else if(EntryCheck.CheckUsername(username) === false || EntryCheck.CheckPassword(password) === false){
            return setStatusMessage("Account Does Not Exist or Password Is Incorrect!");
        }
        else {
            setIsLoading(true);
        }

        const url = process.env.REACT_APP_Backend_URL + '/user/verify-user-login';

        await Axios.post(url, {
            UserUsername: username,
            UserPassword: password,
        })
        .then((response) => {
            setIsLoading(false);
            if (response.data.loggedIn) {
                sessionStorage.setItem('escapeLoggedin', response.data.loggedIn);
                sessionStorage.setItem('escapeUsername', response.data.username);

                if (response.data.isAdmin){
                    sessionStorage.setItem('escapeAdmin', response.data.isAdmin);
                }

                if (location.state == null) {
                    navigate('/');
                }
                else if (location.state.previousUrl !== location.pathname){
                    navigate(location.state);
                }
            } else {
                setStatusMessage(response.data.message);
            }
        })
        .catch((error) => {
            setIsLoading(false);
            setStatusMessage("Server Side Error");
        });
    }

    return (
        <>
            <Header/>
            <div className="loginBody">
                <form className='loginForm'>
                    <h1>Login</h1>
                    <input name='username' placeholder='Username' required autoComplete="off" defaultValue={username} onChange={(e) => {setUsername(e.target.value)}} />
                    <input name='password' placeholder='Password' type='password' required autoComplete="off" defaultValue={password} onChange={(e) => {setPassword(e.target.value) }} />
                    {isLoading && <button className='loginButton' disabled>Loading...</button>}
                    {!isLoading && <button className='loginButton' type='submit' onClick={login}>Login</button>}
                    {isLoading ? <h2 style={{color: "black"}}><a href='/Register' disabled>Register?</a> or <a href='/ForgotPassword' disabled>Reset Password?</a></h2> : <h2><a href='/Register'>Register?</a> or <a href='/ForgotPassword'>Reset Password?</a></h2>}
                </form>
            {isLoading ? <></> : <>{statusMessage ? <h2>{statusMessage}</h2> : <></>}</>}
            </div>
            <Footer/>          
        </>
    );
}

export default Login;
