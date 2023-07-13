import React, { useEffect, useState } from 'react';
import './Header.css';
import farBars from '../../Images/naviconrww752.png';
import VerificationCheck from'../../Functions/VerificationCheck';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const reRoute = useNavigate();
    const userLoggedIn = VerificationCheck.CheckLogin();
    const loggedInUser = VerificationCheck.CheckUser();
    const [buttonLabel, setButtonLabel] = useState('Login');
    const [showMenu, setShowMenu] = useState(false);
    let menu = null;

    useEffect(() => {
        if (userLoggedIn){
        setButtonLabel('Logout');
        }
        else {
        setButtonLabel('Login');
        }
    }, []);

    const routeChange = () =>{
        if (userLoggedIn){
        reRoute('/logout');
        }
        else {
        reRoute('/login');
        }
    }

    const showMenuBoolean = () => {
        if (!showMenu){
            setShowMenu(true);
        }
        else {
            setShowMenu(false);
        }
    }

    if (showMenu){
        menu = 
        <nav className='mobileNav'>
            <ul>
            <button className='loginButton' onClick={routeChange}>{buttonLabel}</button>
            <li><a href='/'>Home</a></li>
            {userLoggedIn ? <li><a href={`/${loggedInUser}/Upload`}>Upload Post</a></li> : <></>}
            {userLoggedIn ? <li><a href={`/Profile/${loggedInUser}`}>Profile</a></li> : <></>}
            <li><a href='/AboutCatchingSouls'>About Us</a></li>
            <li><a href='/ContactCatchingSouls'>Contact Us</a></li>
            </ul>
        </nav>
    }

    return (
        <div className='headerBody'>
            <h1 className='companyName'>Escape</h1>
            <button className='loginButton' onClick={routeChange}>{buttonLabel}</button>
            <img className='farBars' src={farBars} alt ="FarBar Button" onClick={showMenuBoolean}/>
            {menu}
            <nav>
                <ul>
                    <li><a href='/'>Homepage</a></li>
                    {userLoggedIn ? <li><a href={`/${loggedInUser}/Upload`}>Upload Post</a></li> : <></>}
                    {userLoggedIn ? <li><a href={`/Profile/${loggedInUser}`}>Profile</a></li> : <></>}
                    <li><a href='/AboutUs'>About Us</a></li>
                    <li><a href='/ContactUs'>Contact Us</a></li>
                </ul>
            </nav>
        </div>
    );
}

export default Header;