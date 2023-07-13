import React from 'react';
import './Logout.css';
//Components
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
//Functions
import VerificationCheck from '../../Functions/VerificationCheck';
//Dependencied
import { Link } from 'react-router-dom';

const Logout = () => {
    const userLoggedIn = VerificationCheck.CheckLogin();

    if (userLoggedIn){
        sessionStorage.removeItem('escapeLoggedin');
        sessionStorage.removeItem('escapeUsername');
        sessionStorage.removeItem('escapeAdmin');
    }
    return (
        <>
            <Header/>
            <div className="logoutBody">
                <form className='logoutForm'>
                    <h1>Logged out!</h1>
                    <p>Select <strong>login</strong> to sign back in!</p>
                    <Link to='/login'><button className='logoutButton'>Login</button></Link>
                </form>
            </div>
            <Footer/>          
        </>
    );
}

export default Logout;
