import Axios from 'axios';

const CheckLogin = () => {
    const userLoggedIn = sessionStorage.getItem('escapeLoggedin');
    
    if (userLoggedIn) {
        return userLoggedIn;
    }
    else {
        return false;
    }
}

const CheckUser = () => {
    if(CheckLogin())
    {
        const loggedUser = sessionStorage.getItem('escapeUsername');
        return loggedUser;
    }
    else {
        return null;
    }
}

const GetAdminRole = () => {
    const isAdmin = sessionStorage.getItem('escapeAdmin');

    if (CheckLogin()){
        if (isAdmin == "true") {
            return isAdmin;
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
}

const GetLogoutStatus = (urlAccountUsername) => {
    if (CheckLogin()) {
        if (urlAccountUsername.trim() === CheckUser()) {
            return false;
        }
        else {
            return true; 
        }
    }
    else {
        return true;
    }
}

const GetUserProps = async () => {
    if (CheckLogin()){
        const url = process.env.REACT_APP_Backend_URL + '/user/get-a-user-record';
        return await Axios.post(url, {UserUsername : CheckUser()})
        .then((response) =>  {
            return response;
        })
        .catch((error) => {
            console.log(error);
            return null;
        })
    }
}

export default {CheckLogin, CheckUser, GetAdminRole, GetLogoutStatus, GetUserProps};