import React, { useEffect, useState } from "react";
import './Register.css';
//Components
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
//Dependencies
import Axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
//Functions
import EntryCheck from '../../Functions/EntryCheck';

const Register = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [username, setUsername] = useState(null);
    const [email, setEmail] = useState(null);
    const [confirmEmail, setConfirmEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState(null);
    const [statusMessage, setStatusMessage] = useState(null);

    const submitForm = async () => {
        setStatusMessage(null);
        if (firstName == null || lastName == null || username == null || email == null || confirmEmail == null || password == null || confirmPassword == null){
            return setStatusMessage("All fields with \"*\" be filled in!");
        }
        else if (EntryCheck.CheckUsername(username) === false){
            return setStatusMessage("Username Is Not Acceptable");
        }
        else if (email !== confirmEmail){
            return setStatusMessage("Email and confirm email does not match!");
        }
        else if (EntryCheck.CheckEmail(email) === false){
            return setStatusMessage("Email Is Not Acceptable");
        }
        else if (password !== confirmPassword){
            return setStatusMessage("Password and confirm password does not match!");
        }
        else if (EntryCheck.CheckPassword(password) === false){
            return setStatusMessage(<>Password Is Not Acceptable!<br/><br/>Password must contain the following:<br/>Uppercase Letter<br/>Lowercase Letter<br/>Numbers<br/>Special Characters</>);
        }

        setIsLoading(true);
        const url = process.env.REACT_APP_Backend_URL + '/user/insert-user-record';
                
        await Axios.post(url, {
            UserFirstName : firstName,
            UserLastName : lastName,
            UserUsername : username,
            UserEmail : email,
            UserPassword : password
        })
        .then((response) => {
            if (response.data.message){
                setStatusMessage(response.data.message);
            }
            else if (response.data === "Saved Successfully") {
                navigate('/Login');
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
            <div className="registerBody">
                <form className='registerForm'>
                    <h1>Register</h1>
                    <div className="username">
                        <input className='username' name='username' placeholder='Enter A Username' required autoComplete="off" defaultValue={username} onChange={(e) => {setUsername(e.target.value); }} />
                    </div>
                    <div className="name">
                        <input className='firstName' placeholder='First Name' required autoComplete="off" defaultValue={firstName} onChange={(e) => setFirstName(e.target.value)} />
                        <input className='lastName' placeholder='Last Name' required autoComplete="off" defaultValue={lastName} onChange={(e) => setLastName(e.target.value)} />
                    </div>
                    <div className="email">
                        <input className='email' placeholder='Email Address' type='email' required autoComplete="off" defaultValue={email} onChange={(e) => setEmail(e.target.value)} />
                        <input className='confirmEmail' placeholder='Confirm Email Address' type='email' required autoComplete="off" defaultValue={confirmEmail} onChange={(e) => setConfirmEmail(e.target.value)} />
                    </div>
                    <div className="password">
                        <input className='password' placeholder='Enter A Password' type='password' required autoComplete="off" defaultValue={password} onChange={(e) => {setPassword(e.target.value); }} />
                        <input className='confirmPassword' placeholder='Confirm Password' type='password' required autoComplete="off" defaultValue={confirmPassword} onChange={(e) => {setConfirmPassword(e.target.value); }} />
                    </div>
                    {isLoading && <button className='registerButton' disabled>Loading...</button>}
                    {!isLoading && <button className='registerButton' type='submit' onClick={submitForm}>Register</button>}
                </form>
                {isLoading ? <></> : <>{statusMessage ? <h2>{statusMessage}</h2> : <></>}</>}
            </div>
            <Footer/>
        </>
    );
}

export default Register;
